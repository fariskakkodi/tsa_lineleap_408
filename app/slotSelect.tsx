import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function SlotSelectScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const flightRef = doc(db, 'flights', id);
        const snapshot = await getDoc(flightRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          const start = new Date(data.startTime);
          const end = new Date(data.endTime);
          const count = data.slotCount;

          const totalMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
          const gap = totalMinutes / count;

          const tempSlots: string[] = [];
          let current = new Date(start);

          for (let i = 0; i < count; i++) {
            const slotStart = new Date(current);
            current.setMinutes(current.getMinutes() + gap);
            const slotEnd = new Date(current);

            const formatted = `${slotStart.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })} - ${slotEnd.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`;

            tempSlots.push(formatted);
          }

          setSlots(tempSlots);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading flight info:', error);
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  const handleSlotSelect = (slot: string) => {
    router.push({
      pathname: '/qrCode',
      params: { flightId: id, slot },
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0af" />
      ) : (
        <>
          <Text style={styles.title}>Select a Time Slot</Text>
          <ScrollView>
            {slots.map((slot, index) => (
              <TouchableOpacity key={index} style={styles.slotButton} onPress={() => handleSlotSelect(slot)}>
                <Text style={styles.slotText}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  slotButton: {
    backgroundColor: '#0af',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  slotText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
