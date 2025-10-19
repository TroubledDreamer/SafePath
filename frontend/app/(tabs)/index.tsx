// import { Map } from '@/components/map';
// import { StyleSheet, View } from 'react-native';


// export default function HomeScreen() {
//   return (
//     <View>
//       <Map/>
//     </View>
  
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });


// import React from 'react';

// import {
//   Dimensions,
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';


// const { height } = Dimensions.get('window'); // for proportional sizing

// export default function HomeScreen() {
//   // to be able to pull name from DB
//   const userName = 'Elle';

//   const hours = new Date().getHours();
//   let timeOfDay = 'Day';
//   if (hours < 12) timeOfDay = 'Morning';
//   else if (hours < 18) timeOfDay = 'Afternoon';
//   else timeOfDay = 'Evening';

//   return (
//     <View style={styles.container}>
//       {/* Scrollable content */}
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Map Placeholder */}
//         <View style={styles.mapContainer}>
//           <ImageBackground
//             source={{
//               uri: 'https://cdn.serc.carleton.edu/images/sp/library/google_earth/google_maps_hello_world.webp',
//             }}
//             style={styles.mapImage}
//             blurRadius={0.5}
//           >
//             <View style={styles.overlay}>
//               <TouchableOpacity style={styles.searchBar}>
//                 <Ionicons name="search" size={20} color="#888" />
//                 <Text style={styles.searchText}>Where to?</Text>
//               </TouchableOpacity>
//             </View>
//           </ImageBackground>
//         </View>
//         {/* Map Placeholder END */}


//         {/* Greeting */}
//         <View style={styles.greetingContainer}>
//           <Text style={styles.greetingText}>
//             Good {timeOfDay}, <Text style={styles.username}>{userName}</Text>
//           </Text>
//         </View>

//         {/* Buttons */}
//         <View style={styles.actionSection}>
//           <TouchableOpacity style={styles.actionCard}>
//             <Ionicons name="people" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Trusted Contacts</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionCard}>
//             <Ionicons name="camera" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Quick Capture</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionCard}>
//             <Ionicons name="calendar" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Schedule</Text>
//           </TouchableOpacity>
//         </View>

//         {/* SOS Button (part of scroll, not fixed) */}
//         <TouchableOpacity style={styles.sosButton}>
//           <Text style={styles.sosText}>SEND SOS</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContent: {
//     paddingBottom: height * 0.05, 
//   },
//   mapContainer: {
//     height: height * 0.35, 
//     width: '100%',
//   },
//   mapImage: {
//     flex: 1,
//     justifyContent: 'flex-start',
//   },
//   overlay: {
//     paddingTop: height * 0.08,
//     paddingHorizontal: 20,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   searchText: {
//     marginLeft: 10,
//     color: '#888',
//     fontSize: 16,
//   },
//   greetingContainer: {
//     marginTop: height * 0.02,
//     paddingHorizontal: 20,
//   },
//   greetingText: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#333',
//   },
//   username: {
//     color: '#007AFF',
//     fontWeight: '700',
//   },
//   actionSection: {
//     flexDirection: 'column',
//     justifyContent: 'space-evenly', 
//     paddingHorizontal: 20,
//     marginTop: height * 0.02,
//   },
//   actionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     marginVertical: height * 0.008, 
//   },
//   cardText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   sosButton: {
//     backgroundColor: '#ff3b30',
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginHorizontal: 20,
//     marginTop: height * 0.02,
//     elevation: 5,
//   },
//   sosText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

// import { Ionicons } from '@expo/vector-icons';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Dimensions,
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const { height } = Dimensions.get('window');

// export default function HomeScreen() {
//   const userName = 'Elle';
//   const hours = new Date().getHours();
//   let timeOfDay = 'Day';
//   if (hours < 12) timeOfDay = 'Morning';
//   else if (hours < 18) timeOfDay = 'Afternoon';
//   else timeOfDay = 'Evening';

//   // Camera
//   const [showCamera, setShowCamera] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);
//   const [caption, setCaption] = useState('');

//   useEffect(() => {
//     if (!permission) {
//       requestPermission();
//     }
//   }, [permission]);

