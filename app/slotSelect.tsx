// File: app/slotSelect.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function SlotSelectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [slots, setSlots] = useState<string[]>([]);
  const [flightNumber, setFlightNumber] = useState('');

  useEffect(() => {
    const generateSlots = async () => {
      if (!id) return;

      const flightRef = doc(db, 'flights', id);
      const snapshot = await getDoc(flightRef);

      if (!snapshot.exists()) return;

      const data = snapshot.data();
      setFlightNumber(data.flightNumber);

      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      const total = data.slotCount;
      const diff = (end.getTime() - start.getTime()) / total;

      const tempSlots: string[] = [];
      for (let i = 0; i < total; i++) {
        const s = new Date(start.getTime() + i * diff);
        const e = new Date(start.getTime() + (i + 1) * diff);
        tempSlots.push(`${s.toLocaleTimeString()} - ${e.toLocaleTimeString()}`);
      }
      setSlots(tempSlots);
    };

    generateSlots();
  }, [id]);

  const handleSelect = async (slot: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, 'flights', id);
    const snapshot = await getDoc(ref);
    const data = snapshot.data();

    if (!data) {
      Alert.alert('Error', 'Flight data not found.');
      return;
    }

    const slotBookings = data.slotBookings || {};
    const currentCount = slotBookings[slot] || 0;

    if (currentCount >= data.passengerLimit / data.slotCount) {
      Alert.alert('Slot Full', 'This time slot is already full. Please choose another.');
      return;
    }

    slotBookings[slot] = currentCount + 1;
    await updateDoc(ref, { slotBookings });

    router.push({
      pathname: '/qrCode',
      params: { flightId: id, slot },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Select Slot for {flightNumber}</Text>
      {slots.map((slot, index) => (
        <TouchableOpacity
          key={index}
          style={styles.slotButton}
          onPress={() => handleSelect(slot)}
        >
          <Text style={styles.slotText}>{slot}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  slotButton: {
    backgroundColor: '#0af',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  slotText: {
    color: '#fff',
    fontSize: 16,
  },
});
