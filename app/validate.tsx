import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ValidateScreen() {
  const { flightId, slot } = useLocalSearchParams<{ flightId: string; slot: string }>();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!slot) return;

    const [startStr, endStr] = slot.split(' - ');
    const now = new Date();

    const todayStr = now.toLocaleDateString();
    const start = new Date(`${todayStr} ${startStr}`);
    const end = new Date(`${todayStr} ${endStr}`);

    if (now >= start && now <= end) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [slot]);

  if (isValid === null) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.bigSymbol}>{isValid ? '✅' : '❌'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigSymbol: {
    fontSize: 100,
    color: '#fff',
  },
});