//   // If the camera is active
//   if (showCamera) {
//     return (
//       <View style={styles.cameraContainer}>
//         <CameraView style={styles.camera} ref={cameraRef} facing="back" />
//         <View style={styles.captionContainer}>
//           <TextInput
//             style={styles.captionInput}
//             placeholder="Enter description..."
//             placeholderTextColor="#888"
//             value={caption}
//             onChangeText={setCaption}
//           />
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setShowCamera(false)}
//           >
//             <Text style={styles.closeText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Map Placeholder */}
//         <View style={styles.mapContainer}>
//           <ImageBackground
//             source={{
//               uri: 'https://cdn.serc.carleton.edu/images/sp/library/google_earth/google_maps_hello_world.webp',
//             }}
//             style={styles.mapImage}
//             blurRadius={0.5}
//           >
//             <View style={styles.overlay}>
//               <TouchableOpacity style={styles.searchBar}>
//                 <Ionicons name="search" size={20} color="#888" />
//                 <Text style={styles.searchText}>Where to?</Text>
//               </TouchableOpacity>
//             </View>
//           </ImageBackground>
//         </View>

//         {/* Greeting */}
//         <View style={styles.greetingContainer}>
//           <Text style={styles.greetingText}>
//             Good {timeOfDay}, <Text style={styles.username}>{userName}</Text>
//           </Text>
//         </View>

//         {/* Buttons */}
//         <View style={styles.actionSection}>
//           <TouchableOpacity style={styles.actionCard}>
//             <Ionicons name="people" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Trusted Contacts</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionCard}
//             onPress={() => setShowCamera(true)}
//           >
//             <Ionicons name="camera" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Quick Capture</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionCard}>
//             <Ionicons name="calendar" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Schedule</Text>
//           </TouchableOpacity>
//         </View>

//         {/* SOS Button */}
//         <TouchableOpacity style={styles.sosButton}>
//           <Text style={styles.sosText}>SEND SOS</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   scrollContent: { paddingBottom: height * 0.05 },
//   mapContainer: { height: height * 0.35, width: '100%' },
//   mapImage: { flex: 1, justifyContent: 'flex-start' },
//   overlay: { paddingTop: height * 0.08, paddingHorizontal: 20 },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   searchText: { marginLeft: 10, color: '#888', fontSize: 16 },
//   greetingContainer: { marginTop: height * 0.02, paddingHorizontal: 20 },
//   greetingText: { fontSize: 22, fontWeight: '600', color: '#333' },
//   username: { color: '#007AFF', fontWeight: '700' },
//   actionSection: {
//     flexDirection: 'column',
//     justifyContent: 'space-evenly',
//     paddingHorizontal: 20,
//     marginTop: height * 0.02,
//   },
//   actionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     marginVertical: height * 0.008,
//   },
//   cardText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   sosButton: {
//     backgroundColor: '#ff3b30',
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginHorizontal: 20,
//     marginTop: height * 0.02,
//     elevation: 5,
//   },
//   sosText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

//   // Camera styles
//   cameraContainer: { flex: 1, backgroundColor: '#000' },
//   camera: { flex: 1 },
//   captionContainer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   captionInput: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 16,
//   },
//   closeButton: {
//     marginTop: 10,
//     backgroundColor: '#ff3b30',
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   closeText: { color: '#fff', fontWeight: '600', fontSize: 16 },
// });


// import { Ionicons } from '@expo/vector-icons';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Dimensions,
//   Image,
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const { height } = Dimensions.get('window');

// export default function HomeScreen() {
//   const userName = 'Elle';
//   const hours = new Date().getHours();
//   let timeOfDay = 'Day';
//   if (hours < 12) timeOfDay = 'Morning';
//   else if (hours < 18) timeOfDay = 'Afternoon';
//   else timeOfDay = 'Evening';

//   // Camera state
//   const [showCamera, setShowCamera] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<any>(null);
//   const [caption, setCaption] = useState('');
//   const [photo, setPhoto] = useState<string | null>(null);

//   useEffect(() => {
//     if (!permission) {
//       requestPermission();
//     }
//   }, [permission]);

//   // Take photo
//   const takePhoto = async () => {
//     if (cameraRef.current) {
//       const result = await cameraRef.current.takePictureAsync();
//       setPhoto(result.uri);
//     }
//   };

//   // CAMERA MODE
//   if (showCamera) {
//     return (
//       <View style={styles.cameraContainer}>
//         {!photo ? (
//           <CameraView style={styles.camera} ref={cameraRef} facing="back" />
//         ) : (
//           <Image source={{ uri: photo }} style={styles.camera} />
//         )}

//         <View style={styles.captionContainer}>
//           {photo ? (
//             <>
//               <TextInput
//                 style={styles.captionInput}
//                 placeholder="Enter description..."
//                 placeholderTextColor="#888"
//                 value={caption}
//                 onChangeText={setCaption}
//               />

