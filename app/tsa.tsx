import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function TSAScreen() {
  const router = useRouter();

  const [flightNumber, setFlightNumber] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [slotCount, setSlotCount] = useState(5);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showSlotPicker, setShowSlotPicker] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = async () => {
    if (!flightNumber) {
      Alert.alert('Please enter a flight number');
      return;
    }

    try {
      await addDoc(collection(db, 'flights'), {
        flightNumber,
        date: date.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        slotCount,
      });
      setConfirmed(true);
    } catch (e) {
      console.error('Error adding flight:', e);
      Alert.alert('Failed to save flight.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Flight Number</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. AI202"
        placeholderTextColor="#aaa"
        value={flightNumber}
        onChangeText={setFlightNumber}
      />

      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.text}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
        <Text style={styles.text}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(_, selected) => {
            setShowStartPicker(Platform.OS === 'ios');
            if (selected) setStartTime(selected);
          }}
        />
      )}

      <Text style={styles.label}>End Time</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
        <Text style={styles.text}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(_, selected) => {
            setShowEndPicker(Platform.OS === 'ios');
            if (selected) setEndTime(selected);
          }}
        />
      )}

      <Text style={styles.label}>Number of Time Slots</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowSlotPicker(true)}>
        <Text style={styles.text}>{slotCount}</Text>
      </TouchableOpacity>
      {showSlotPicker && (
        <Picker
          selectedValue={slotCount}
          onValueChange={(value) => {
            setShowSlotPicker(false);
            setSlotCount(value);
          }}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <Picker.Item key={num} label={`${num}`} value={num} />
          ))}
        </Picker>
      )}

      <View style={{ marginTop: 30 }}>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={handleSubmit}
          disabled={confirmed}
        >
          <Text style={styles.enterText}>{confirmed ? 'Confirmed' : 'Enter'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  text: {
    color: '#fff',
  },
  enterButton: {
    backgroundColor: '#0af',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  enterText: {
    color: '#fff',
    fontSize: 18,
  },
  backButton: {
    backgroundColor: '#0af',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
});
