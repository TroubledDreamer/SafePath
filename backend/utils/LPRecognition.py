import os
import re
import json
from io import BytesIO
from pathlib import Path

import numpy as np
import requests
from PIL import Image

# Torch & Ultralytics
try:
    import torch
except Exception as e:
    raise RuntimeError(
        "PyTorch is required but not installed or failed to import. "
        "See setup steps below."
    ) from e

try:
    from ultralytics import YOLO
except Exception as e:
    raise RuntimeError(
        "Ultralytics (YOLO) is required but not installed. "
        "Run: pip install ultralytics"
    ) from e

# .env support for OCR key
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    # dotenv is optional; if not installed we'll fall back to environment only
    pass

# ---------------------------
# CONFIGURATION
# ---------------------------
IMAGE_FOLDER_RELATIVE = "LPlates/images"
MODEL_FOLDER_RELATIVE = "LPlates/models"
YOLO_MODEL_NAME = "LP-detection.pt"
JSON_PATH_NAME = "LPlates_results.json"

# Prefer env var; fallback to literal if present (discouraged)
OCR_API_KEY = os.environ.get("OCR_API_KEY") or os.environ.get("EXPO_PUBLIC_OCR_API_KEY") or os.environ.get("NEXT_PUBLIC_OCR_API_KEY")
if not OCR_API_KEY:
    # LAST RESORT: let it run but warn loudly
    print("WARNING: OCR_API_KEY not found in environment. Create a .env with OCR_API_KEY=... or export it before running.")
    OCR_API_KEY = "REPLACE_ME_OR_SET_ENV"

# Resolve paths relative to this file
SCRIPT_DIR = Path(__file__).resolve().parent
MODEL_FOLDER = SCRIPT_DIR / MODEL_FOLDER_RELATIVE
YOLO_MODEL_PATH = MODEL_FOLDER / YOLO_MODEL_NAME
IMAGE_FOLDER = SCRIPT_DIR / IMAGE_FOLDER_RELATIVE
JSON_PATH = SCRIPT_DIR / JSON_PATH_NAME

# ---------------------------
# DEVICE SELECTION (Mac-friendly)
# ---------------------------
def select_device():
    """
    Returns a device spec compatible with Ultralytics:
      - 'mps' on Apple Silicon if available (PyTorch MPS backend)
      - 0 for CUDA GPU if available
      - 'cpu' otherwise
    """
    try:
        if torch.backends.mps.is_available() and torch.backends.mps.is_built():
            return "mps"
        if torch.cuda.is_available():
            return 0  # first CUDA device
    except Exception:
        pass
    return "cpu"

DEVICE = select_device()
print(f"Using device: {DEVICE}")

# ---------------------------
# VALIDATE FOLDERS / CREATE IF MISSING
# ---------------------------
for p in (IMAGE_FOLDER, MODEL_FOLDER):
    if not p.exists():
        p.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {p}")

# ---------------------------
# HELPER: EXTRACT JAMAICAN PLATE
# ---------------------------
def extract_jamaican_plate(text: str):
    """
    Extract a valid Jamaican license plate from OCR text.
    Covers modern/old private, commercial/public, and some government formats,
    with correction for common 'P' misreads on taxi plates.
    """
    text = re.sub(r"[^A-Z0-9]", "", text.upper())

    # 1. Modern Private: ABC123 or ABC1234
    m = re.search(r"([A-Z]{3}[0-9]{3,4})", text)
    if m:
        return m.group(1)

    # 2. Old/Dealer/Commercial-like: AB1234 (with taxi P-correction)
    m = re.search(r"([A-Z]{2}[0-9]{4})", text)
    if m:
        plate = m.group(1)
        if plate[0] in ['R', 'F', 'S', 'B'] and plate[1].isalpha():
            return 'P' + plate[1:]
        return plate

    # 3. Commercial/Public: P1234/P12345 (with taxi P-correction)
    m = re.search(r"([A-Z][0-9]{4,5})", text)
    if m:
        plate = m.group(1)
        if plate[0] in ['R', 'F', 'S', 'B']:
            return 'P' + plate[1:]
        return plate

    # 4. Old Private: 1234AB
    m = re.search(r"([0-9]{4}[A-Z]{2})", text)
    if m:
        return m.group(1)

    # 5. Reversed Commercial/Public: 123ABC
    m = re.search(r"([0-9]{3}[A-Z]{3})", text)
    if m:
        return m.group(1)

    # 6. Government: GOV123
    m = re.search(r"(GOV[0-9]{3})", text)
    if m:
        return m.group(1)

    # Fallback: 6–7 alphanumerics
    m = re.search(r"([A-Z0-9]{6,7})", text)
    if m:
        return m.group(1)

    return None

