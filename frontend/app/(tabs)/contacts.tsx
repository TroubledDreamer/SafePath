// import { Image } from 'expo-image';
// import { Link } from 'expo-router';
// import { View, Text,  StyleSheet } from 'react-native';

// import { SearchBar } from 'react-native-screens';
// export default function ScheduleScreen() {
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
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/** --- TYPES --- */
type Contact = {
  id: string;
  name: string;
  phone: string;
  altPhone: string;
  email: string;
  relationship: string;
};

/** --- COMPONENT --- */
export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Jane Doe',
      phone: '555-1234',
      altPhone: '555-4321',
      email: 'jane@example.com',
      relationship: 'Friend',
    },
    {
      id: '2',
      name: 'John Smith',
      phone: '555-5678',
      altPhone: '555-8765',
      email: 'john@example.com',
      relationship: 'Brother',
    },
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAltPhone, setEditAltPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRelationship, setEditRelationship] = useState('');

  /** --- ADD NEW CONTACT --- */
  const addContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      altPhone: '',
      email: '',
      relationship: '',
    };
    setSelectedContact(newContact);
    setEditName('');
    setEditPhone('');
    setEditAltPhone('');
    setEditEmail('');
    setEditRelationship('');
    setIsModalVisible(true);
  };

  /** --- EDIT EXISTING CONTACT --- */
  const openModal = (contact: Contact) => {
    setSelectedContact(contact);
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setEditAltPhone(contact.altPhone);
    setEditEmail(contact.email);
    setEditRelationship(contact.relationship);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedContact(null);
  };

  /** --- SAVE CHANGES --- */
  const saveEdits = () => {
    if (!editName.trim()) {
      return Alert.alert('Error', 'Name cannot be empty');
    }

    const updatedContact: Contact = {
      id: selectedContact?.id || Date.now().toString(),
      name: editName.trim(),
      phone: editPhone.trim(),
      altPhone: editAltPhone.trim(),
      email: editEmail.trim(),
      relationship: editRelationship.trim(),
    };

    setContacts((prev) => {
      const exists = prev.find((c) => c.id === selectedContact?.id);
      return exists
        ? prev.map((c) => (c.id === selectedContact?.id ? updatedContact : c))
        : [...prev, updatedContact];
    });

    closeModal();
  };

  /** --- DELETE CONTACT --- */
  const deleteContact = () => {
    if (!selectedContact) return;

    Alert.alert('Delete Contact', 'Are you sure you want to delete this contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id));
          closeModal();
        },
      },
    ]);
  };

  /** --- RENDER CONTACT ITEM --- */
  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.contactCard} onPress={() => openModal(item)}>
      <View style={styles.contactInfo}>
        <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.contactName}>{item.name || 'Unnamed Contact'}</Text>
          <Text style={styles.contactPhone}>{item.phone || 'No phone number'}</Text>
          {item.relationship ? (
            <Text style={styles.relationshipText}>{item.relationship}</Text>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Contacts</Text>

      <TouchableOpacity style={styles.addButton} onPress={addContact}>
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.addButtonText}>Add Contact</Text>
      </TouchableOpacity>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContact}
        style={{ marginTop: 15 }}
      />

      {/* --- CONTACT MODAL --- */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {contacts.find((c) => c.id === selectedContact?.id)
                  ? 'Edit Contact'
                  : 'Add Contact'}
              </Text>

              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Full Name"
              />
              <TextInput
                style={styles.input}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Primary Phone"
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                value={editAltPhone}
                onChangeText={setEditAltPhone}
                placeholder="Alternate Phone"
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Email Address"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                value={editRelationship}
                onChangeText={setEditRelationship}
                placeholder="Relationship (e.g. Mom, Friend, Partner)"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveEdits}
                >
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>

                {contacts.find((c) => c.id === selectedContact?.id) && (
                  <TouchableOpacity
                    style={[styles.modalButton, styles.deleteButton]}
                    onPress={deleteContact}
                  >
                    <Text style={styles.modalButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/** --- STYLES --- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 40,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactPhone: {
    fontSize: 13,
    color: '#555',
  },
  relationshipText: {
    fontSize: 12,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
