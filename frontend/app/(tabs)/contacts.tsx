import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SearchBar } from 'react-native-screens';
import { Ionicons } from '@expo/vector-icons';

/* ---------------- Types ---------------- */
type Risk = 'good' | 'risky' | 'dangerous';

type Contact = {
  id: string;
  name: string;
  phone: string;
  altPhone: string;
  email: string;
  relationship: string;
  origin: string;       // starting location
  isLive: boolean;      // sending location/telemetry
  routeStatus: Risk;    // good | risky | dangerous
  lastUpdated: string;  // human-readable time
  avatar?: string;      // optional avatar URL
};

/* -------------- Constants -------------- */
const riskColor: Record<Risk, string> = {
  good: '#16a34a',      // green
  risky: '#f59e0b',     // amber
  dangerous: '#ef4444', // red
};

const riskLabel: Record<Risk, string> = {
  good: 'Good',
  risky: 'Risky',
  dangerous: 'Dangerous',
};

/* --------------- Component -------------- */
export default function TripScreen() {
  const [query, setQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Jane Doe',
      phone: '555-1234',
      altPhone: '555-4321',
      email: 'jane@example.com',
      relationship: 'Friend',
      origin: 'Kingston • Half-Way-Tree',
      isLive: true,
      routeStatus: 'good',
      lastUpdated: new Date().toLocaleTimeString(),
      avatar: 'https://i.pravatar.cc/100?img=5',
    },
    {
      id: '2',
      name: 'John Smith',
      phone: '555-5678',
      altPhone: '555-8765',
      email: 'john@example.com',
      relationship: 'Brother',
      origin: 'Spanish Town • Brunswick Ave',
      isLive: true,
      routeStatus: 'risky',
      lastUpdated: new Date().toLocaleTimeString(),
      avatar: 'https://i.pravatar.cc/100?img=12',
    },
    {
      id: '3',
      name: 'Ava Brown',
      phone: '555-2222',
      altPhone: '555-3333',
      email: 'ava@example.com',
      relationship: 'Coworker',
      origin: 'Portmore • Naggo Head',
      isLive: false,
      routeStatus: 'dangerous',
      lastUpdated: new Date().toLocaleTimeString(),
      avatar: 'https://i.pravatar.cc/100?img=30',
    },
  ]);

  /* ---------- Modal / form state ---------- */
  const [selected, setSelected] = useState<Contact | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAltPhone, setEditAltPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRelationship, setEditRelationship] = useState('');
  const [editOrigin, setEditOrigin] = useState('');

  /* ---------- Interval (TypeScript-safe) ---------- */
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // simulate live risk/status update for contacts that are "live"
      setContacts(prev =>
        prev.map(c => {
          if (!c.isLive) return c;
          const r = Math.random();
          const next: Risk = r < 0.33 ? 'good' : r < 0.66 ? 'risky' : 'dangerous';
          return { ...c, routeStatus: next, lastUpdated: new Date().toLocaleTimeString() };
        }),
      );
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* -------------- Helpers -------------- */
  const filtered = contacts.filter(c =>
    [c.name, c.origin, c.relationship].join(' ').toLowerCase().includes(query.toLowerCase()),
  );

  const openAdd = () => {
    const draft: Contact = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      altPhone: '',
      email: '',
      relationship: '',
      origin: '',
      isLive: true,
      routeStatus: 'good',
      lastUpdated: new Date().toLocaleTimeString(),
    };
    setSelected(draft);
    setEditName('');
    setEditPhone('');
    setEditAltPhone('');
    setEditEmail('');
    setEditRelationship('');
    setEditOrigin('');
    setIsModalVisible(true);
  };

  const openEdit = (c: Contact) => {
    setSelected(c);
    setEditName(c.name);
    setEditPhone(c.phone);
    setEditAltPhone(c.altPhone);
    setEditEmail(c.email);
    setEditRelationship(c.relationship);
    setEditOrigin(c.origin);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelected(null);
  };

  const saveEdits = () => {
    if (!editName.trim()) return Alert.alert('Error', 'Name cannot be empty');

    const updated: Contact = {
      id: selected?.id || Date.now().toString(),
      name: editName.trim(),
      phone: editPhone.trim(),
      altPhone: editAltPhone.trim(),
      email: editEmail.trim(),
      relationship: editRelationship.trim(),
      origin: editOrigin.trim() || 'Unknown origin',
      isLive: selected?.isLive ?? true,
      routeStatus: selected?.routeStatus ?? 'good',
      lastUpdated: new Date().toLocaleTimeString(),
      avatar: selected?.avatar,
    };

    setContacts(prev => {
      const exists = prev.some(c => c.id === updated.id);
      return exists ? prev.map(c => (c.id === updated.id ? updated : c)) : [updated, ...prev];
    });
    closeModal();
  };

  const deleteContact = () => {
    if (!selected) return;
    Alert.alert('Delete Contact', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setContacts(prev => prev.filter(c => c.id !== selected.id));
          closeModal();
        },
      }, 
    ]);
  };

  /* -------------- Small UI bits -------------- */
  const LiveDot = ({ on }: { on: boolean }) => (
    <View style={[styles.liveDot, { backgroundColor: on ? '#22c55e' : '#9ca3af' }]} />
  );

  const RiskPill = ({ risk }: { risk: Risk }) => (
    <View style={[styles.pill, { backgroundColor: riskColor[risk] }]}>
      <Text style={styles.pillText}>{riskLabel[risk]}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.card} onPress={() => openEdit(item)}>
      <View style={styles.left}>
        <View style={styles.avatarWrap}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} contentFit="cover" />
          ) : (
            <Ionicons name="person-circle" size={44} color="#374151" />
          )}
          <LiveDot on={item.isLive} />
        </View>

        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.name}>{item.name || 'Unnamed Contact'}</Text>
          <Text style={styles.origin} numberOfLines={1}>{item.origin}</Text>
          <Text style={styles.updated}>Updated {item.lastUpdated}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <RiskPill risk={item.routeStatus} />
        {/* Object form of href to satisfy expo-router types */}
          <TouchableOpacity style={styles.chevBtn}>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      {/* Keep your SearchBar (from react-native-screens). Some setups expose props like onChangeText; if not, we keep a local input below. */}
      <SearchBar />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Trusted Contacts (Live)</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: riskColor.good }]} />
          <Text style={styles.legendText}>Good</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: riskColor.risky }]} />
          <Text style={styles.legendText}>Risky</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: riskColor.dangerous }]} />
          <Text style={styles.legendText}>Dangerous</Text>
        </View>
      </View>

      {/* Local text search (reliable across platforms) */}
      <View style={styles.searchLocal}>
        <Ionicons name="search" size={16} color="#6B7280" />
        <TextInput
          placeholder="Search contacts or origins"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* Add/Edit Modal */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {contacts.some(c => c.id === selected?.id) ? 'Edit Contact' : 'Add Contact'}
              </Text>

              <TextInput style={styles.input} value={editName} onChangeText={setEditName} placeholder="Full Name" />
              <TextInput style={styles.input} value={editPhone} onChangeText={setEditPhone} placeholder="Primary Phone" keyboardType="phone-pad" />
              <TextInput style={styles.input} value={editAltPhone} onChangeText={setEditAltPhone} placeholder="Alternate Phone" keyboardType="phone-pad" />
              <TextInput style={styles.input} value={editEmail} onChangeText={setEditEmail} placeholder="Email Address" keyboardType="email-address" />
              <TextInput style={styles.input} value={editRelationship} onChangeText={setEditRelationship} placeholder="Relationship (e.g. Mom, Friend)" />
              <TextInput style={styles.input} value={editOrigin} onChangeText={setEditOrigin} placeholder="Origin (e.g. Kingston • Half-Way-Tree)" />

              <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionBtn, styles.save]} onPress={saveEdits}>
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
                {contacts.some(c => c.id === selected?.id) && (
                  <TouchableOpacity style={[styles.actionBtn, styles.del]} onPress={deleteContact}>
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity onPress={closeModal} style={styles.cancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 16, paddingTop: 40 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#111827' },

  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addText: { color: '#fff', fontWeight: '700', marginLeft: 6 },

  legendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  swatch: { width: 12, height: 12, borderRadius: 3, marginRight: 6 },
  legendText: { fontSize: 12, color: '#4B5563' },

  searchLocal: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 },
  searchInput: { marginLeft: 6, flex: 1, color: '#111827' },

  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9FAFB', borderRadius: 14, padding: 12, marginTop: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center' },

  avatarWrap: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e5e7eb' },
  liveDot: { position: 'absolute', right: -1, bottom: -1, width: 10, height: 10, borderRadius: 999, borderWidth: 1, borderColor: '#ffffff' },

  name: { fontSize: 16, fontWeight: '700', color: '#111827' },
  origin: { fontSize: 13, color: '#6B7280', marginTop: 2, maxWidth: 220 },
  updated: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, minWidth: 84, alignItems: 'center' },
  pillText: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.2, textTransform: 'uppercase' },
  chevBtn: { marginLeft: 8, padding: 4 },

  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.45)' },
  modal: { width: '90%', maxHeight: '85%', backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: 12, color: '#111827' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 10, marginVertical: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  actionBtn: { flex: 1, marginHorizontal: 5, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  save: { backgroundColor: '#007AFF' },
  del: { backgroundColor: '#EF4444' },
  actionText: { color: '#fff', fontWeight: '800' },
  cancel: { marginTop: 10, alignItems: 'center' },
  cancelText: { color: '#007AFF', fontSize: 16, fontWeight: '700' },
});