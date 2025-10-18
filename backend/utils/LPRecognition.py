import os
import re
import json
import requests
from PIL import Image
import numpy as np
from ultralytics import YOLO
from io import BytesIO

# ---------------------------
# CONFIGURATION & ROBUST PATH RESOLUTION (RELATIVE TO SCRIPT'S LOCATION)
# ---------------------------
# Define constants
# Note: These are now relative paths from the script's directory (/backend/utils/)
IMAGE_FOLDER_RELATIVE = "LPlates/images"
MODEL_FOLDER_RELATIVE = "LPlates/models"
YOLO_MODEL_NAME = "LP-detection.pt"
JSON_PATH_NAME = "LPlates_results.json"
OCR_API_KEY = "K87899988388957"

# Get the absolute path of the directory where the current script resides
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Construct absolute paths directly from the script's directory (SCRIPT_DIR)
# This assumes the structure: /utils/LPlates/{images, models}
MODEL_FOLDER = os.path.join(SCRIPT_DIR, MODEL_FOLDER_RELATIVE)
YOLO_MODEL_PATH = os.path.join(MODEL_FOLDER, YOLO_MODEL_NAME)
IMAGE_FOLDER = os.path.join(SCRIPT_DIR, IMAGE_FOLDER_RELATIVE)

# Save JSON result one level up (in the /backend/utils/ folder) for convenience
JSON_PATH = os.path.join(SCRIPT_DIR, JSON_PATH_NAME) 

# --- Setup: Create necessary folders if they don't exist ---
for folder in [IMAGE_FOLDER, MODEL_FOLDER]:
    if not os.path.isdir(folder):
        try:
            os.makedirs(folder)
            print(f"Created directory: '{folder}' relative to script.")
        except OSError as e:
            print(f"Error creating directory '{folder}': {e}")
            exit()

# ---------------------------
# INITIALIZE YOLO MODEL 
# ---------------------------
try:
    print("-" * 50)
    print(f"DEBUG: Calculated Model Path: {YOLO_MODEL_PATH}")
    print("-" * 50)
    
    # Check if the model file is physically present at the calculated path
    if not os.path.exists(YOLO_MODEL_PATH):
         raise FileNotFoundError(
             f"Model file not found at '{YOLO_MODEL_PATH}'. "
             f"Please ensure your '{YOLO_MODEL_NAME}' is inside the '{MODEL_FOLDER_RELATIVE}' folder, relative to the script."
         )
         
    # If file exists, load the model
    yolo_model = YOLO(YOLO_MODEL_PATH)
    print("SUCCESS: YOLO model loaded successfully.")

except Exception as e:
    print(f"Error loading YOLO model: {e}")
    exit()

# ---------------------------
# HELPER FUNCTION: VALIDATE PLATE (FINE-TUNED)
# ---------------------------
def extract_jamaican_plate(text):
    """
    Extract a valid Jamaican license plate from OCR text.
    Includes common Private, Commercial, Public, and Old formats, 
    with a correction for Public Transport (Taxi) plates starting with 'P'.
    """
    # Clean text: remove non-alphanumeric chars and convert to uppercase
    text = re.sub(r"[^A-Z0-9]", "", text.upper())

    # --- Jamaican Plate Formats in Priority Order ---

    # 1. Modern Private: 3 Letters + 3 or 4 Digits (e.g., ABC123, ABC1234)
    match = re.search(r"([A-Z]{3}[0-9]{3,4})", text)
    if match:
        return match.group(1)

    # 2. Old/Dealer Private/Commercial: 2 Letters + 4 Digits (e.g., PF8417, AB1234)
    match = re.search(r"([A-Z]{2}[0-9]{4})", text)
    if match:
        # **APPLY TAXI CORRECTION HERE (A2D4)**
        plate = match.group(1)
        # If the first letter is R, F, S, or B (common misreads of P) AND the
        # rest is a numeric format, assume 'P' for Taxi/Public.
        if plate[0] in ['R', 'F', 'S', 'B'] and plate[1].isalpha():
             return 'P' + plate[1:]
        return plate


    # 3. Commercial/Public (e.g., C A1234, T A1234, P A1234) - 1 Letter + 4-5 Digits
    match = re.search(r"([A-Z][0-9]{4,5})", text)
    if match:
        plate = match.group(1)
        # **APPLY TAXI CORRECTION HERE (A1D4/5)**
        # If first char is R, F, S, or B (common misreads of P) 
        if plate[0] in ['R', 'F', 'S', 'B']:
             return 'P' + plate[1:]
        return plate
        
    # 4. Old Private: 4 Digits + 2 Letters (e.g., 8676GP)
    match = re.search(r"([0-9]{4}[A-Z]{2})", text)
    if match:
        return match.group(1)

    # 5. Commercial/Public (Reversed): 3 Digits + 3 Letters (e.g., 123ABC)
    match = re.search(r"([0-9]{3}[A-Z]{3})", text)
    if match:
        return match.group(1)

    # 6. Government: GOV + 3 Digits (e.g., GOV123)
    match = re.search(r"(GOV[0-9]{3})", text)
    if match:
        return match.group(1)

    # Fallback: 6–7 alphanumeric chars (Last resort)
    match = re.search(r"([A-Z0-9]{6,7})", text)
    if match:
        return match.group(1)

    return None

