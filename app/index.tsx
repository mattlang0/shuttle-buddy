import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Pressable, Modal, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { Text, View } from '../components/Themed';
import AddEditEntity from './AddEditEntity';
import Shuttle from './Shuttle';
import { PersonType, VehicleType, ShuttleType } from "../logic/Types";
import { List } from '../components/List';
import { isScenarioValid } from '../logic/logic';

export default function Main() {
  const [addPersonVisible, setAddPersonVisible] = useState(false);
  const [shuttleVisible, setShuttleVisible] = useState(false);
  const [people, setPeople] = useState<[] | PersonType[]>([]);
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [shuttleType, setShuttleType] = useState<ShuttleType>(
    ShuttleType.MEET_AT_PUT_IN
  );

  const isShuttleDisabled = () => {
    return !isScenarioValid(people, vehicles, shuttleType);
  }

  const toggleSwitch = () => setShuttleType((previousState) => {
    if (previousState === ShuttleType.MEET_AT_PUT_IN) {
      return ShuttleType.MEET_AT_TAKE_OUT
    }
    return ShuttleType.MEET_AT_PUT_IN
  });

  return (
    <View style={styles.container}>

      {/* Meet at Put In / Take Out switch */}
      <View style={styles.meetAtContainer}>
        <Text style={styles.meetAtTitle}>
          {shuttleType === ShuttleType.MEET_AT_PUT_IN ? 'Meet at Put In': 'Meet at Take Out'}
        </Text>
        <Switch
            trackColor={{false: '#3e3e3e', true: '#3e3e3e'}}
            thumbColor={shuttleType === ShuttleType.MEET_AT_PUT_IN ? 'green' : 'orange'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={shuttleType === ShuttleType.MEET_AT_TAKE_OUT}
          />
      </View>
      
      {/* Entity List */}
      <View style={styles.listContainer}>
        <List people={people} vehicles={vehicles} setPeople={setPeople} setVehicles={setVehicles} />
      </View>

      {/* Shuttle Button */}
      <View style={styles.shuttleBar}>
        <Pressable
          style={[styles.buttonShuttle]}
          onPress={() => setShuttleVisible(true)}
          disabled={isShuttleDisabled()}>
          <Text style={styles.buttonText}>Shuttle</Text>
        </Pressable>
      </View>

      {/* Icon Bar */}
      <View style={styles.iconBar}>
        <Pressable>
          <FontAwesome style={styles.buttonIcon} name='bars' />
        </Pressable>
        
        <View style={styles.separator}></View>

        <Pressable
          onPress={() => setAddPersonVisible(true)}>
          <FontAwesome style={styles.buttonIcon} name='plus-circle' />
        </Pressable>
      </View>

      {/* Add Person Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addPersonVisible}
        onRequestClose={() => {
          setAddPersonVisible(!addPersonVisible);
        }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalView}>
          <AddEditEntity onClose={() => setAddPersonVisible(!addPersonVisible)} setPeople={setPeople} setVehicles={setVehicles} people={people}/>
        </KeyboardAvoidingView>
      </Modal>

      {/* Shuttle Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={shuttleVisible}
        onRequestClose={() => {
          setShuttleVisible(!shuttleVisible);
        }}>
        <View style={styles.shuttleView}>
          <Shuttle onClose={() => setShuttleVisible(!shuttleVisible)} people={people} vehicles={vehicles} shuttleType={shuttleType}/>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  listContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  shuttleBar: {
    position: 'absolute',
    left: 100,
    right: 100,
    bottom: 70,
    backgroundColor: undefined
  },
  meetAtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  meetAtTitle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  buttonShuttle: {
    borderColor: 'grey',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    color: 'grey',
    backgroundColor: 'white',
    margin: 10,
  },
  buttonText: {
    color: 'grey',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  iconBar: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'grey',
    maxHeight: 70,
  },
  separator: {
    flex: 1,
  },
  buttonIcon: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28,
    margin: 10,
  },
  modalView: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 300,
  },
  shuttleView: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    padding: 5,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
