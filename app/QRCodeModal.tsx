import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { PersonType, ShuttleType, VehicleType } from '../logic/Types';

type QRCodeModalProps = {
  people: PersonType[],
  vehicles: VehicleType[],
  shuttleType: ShuttleType,
  onClose:()=>void
};

export default function QRCodeModal(props: QRCodeModalProps) {
    const { onClose, people, vehicles, shuttleType } = props;

    const getValue = () => {
      return JSON.stringify({
        people: people,
        vehicles: vehicles,
        shuttleType: shuttleType,
      })
    };

    return (
        <View style={styles.container}>
            <View style={styles.modal}>

              <View style={styles.topBar}>
                <Pressable
                    onPress={onClose}>
                    <FontAwesome style={styles.pressableIcon} name='angle-left' />
                </Pressable>

                <Text style={styles.textTitle}>Share with the group</Text>

                <FontAwesome style={styles.hiddenButton} name='angle-right' />
              </View>
                
              <Text style={styles.textDescription}>Have your friends scan this in the Shuttle Buddy App to load this shuttle!</Text>

              <QRCode 
                size={200}
                value={getValue()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: undefined,
    },
    modal: {
      margin: 20,
      padding: 20,
      borderRadius: 20,
      backgroundColor: 'white',
      borderColor: 'grey',
      borderWidth: 1,
      gap: 15,
      alignItems: 'center',
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    pressableIcon: {
      fontSize: 28,
      color: '#2E2E2E',
    },
    hiddenButton: {
      fontSize: 28,
      color: 'white',
    },
    textTitle: {
      textAlign: 'center',
      fontSize: 20,
      flex: 1,

    },
    textDescription: {
      textAlign: 'center',
    }
});