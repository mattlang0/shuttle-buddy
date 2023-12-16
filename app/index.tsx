import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, Pressable, Modal, Switch, Text, View } from 'react-native';
import AddEditEntity from './AddEditEntity';
import Shuttle from './Shuttle';
import { PersonType, VehicleType, ShuttleType } from "../logic/Types";
import { List } from '../components/List';
import { isScenarioValid } from '../logic/logic';
import { colors } from '../assets/colors';

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
      return ShuttleType.MEET_AT_TAKE_OUT;
    }
    return ShuttleType.MEET_AT_PUT_IN;
  });

  return (
    <View style={styles.container}>

      {/* Input Switch: Meet at Put In / Take Out */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>
          {shuttleType === ShuttleType.MEET_AT_PUT_IN ? 'Meet at Put In': 'Meet at Take Out'}
        </Text>
        <Switch
            trackColor={{false: colors.putIn, true: colors.takeOut}}
            thumbColor={colors.light}
            ios_backgroundColor={colors.putIn}
            onValueChange={toggleSwitch}
            value={shuttleType === ShuttleType.MEET_AT_TAKE_OUT}
          />
      </View>

      {/* Input Button : People, Add Person */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>
          {'People'}
        </Text>
        <Pressable
          onPress={() => setAddPersonVisible(true)}
          style={styles.row}>
            <Text style={styles.inputAddPersonText}>
              {'Add Person'}
            </Text>
            <FontAwesome style={styles.inputAddPersonButton} name='plus-circle' />
        </Pressable>
      </View>

      {people.length > 0 ? 
        <View style={styles.listContainer}>
          <List people={people} vehicles={vehicles} setPeople={setPeople} setVehicles={setVehicles} />
        </View> : 
        <View style={styles.noPeopleContainer}>
          <Text style={styles.noPeopleText}>
            Click 'Add Person' to begin
          </Text>
        </View>}
      
      {/* Shuttle Button */}
      <View style={styles.buttonShuttleContainer}>
        <Pressable
          style={isShuttleDisabled() ? styles.buttonShuttleDisabled : styles.buttonShuttle}
          onPress={() => setShuttleVisible(true)}
          disabled={isShuttleDisabled()}>
          <Text style={isShuttleDisabled() ? styles.buttonShuttleTextDisabled : styles.buttonShuttleText}>Shuttle</Text>
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
        <AddEditEntity onClose={() => setAddPersonVisible(!addPersonVisible)} setPeople={setPeople} setVehicles={setVehicles} setShuttleType={setShuttleType} setShuttleVisible={setShuttleVisible} people={people}/>
      </Modal>

      {/* Shuttle Modal */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={shuttleVisible}
        onRequestClose={() => {setShuttleVisible(!shuttleVisible);}}>
          <Shuttle onClose={() => setShuttleVisible(!shuttleVisible)} people={people} vehicles={vehicles} shuttleType={shuttleType}/>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: colors.light,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  inputTitle: {
    color: colors.dark,
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 18,
  },
  inputAddPersonText: {
    color: colors.positive,
    textAlign: 'center',
    fontSize: 14,
  },
  inputAddPersonButton: {
    color: colors.positive,
    fontSize: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  listContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  buttonShuttleContainer: {
    marginHorizontal: 40,
  },
  buttonShuttle: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: colors.positive,
    margin: 10,
  },
  buttonShuttleDisabled: {
    borderColor: colors.disabled,
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: colors.light,
    margin: 10,
  },
  buttonShuttleText: {
    color: colors.light,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonShuttleTextDisabled: {
    color: colors.disabled,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  noPeopleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPeopleText: {
    fontWeight: "600",
    color: colors.dark,
    marginBottom: 30,
  },
});
