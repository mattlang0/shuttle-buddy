import React, { useState } from 'react';
import { StyleSheet, Pressable, Modal, KeyboardAvoidingView, Platform } from 'react-native';
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

  return (
    <View style={styles.container}>
      
      <View style={styles.listContainer}>
        <List people={people} vehicles={vehicles} setPeople={setPeople} setVehicles={setVehicles} />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.buttonAddPerson]}
          onPress={() => setAddPersonVisible(true)}>
          <Text style={styles.buttonText}>Add Person</Text>
        </Pressable>

        <Pressable
          style={[styles.buttonShuttle]}
          onPress={() => setShuttleVisible(true)}
          disabled={isShuttleDisabled()}>
          <Text style={styles.buttonText}>Shuttle</Text>
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
    flex: 8,
    alignItems: 'stretch',
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  buttonAddPerson: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'orange',
  },
  buttonShuttle: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'green',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
