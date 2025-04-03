// File: app/myQRCodes.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MyQRCodes() {
  const [qrList, setQrList] = useState<
    { flightId: string; flightNumber: string; slot: string; qrData: string }[]
  >([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadQRs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const key = `qrCodes_${user.uid}`;
      const saved = await AsyncStorage.getItem(key);
      if (saved) {
        setQrList(JSON.parse(saved));
      }
    };
    loadQRs();
  }, []);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const deleteQR = async (flightId: string, slot: string) => {
    Alert.alert(
      'Delete QR Code',
      'Are you sure you want to delete this QR code?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const user = auth.currentUser;
            if (!user) return;

            const key = `qrCodes_${user.uid}`;
            const updatedList = qrList.filter(
              (qr) => !(qr.flightId === flightId && qr.slot === slot)
            );
            setQrList(updatedList);
            await AsyncStorage.setItem(key, JSON.stringify(updatedList));
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My QR Codes</Text>
      <ScrollView>
        {qrList.length === 0 && (
          <Text style={styles.label}>No active QR codes yet</Text>
        )}

        {qrList.map((qr, index) => {
          const dropdownId = `${qr.flightId}-${qr.slot}`;
          return (
            <View key={dropdownId} style={styles.block}>
              <View style={styles.dropdownHeader}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => toggleExpand(dropdownId)}
                >
                  <Text style={styles.flightText}>
                    Flight: {qr.flightNumber} | Slot: {qr.slot}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteQR(qr.flightId, qr.slot)}
                  style={{ paddingLeft: 10 }}
                >
                  <FontAwesome name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>

              {expandedIds.includes(dropdownId) && (
                <View style={styles.qrWrapper}>
                  <QRCode value={qr.qrData} size={200} />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/passengerHome')}>
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  block: {
    marginBottom: 15,
    backgroundColor: '#111',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#222',
  },
  flightText: {
    color: '#fff',
    fontSize: 16,
  },
  arrow: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
  qrWrapper: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  label: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#0af',
    borderRadius: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
});