//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => {
//                   console.log('Photo:', photo);
//                   console.log('Caption:', caption);
//                   setPhoto(null);
//                   setCaption('');
//                   setShowCamera(false);
//                 }}
//               >
//                 <Text style={styles.closeText}>Save & Close</Text>
//               </TouchableOpacity>
//             </>
//           ) : (
//             <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
//               <Text style={styles.captureText}>Take Photo</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//     );
//   }

//   // MAIN SCREEN
//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Map Placeholder */}
//         <View style={styles.mapContainer}>
//           <ImageBackground
//             source={{
//               uri: 'https://cdn.serc.carleton.edu/images/sp/library/google_earth/google_maps_hello_world.webp',
//             }}
//             style={styles.mapImage}
//             blurRadius={0.5}
//           >
//             <View style={styles.overlay}>
//               <TouchableOpacity style={styles.searchBar}>
//                 <Ionicons name="search" size={20} color="#888" />
//                 <Text style={styles.searchText}>Where to?</Text>
//               </TouchableOpacity>
//             </View>
//           </ImageBackground>
//         </View>

//         {/* Greeting */}
//         <View style={styles.greetingContainer}>
//           <Text style={styles.greetingText}>
//             Good {timeOfDay}, <Text style={styles.username}>{userName}</Text>
//           </Text>
//         </View>

//         {/* Buttons */}
//         <View style={styles.actionSection}>
//           <TouchableOpacity style={styles.actionCard}>
//             <Ionicons name="people" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Trusted Contacts</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionCard}
//             onPress={() => setShowCamera(true)}
//           >
//             <Ionicons name="camera" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Quick Capture</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionCard}>
//             <Ionicons name="calendar" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Schedule</Text>
//           </TouchableOpacity>
//         </View>

//         {/* SOS Button */}
//         <TouchableOpacity style={styles.sosButton}>
//           <Text style={styles.sosText}>SEND SOS</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   scrollContent: { paddingBottom: height * 0.05 },
//   mapContainer: { height: height * 0.35, width: '100%' },
//   mapImage: { flex: 1, justifyContent: 'flex-start' },
//   overlay: { paddingTop: height * 0.08, paddingHorizontal: 20 },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   searchText: { marginLeft: 10, color: '#888', fontSize: 16 },
//   greetingContainer: { marginTop: height * 0.02, paddingHorizontal: 20 },
//   greetingText: { fontSize: 22, fontWeight: '600', color: '#333' },
//   username: { color: '#007AFF', fontWeight: '700' },
//   actionSection: {
//     flexDirection: 'column',
//     justifyContent: 'space-evenly',
//     paddingHorizontal: 20,
//     marginTop: height * 0.02,
//   },
//   actionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     marginVertical: height * 0.008,
//   },
//   cardText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   sosButton: {
//     backgroundColor: '#ff3b30',
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginHorizontal: 20,
//     marginTop: height * 0.02,
//     elevation: 5,
//   },
//   sosText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },

//   // Camera styles
//   cameraContainer: { flex: 1, backgroundColor: '#000' },
//   camera: { flex: 1 },
//   captionContainer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     padding: 20,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   captionInput: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 12,
//     fontSize: 16,
//   },
//   closeButton: {
//     marginTop: 10,
//     backgroundColor: '#ff3b30',
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   closeText: { color: '#fff', fontWeight: '600', fontSize: 16 },
//   captureButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   captureText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });


// import { Ionicons } from '@expo/vector-icons';
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import * as Location from 'expo-location';
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Dimensions,
//   Image,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';

// const { height } = Dimensions.get('window');

// export default function HomeScreen() {
//   const userName = 'Elle';
//   const hours = new Date().getHours();
//   let timeOfDay = 'Day';
//   if (hours < 12) timeOfDay = 'Morning';
//   else if (hours < 18) timeOfDay = 'Afternoon';
//   else timeOfDay = 'Evening';

//   // Camera setup
//   const [permission, requestPermission] = useCameraPermissions();
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const cameraRef = useRef<any>(null);
//   const [photo, setPhoto] = useState<string | null>(null);

//   // Location setup
//   const [location, setLocation] = useState<any>(null);
//   const [region, setRegion] = useState<any>(null);

//   useEffect(() => {
//     (async () => {
//       // Request location permission
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         console.log('Permission to access location was denied');
//         return;
//       }
//       const loc = await Location.getCurrentPositionAsync({});
//       setLocation(loc);
//       setRegion({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       });
//     })();
//   }, []);

