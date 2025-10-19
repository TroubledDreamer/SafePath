// import { Image } from 'expo-image';

// import { Link } from 'expo-router';
// import { View, Text,  StyleSheet } from 'react-native';

// import { SearchBar } from 'react-native-screens';
// export default function scheduleScreen() {
//   return (
//     <View>
//       <SearchBar/>

      






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
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState([
    { id: 1, activity: 'Morning Jog', time: '6:30 AM', repeat: 'Mon, Wed, Fri', active: true },
    { id: 2, activity: 'Work Commute', time: '8:00 AM', repeat: 'Weekdays', active: false },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ activity: '', time: '', repeat: '', active: true });

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm(item || { activity: '', time: '', repeat: '', active: true });
    setModalVisible(true);
  };

  const saveItem = () => {
    if (editingItem) {
      // Edit existing item
      setSchedules((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...form } : item
        )
      );
    } else {
      // Add new item
      setSchedules((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }
    setModalVisible(false);
    setEditingItem(null);
    setForm({ activity: '', time: '', repeat: '', active: true });
  };

  const toggleSchedule = (id) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.scheduleCard} onPress={() => openEditModal(item)}>
      <View>
        <Text style={styles.activityText}>{item.activity}</Text>
        {item.time ? <Text style={styles.subText}>{item.time}</Text> : null}
        {item.repeat ? <Text style={styles.subText}>{item.repeat}</Text> : null}
      </View>
      <Switch
        value={item.active}
        onValueChange={() => toggleSchedule(item.id)}
        trackColor={{ false: '#ccc', true: '#007AFF' }}
        thumbColor="#fff"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Schedule</Text>

      <FlatList
        data={schedules}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => openEditModal(null)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Edit / Add Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Activity' : 'Add Activity'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Activity Name"
              value={form.activity}
              onChangeText={(text) => setForm({ ...form, activity: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (optional)"
              value={form.time}
              onChangeText={(text) => setForm({ ...form, time: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Repeat (optional)"
              value={form.repeat}
              onChangeText={(text) => setForm({ ...form, repeat: text })}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Active</Text>
              <Switch
                value={form.active}
                onValueChange={(val) => setForm({ ...form, active: val })}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#007AFF' }]}
                onPress={saveItem}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 20 },
  scheduleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityText: { fontSize: 20, fontWeight: '600', color: '#222' },
  subText: { fontSize: 14, color: '#777' },
  addButton: {
    position: 'absolute',
    right: 25,
    bottom: 40,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  switchLabel: { fontSize: 16, color: '#333' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
