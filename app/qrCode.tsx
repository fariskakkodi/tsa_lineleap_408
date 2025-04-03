import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function QRCodeScreen() {
  const { flightId, slot } = useLocalSearchParams<{ flightId: string; slot: string }>();
  const router = useRouter();

  const qrData = `yourapp://validate?flightId=${flightId}&slot=${encodeURIComponent(slot)}`;

  useEffect(() => {
    const saveQR = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const key = `qrCodes_${user.uid}`;
        const existing = await AsyncStorage.getItem(key);
        const qrList = existing ? JSON.parse(existing) : [];

        const alreadyExists = qrList.some(
          (qr: any) => qr.flightId === flightId && qr.slot === slot
        );

        if (!alreadyExists) {
          let flightNumber = 'UNKNOWN';

          if (flightId) {
            const snap = await getDoc(doc(db, 'flights', flightId));
            if (snap.exists()) {
              flightNumber = snap.data().flightNumber || 'UNKNOWN';
            }
          }

          const updated = [...qrList, { flightId, flightNumber, slot, qrData }];
          await AsyncStorage.setItem(key, JSON.stringify(updated));
        }
      } catch (e) {
        console.error('Failed to save QR code', e);
      }
    };

    saveQR();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your QR Code</Text>
      <QRCode value={qrData} size={250} />
      <TouchableOpacity style={styles.homeButton} onPress={() => router.replace('/passengerHome')}>
        <Text style={styles.homeText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 30,
  },
  homeButton: {
    marginTop: 30,
    backgroundColor: '#0af',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  homeText: {
    color: '#fff',
    fontSize: 16,
  },
});
