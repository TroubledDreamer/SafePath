import React, { useState, useRef, useEffect } from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const userName = 'Elle';
  const hours = new Date().getHours();
  let timeOfDay = 'Day';
  if (hours < 12) timeOfDay = 'Morning';
  else if (hours < 18) timeOfDay = 'Afternoon';
  else timeOfDay = 'Evening';

  // Camera state
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [caption, setCaption] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Take photo
  const takePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhoto(result.uri);
    }
  };

  // CAMERA MODE
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        {!photo ? (
          <CameraView style={styles.camera} ref={cameraRef} facing="back" />
        ) : (
          <Image source={{ uri: photo }} style={styles.camera} />
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
                  console.log('Photo:', photo);
                  console.log('Caption:', caption);
                  setPhoto(null);
                  setCaption('');
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

  // MAIN SCREEN
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <ImageBackground
            source={{
              uri: 'https://cdn.serc.carleton.edu/images/sp/library/google_earth/google_maps_hello_world.webp',
            }}
            style={styles.mapImage}
            blurRadius={0.5}
          >
            <View style={styles.overlay}>
              <TouchableOpacity style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#888" />
                <Text style={styles.searchText}>Where to?</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            Good {timeOfDay}, <Text style={styles.username}>{userName}</Text>
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="people" size={28} color="#007AFF" />
            <Text style={styles.cardText}>Trusted Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setShowCamera(true)}
          >
            <Ionicons name="camera" size={28} color="#007AFF" />
            <Text style={styles.cardText}>Quick Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="calendar" size={28} color="#007AFF" />
            <Text style={styles.cardText}>Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton}>
          <Text style={styles.sosText}>SEND SOS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: height * 0.05 },
  mapContainer: { height: height * 0.35, width: '100%' },
  mapImage: { flex: 1, justifyContent: 'flex-start' },
  overlay: { paddingTop: height * 0.08, paddingHorizontal: 20 },
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
  cardText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
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

  // Camera styles
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  captionInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ff3b30',
    paddingVertical: 10,
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
  captureText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});