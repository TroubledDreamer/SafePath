// CameraFrame.tsx
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import UIInput from './ui/UIInput';
type Captured = { uri: string } | null;

const CameraFrame = () => {
  const cameraRef = useRef<CameraView | null>(null);

  const [camPerm, requestCamPerm] = useCameraPermissions();
  const [mediaPerm, requestMediaPerm] = MediaLibrary.usePermissions();

  const [photo, setPhoto] = useState<Captured>(null);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [saving, setSaving] = useState(false);

  if (!camPerm) {
    return (
      <View>
        <Text>Checking permissions…</Text>
      </View>
    );
  }

  if (!camPerm.granted) {
    return (
      <View>
        <Text>We need your permission to use the camera.</Text>
        <TouchableOpacity onPress={requestCamPerm}>
          <Text>Grant Camera Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    try {
      const result = await cameraRef.current?.takePictureAsync({
        quality: 1,
        skipProcessing: true,
      });
      if (result?.uri) setPhoto({ uri: result.uri });
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to take picture');
    }
  };

  const saveToGallery = async () => {
    try {
      setSaving(true);
      if (!photo?.uri) return;

      if (!mediaPerm?.granted) {
        const perm = await requestMediaPerm();
        if (perm.status !== 'granted') {
          setSaving(false);
          Alert.alert('Permission needed', 'Gallery access is required to save photos.');
          return;
        }
      }

      await MediaLibrary.createAssetAsync(photo.uri);
      Alert.alert('Saved', 'Photo saved to your gallery.');
    } catch (e: any) {
      Alert.alert('Save failed', e?.message ?? 'Could not save photo.');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => setPhoto(null);
  const flip = () => setFacing((f) => (f === 'back' ? 'front' : 'back'));

  return (
    <View>
      {!photo ? (
        <View>
          <CameraView
            ref={(r) => (cameraRef.current = r)}
            facing={facing}
            style={{width: 400, height: 400}}
            onMountError={(e) => Alert.alert('Camera error', String((e as any)?.message ?? e))}
          />
          <View>
            <TouchableOpacity onPress={flip}>
              <Text>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto}>
              <Text>Capture</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Image source={{ uri: photo.uri }} />
          <View>
            <TouchableOpacity onPress={reset}>
              <Text>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={saveToGallery} disabled={saving}>
              <Text>{saving ? 'Saving…' : 'Save'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <UIInput/>
    </View>
  );
};

export default CameraFrame;
