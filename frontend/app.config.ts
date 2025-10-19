export default {
  expo: {
        "extra": {
      "googleMapsApiKey": "AIzaSyDxTf__KpaQErFQ_p5j8PZQ8mRTGD7er2g"
    },
    ios: {
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to take photos.",
        NSPhotoLibraryAddUsageDescription: "This app saves captured photos to your library."
      }
    },
    android: {
      // READ_MEDIA_IMAGES is used on Android 13+; WRITE_EXTERNAL_STORAGE is ignored there.
      permissions: ["CAMERA", "READ_MEDIA_IMAGES"]
    },
    plugins: ["expo-camera", "expo-media-library"]
  }
}
