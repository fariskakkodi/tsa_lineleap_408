import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function TSAScreen() {
  const router = useRouter();

  const [flightNumber, setFlightNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [slotCount, setSlotCount] = useState(5);
  const [passengerCount, setPassengerCount] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async () => {
    if (!flightNumber || !passengerCount) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'flights'), {
        flightNumber,
        date: date.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        slotCount,
        passengerLimit: parseInt(passengerCount),
        slotBookings: {},
      });

      setConfirmed(true);
      setTimeout(() => {
        setConfirmed(false);
        router.replace('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save flight');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Flight Number"
        placeholderTextColor="#888"
        style={styles.input}
        value={flightNumber}
        onChangeText={setFlightNumber}
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.inputText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" onChange={(_, selected) => {
          setShowDatePicker(false);
          if (selected) setDate(selected);
        }} />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
        <Text style={styles.inputText}>{startTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker value={startTime} mode="time" onChange={(_, selected) => {
          setShowStartPicker(false);
          if (selected) setStartTime(selected);
        }} />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
        <Text style={styles.inputText}>{endTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker value={endTime} mode="time" onChange={(_, selected) => {
          setShowEndPicker(false);
          if (selected) setEndTime(selected);
        }} />
      )}

      <TextInput
        placeholder="Number of Passengers"
        placeholderTextColor="#888"
        style={styles.input}
        keyboardType="numeric"
        value={passengerCount}
        onChangeText={setPassengerCount}
      />

      <TouchableOpacity style={styles.input} onPress={() => setShowSlotPicker(true)}>
        <Text style={styles.inputText}>Time Slots: {slotCount}</Text>
      </TouchableOpacity>
      {showSlotPicker && (
        <Picker
          selectedValue={slotCount}
          onValueChange={(value) => {
            setShowSlotPicker(false);
            setSlotCount(value);
          }}
        >
          {[...Array(10).keys()].map((i) => (
            <Picker.Item key={i + 1} label={`${i + 1}`} value={i + 1} />
          ))}
        </Picker>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{confirmed ? 'Confirmed!' : 'Enter'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>
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
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
  },
  inputText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#0af',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: '#0af',
    fontSize: 16,
  },
});
