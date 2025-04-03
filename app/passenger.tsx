import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function PassengerScreen() {
  const router = useRouter();

  const [flights, setFlights] = useState<{ id: string; flightNumber: string }[]>([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'flights'));
        const flightData = snapshot.docs.map((doc) => ({
          id: doc.id,
          flightNumber: doc.data().flightNumber,
        }));
        setFlights(flightData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flights:', error);
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const handleProceed = () => {
    if (!selectedFlight) return;

    router.push({
      pathname: '/slotSelect',
      params: { id: selectedFlight },
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0af" />
      ) : (
        <>
          <Text style={styles.label}>Select Flight Number</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedFlight}
              onValueChange={(itemValue) => setSelectedFlight(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="-- Choose a flight --" value="" />
              {flights.map((flight) => (
                <Picker.Item key={flight.id} label={flight.flightNumber} value={flight.id} />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.nextButton, !selectedFlight && { opacity: 0.5 }]}
            onPress={handleProceed}
            disabled={!selectedFlight}
          >
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
            <Text style={styles.backText}>Back to Home</Text>
          </TouchableOpacity>
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
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  pickerWrapper: {
    backgroundColor: '#222',
    borderRadius: 10,
  },
  picker: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#0af',
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    marginTop: 20,
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
