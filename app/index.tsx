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

        <View style={styles.switchContainer}>
          <Switch
            style={styles.switch}
            trackColor={{false: '#3e3e3e', true: '#3e3e3e'}}
            thumbColor={shuttleType === ShuttleType.MEET_AT_PUT_IN ? 'green' : 'orange'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={shuttleType === ShuttleType.MEET_AT_TAKE_OUT}
          />
          <Text style={styles.switchLabel}>{shuttleType === ShuttleType.MEET_AT_PUT_IN ? 'Meet at Put In': 'Meet at Take Out'}</Text>
        </View>
        
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonShuttle: {
    borderColor: 'grey',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'white',
    color: 'grey',
    margin: 10,
  },
  buttonText: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconBar: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'grey'
  },
  switchContainer: {
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  switch: {
    marginTop: 10,
  },
  switchLabel: {
    color: 'white',
    fontSize: 12,
    margin: 5,
    textAlign: 'center'
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
