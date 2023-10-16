import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.settingsContainer}>
        <Text
          style={styles.settingsText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Settings will go here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  settingsContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  settingsText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
});