# ---------------------------
# YOLO LOAD
# ---------------------------
def load_model_or_die(path: Path) -> YOLO:
    print("-" * 60)
    print(f"DEBUG: Model path → {path}")
    print("-" * 60)
    if not path.exists():
        raise FileNotFoundError(
            f"Model file not found at '{path}'. "
            f"Place '{YOLO_MODEL_NAME}' inside '{MODEL_FOLDER_RELATIVE}' (relative to this script)."
        )
    model = YOLO(str(path))
    print("SUCCESS: YOLO model loaded.")
    return model

# ---------------------------
# OCR CALL
# ---------------------------
def ocr_space_image_png_bytes(img_bytes: bytes, api_key: str) -> str:
    """
    Sends PNG bytes to OCR.Space and returns raw text (may be empty).
    """
    resp = requests.post(
        "https://api.ocr.space/parse/image",
        files={"file": ("plate.png", img_bytes)},
        data={
            "apikey": api_key,
            "language": "eng",
            "isOverlayRequired": False,
            "OCREngine": 2
        },
        timeout=60
    )
    resp.raise_for_status()
    data = resp.json()

    if data.get("IsErroredOnProcessing"):
        # OCR.Space sometimes returns list in ErrorMessage
        emsg = data.get("ErrorMessage") or data.get("ErrorDetails") or "Unknown OCR error"
        raise RuntimeError(f"OCR API error: {emsg}")

    try:
        parsed = data["ParsedResults"][0]["ParsedText"]
        return parsed or ""
    except (KeyError, IndexError):
        return ""

# ---------------------------
# MAIN
# ---------------------------
def main():
    # Load model
    try:
        model = load_model_or_die(YOLO_MODEL_PATH)
    except Exception as e:
        print(f"Error loading YOLO model: {e}")
        return

    # Gather images
    files = [p for p in IMAGE_FOLDER.iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png")]
    if not files:
        print(f"No image files found in '{IMAGE_FOLDER}'. Put images there and re-run.")
        return

    results_json = {}

    for img_path in files:
        print(f"\nProcessing: {img_path.name}")

        try:
            # Run detection (quiet)
            results = model(str(img_path), verbose=False, device=DEVICE)
            boxes = results[0].boxes
            if boxes is None or boxes.xyxy is None or len(boxes) == 0:
                print("No license plate detected.")
                results_json[img_path.name] = None
                continue

            xyxy = boxes.xyxy.cpu().numpy()
            confs = boxes.conf.cpu().numpy()
            best_idx = int(np.argmax(confs))
            xmin, ymin, xmax, ymax = xyxy[best_idx][:4].astype(int)

            # Crop with padding
            with Image.open(img_path) as original:
                padding = 15
                xmin = max(0, xmin - padding)
                ymin = max(0, ymin - padding)
                xmax = min(original.width,  xmax + padding)
                ymax = min(original.height, ymax + padding)

                cropped = original.crop((xmin, ymin, xmax, ymax))
                # Upscale for OCR
                cropped = cropped.resize(
                    (cropped.width * 3, cropped.height * 3),
                    Image.LANCZOS
                )

                buf = BytesIO()
                cropped.save(buf, format="PNG")
                img_bytes = buf.getvalue()

            # OCR
            try:
                parsed_text = ocr_space_image_png_bytes(img_bytes, OCR_API_KEY)
            except requests.exceptions.RequestException as e:
                print(f"Network/API Request Error: {e}")
                results_json[img_path.name] = None
                continue
            except Exception as e:
                print(f"OCR error: {e}")
                results_json[img_path.name] = None
                continue

            clean_preview = parsed_text.strip().replace("\n", " ")
            print(f"Raw OCR Text: '{clean_preview}'")

            plate = extract_jamaican_plate(parsed_text)
            if plate:
                print(f"Valid Jamaican Plate: {plate}")
                results_json[img_path.name] = plate
            else:
                print("No valid Jamaican plate detected after OCR processing.")
                results_json[img_path.name] = None

        except Exception as e:
            print(f"Unexpected error on {img_path.name}: {e}")
            results_json[img_path.name] = None

    if results_json:
        try:
            with open(JSON_PATH, "w") as f:
                json.dump(results_json, f, indent=4)
            print(f"\n✨ Done. Results saved to: {JSON_PATH}")
        except Exception as e:
            print(f"\nError saving JSON file: {e}")

if __name__ == "__main__":
    main()