//   const openCamera = async () => {
//     if (!permission?.granted) {
//       await requestPermission();
//       return;
//     }
//     setCameraVisible(true);
//   };

//   const takePhoto = async () => {
//     if (cameraRef.current) {
//       const pic = await cameraRef.current.takePictureAsync();
//       setPhoto(pic.uri);
//       setCameraVisible(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* LIVE MAP HEADER */}
//         <View style={styles.mapContainer}>
//           {region ? (
//             <MapView
//               style={styles.mapImage}
//               region={region}
//               showsUserLocation={true}
//               followsUserLocation={true}
//               showsMyLocationButton={true}
//             >
//               <Marker coordinate={region} title="You are here" />
//             </MapView>
//           ) : (
//             <View
//               style={[styles.mapImage, { justifyContent: 'center', alignItems: 'center' }]}
//             >
//               <Text style={{ color: '#888' }}>Loading map...</Text>
//             </View>
//           )}

//           {/* Overlay search bar */}
//           <View style={styles.overlay}>
//             <TouchableOpacity style={styles.searchBar}>
//               <Ionicons name="search" size={20} color="#888" />
//               <Text style={styles.searchText}>Where to?</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* GREETING */}
//         <View style={styles.greetingContainer}>
//           <Text style={styles.greetingText}>
//             Good {timeOfDay}, <Text style={styles.username}>{userName}</Text>
//           </Text>
//         </View>

//         {/* ACTION BUTTONS */}
//         <View style={styles.actionSection}>
//           <TouchableOpacity style={styles.actionCard}>
//             <Ionicons name="people" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Trusted Contacts</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionCard} onPress={openCamera}>
//             <Ionicons name="camera" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Quick Capture</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.actionCard}>
//             <Ionicons name="calendar" size={28} color="#007AFF" />
//             <Text style={styles.cardText}>Schedule</Text>
//           </TouchableOpacity>
//         </View>

//         {/* SOS BUTTON */}
//         <TouchableOpacity style={styles.sosButton}>
//           <Text style={styles.sosText}>SEND SOS</Text>
//         </TouchableOpacity>

//         {/* SHOW CAPTURED PHOTO */}
//         {photo && (
//           <View style={styles.previewContainer}>
//             <Image source={{ uri: photo }} style={styles.previewImage} />
//             <Text style={{ color: '#333', marginTop: 8 }}>Last captured image</Text>
//           </View>
//         )}
//       </ScrollView>

//       {/* CAMERA MODAL */}
//       <Modal visible={cameraVisible} animationType="slide">
//         <CameraView style={{ flex: 1 }} ref={cameraRef}>
//           <View style={styles.cameraControls}>
//             <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
//               <Ionicons name="camera" size={32} color="#fff" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => setCameraVisible(false)}
//               style={styles.closeButton}
//             >
//               <Ionicons name="close" size={28} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </CameraView>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   scrollContent: { paddingBottom: height * 0.05 },
//   mapContainer: { height: height * 0.35, width: '100%' },
//   mapImage: { flex: 1, justifyContent: 'flex-start' },
//   overlay: { position: 'absolute', top: height * 0.08, left: 20, right: 20 },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   searchText: { marginLeft: 10, color: '#888', fontSize: 16 },
//   greetingContainer: { marginTop: height * 0.02, paddingHorizontal: 20 },
//   greetingText: { fontSize: 22, fontWeight: '600', color: '#333' },
//   username: { color: '#007AFF', fontWeight: '700' },
//   actionSection: {
//     flexDirection: 'column',
//     justifyContent: 'space-evenly',
//     paddingHorizontal: 20,
//     marginTop: height * 0.02,
//   },
//   actionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 14,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     marginVertical: height * 0.008,
//   },
//   cardText: { marginLeft: 12, fontSize: 16, color: '#333', fontWeight: '500' },
//   sosButton: {
//     backgroundColor: '#ff3b30',
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: 'center',
//     marginHorizontal: 20,
//     marginTop: height * 0.02,
//     elevation: 5,
//   },
//   sosText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
//   previewContainer: {
//     alignItems: 'center',
//     marginTop: height * 0.02,
//     marginBottom: height * 0.05,
//   },
//   previewImage: { width: 200, height: 200, borderRadius: 12 },
//   cameraControls: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     justifyContent: 'space-between',
//     padding: 20,
//   },
//   captureButton: {
//     backgroundColor: '#007AFF',
//     padding: 16,
//     borderRadius: 50,
//   },
//   closeButton: {
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     padding: 12,
//     borderRadius: 50,
//   },
// });