# ---------------------------
# PROCESS IMAGES
# ---------------------------
results_json = {}
files_to_process = [
    filename for filename in os.listdir(IMAGE_FOLDER) 
    if filename.lower().endswith((".jpg", ".png", ".jpeg"))
]

if not files_to_process:
    print(f"No image files found in '{IMAGE_FOLDER}'. Place images to process there.")
else:
    for filename in files_to_process:
        image_path = os.path.join(IMAGE_FOLDER, filename)
        print(f"\nProcessing: {filename}")

        # --- YOLO DETECTION ---
        # Note: Suppressing verbose output
        results = yolo_model(image_path, verbose=False)
        boxes = results[0].boxes.xyxy.cpu().numpy()
        confs = results[0].boxes.conf.cpu().numpy()

        if len(boxes) == 0:
            print("No license plate detected.")
            results_json[filename] = None
            continue

        # Take highest-confidence box
        best_idx = np.argmax(confs)
        xmin, ymin, xmax, ymax = boxes[best_idx][:4].astype(int)

        try:
            original_image = Image.open(image_path)
            # Add a small padding (15 pixels) for better OCR context 
            padding = 15
            xmin = max(0, xmin - padding)
            ymin = max(0, ymin - padding)
            xmax = min(original_image.width, xmax + padding)
            ymax = min(original_image.height, ymax + padding)
            
            cropped_image = original_image.crop((xmin, ymin, xmax, ymax))

            # Increase upscale factor for low-res or difficult plates (factor of 3)
            cropped_image = cropped_image.resize(
                (cropped_image.width * 3, cropped_image.height * 3),
                Image.LANCZOS
            )
        except Exception as e:
            print(f"Error cropping image: {e}")
            results_json[filename] = None
            continue


        # --- OCR via OCR.Space API ---
        buffered = BytesIO()
        cropped_image.save(buffered, format="PNG")
        img_bytes = buffered.getvalue()

        try:
            response = requests.post(
                "https://api.ocr.space/parse/image",
                files={"file": ("plate.png", img_bytes)},
                data={
                    "apikey": OCR_API_KEY,
                    "language": "eng",
                    "isOverlayRequired": False,
                    "OCREngine": 2  # Advanced engine for letters + numbers
                }
            )
            response.raise_for_status() # Check for HTTP errors

            result_json = response.json()
            if result_json.get("IsErroredOnProcessing"):
                print("OCR API error:", result_json.get("ErrorMessage"))
                results_json[filename] = None
                continue

            # Extract OCR text
            parsed_text = ""
            try:
                parsed_text = result_json["ParsedResults"][0]["ParsedText"]
            except (KeyError, IndexError):
                parsed_text = ""
                
            print(f"Raw OCR Text: '{parsed_text.strip().replace('\n', ' ')}'")

            # --- EXTRACT VALID JAMAICAN PLATE ---
            plate_text_clean = extract_jamaican_plate(parsed_text)

            if plate_text_clean:
                print(f"Valid Jamaican Plate: {plate_text_clean}")
                results_json[filename] = plate_text_clean
            else:
                print("No valid Jamaican plate detected after OCR processing.")
                results_json[filename] = None

        except requests.exceptions.RequestException as e:
            print(f"Network/API Request Error: {e}")
            results_json[filename] = None
        except Exception as e:
            print(f"An unexpected error occurred during OCR: {e}")
            results_json[filename] = None


# ---------------------------
# SAVE TO JSON
# ---------------------------
if results_json:
    try:
        with open(JSON_PATH, "w") as f:
            json.dump(results_json, f, indent=4)
        print(f"\n✨ All images processed. Results saved in {JSON_PATH}")
    except Exception as e:
        print(f"\nError saving JSON file: {e}")