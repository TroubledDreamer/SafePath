// app.config.js
export default {
  expo: {
    name: "frontend",
    slug: "frontend",

    // 👇 Required for production deep links (fixes the warning)
    scheme: "frontend",

    ios: {
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to take photos.",
        NSPhotoLibraryAddUsageDescription: "This app saves captured photos to your library."
      }
      // (optional) bundleIdentifier: "com.yourco.frontend"
    },

    android: {
      permissions: ["CAMERA", "READ_MEDIA_IMAGES"]
      // (optional) package: "com.yourco.frontend"
    },

    plugins: ["expo-camera", "expo-media-library"]
  }
};