import { Ionicons } from '@expo/vector-icons';
// import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const userName = 'Elle';
  const [showCamera, setShowCamera] = useState(false);
  const [caption, setCaption] = useState('');
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);

  const [location, setLocation] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const hours = new Date().getHours();
  let timeOfDay = 'Day';
  if (hours < 12) timeOfDay = 'Morning';
  else if (hours < 18) timeOfDay = 'Afternoon';
  else timeOfDay = 'Evening';

  // --- Camera Screen ---
  if (showCamera) {
    const takePhoto = async () => {
      if (cameraRef.current) {
        const result = await cameraRef.current.takePictureAsync();
        setPhoto(result.uri);
      }
    };

    return (
      <View style={styles.cameraContainer}>
        {!photo ? (
          // <CameraView style={styles.camera} ref={cameraRef} facing={CameraType.back} />
          <CameraView style={styles.camera} ref={cameraRef} facing="back" />

        ) : (
          <ImageBackground source={{ uri: photo }} style={styles.camera} />
        )}

        <View style={styles.captionContainer}>
          {photo ? (
            <>
              <TextInput
                style={styles.captionInput}
                placeholder="Enter description..."
                placeholderTextColor="#888"
                value={caption}
                onChangeText={setCaption}
              />

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setPhoto(null);
                  setShowCamera(false);
                }}
              >
                <Text style={styles.closeText}>Save & Close</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <Text style={styles.captureText}>Take Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // --- Main Home Screen ---
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          {region ? (
            <MapView
              style={styles.mapImage}
              region={region}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={true}
            >
              <Marker coordinate={region} title="You are here" />
            </MapView>
          ) : (
            <View style={[styles.mapImage, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#888' }}>Loading map...</Text>
            </View>
          )}

          <View style={styles.overlay}>
            <TouchableOpacity style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#888" />
              <Text style={styles.searchText}>Where to?</Text>
            </TouchableOpacity>
          </View>
        </View>


        

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            Good {timeOfDay}, <Text style={styles.username}>{userName}</Text>
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="people" size={28} color="#007AFF" />
            <Text style={styles.cardText}>Trusted Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => setShowCamera(true)}>
            <Ionicons name="camera" size={28} color="#007AFF" />
            <Text style={styles.cardText}>Quick Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="calendar" size={28} color="#007AFF" />
            <Text style={styles.cardText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* SOS Button */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={async () => {
            try {
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert('Permission denied', 'Please enable location permissions to send SOS.');
                return;
              }

              const loc = await Location.getCurrentPositionAsync({});
              const { latitude, longitude } = loc.coords;

              Alert.alert(
                '🚨 SOS Activated',
                `Your current coordinates:\n\nLatitude: ${latitude.toFixed(
                  5
                )}\nLongitude: ${longitude.toFixed(
                  5
                )}\n\nSending alert to your trusted contacts...`,
                [
                  {
                    text: 'Call 911',
                    onPress: () => Linking.openURL('tel:911'),
                  },
                  {
                    text: 'View Location',
                    onPress: () => {
                      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
                      Linking.openURL(url);
                    },
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Unable to retrieve location.');
            }
          }}
        >
          <Text style={styles.sosText}>SEND SOS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: height * 0.05 },
  mapContainer: { height: height * 0.45, width: '100%' , position: 'relative'}, //position: 'relative',
  mapImage: { flex: 1, ...StyleSheet.absoluteFillObject, }, //...StyleSheet.absoluteFillObject,
  overlay: { paddingTop: height * 0.08, paddingHorizontal: 20, ...StyleSheet.absoluteFillObject, }, //...StyleSheet.absoluteFillObject,
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchText: { marginLeft: 10, color: '#888', fontSize: 16 },
  greetingContainer: { marginTop: height * 0.02, paddingHorizontal: 20 },
  greetingText: { fontSize: 22, fontWeight: '600', color: '#333' },
  username: { color: '#007AFF', fontWeight: '700' },
  actionSection: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    marginTop: height * 0.02,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: height * 0.008,
  },
  cardText: { marginLeft: 12, fontSize: 16, color: '#333', fontWeight: '500' },
  sosButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: height * 0.02,
    elevation: 5,
  },
  sosText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  captionInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  captureButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  captureText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
