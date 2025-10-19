import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PathDeviation } from '../lib/types/navigation';

interface DeviationWarningProps {
  pathDeviation: PathDeviation;
}

export const DeviationWarning: React.FC<DeviationWarningProps> = ({ pathDeviation }) => {
  return (
    <View style={[styles.deviationInfo, styles[`danger${pathDeviation.dangerLevel}`]]}>
      <Text style={styles.deviationText}>
        ⚠️ {Math.round(pathDeviation.distance)}m off path
      </Text>
      <Text style={styles.deviationText}>
        Risk Level: {pathDeviation.dangerLevel}
      </Text>
      <Text style={styles.deviationReason}>
        {pathDeviation.reason}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  deviationInfo: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  deviationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deviationReason: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  dangerLOW: {
    backgroundColor: '#2ecc71',
  },
  dangerMEDIUM: {
    backgroundColor: '#f1c40f',
  },
  dangerHIGH: {
    backgroundColor: '#e74c3c',
  },
});