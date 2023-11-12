import React, { SetStateAction, Dispatch } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput, KeyboardAvoidingView, Modal, Text, View } from 'react-native';
import { PersonType, VehicleType, EntityType, ScenarioType, ShuttleType } from '../logic/Types';
import QRCodeScanner from './QRCodeScanner';

type AddEditEntityProps = {
  onClose:()=>void,
  setPeople: Dispatch<SetStateAction<[] | PersonType[]>>,
  setVehicles: Dispatch<SetStateAction<[] | VehicleType[]>>,
  setShuttleType?: Dispatch<SetStateAction<ShuttleType>>,
  setShuttleVisible?: Dispatch<SetStateAction<boolean>>,
  people: PersonType[]
  entity?: EntityType;
};

export default function AddEditEntity(props: AddEditEntityProps) {
  const { onClose, setPeople, setVehicles, setShuttleType, setShuttleVisible, people, entity } = props;
  const [name, onChangeName] = React.useState(entity ? entity.person.name : '');
  const [space, onChangeSpace] = React.useState(entity?.vehicle? entity.vehicle.maxSpace - 1 : 0);
  const [qrScannerVisible, setQrScannerVisible] = React.useState(false);
  const maxSpace: number = 10;

  const onSaveClick = () => {
    if (entity) {
      setPeople((prevPeople) => {
        let people: PersonType[] = prevPeople;
        const idx = people.findIndex((p => p.id === entity.person.id));
        people[idx].name = name;

        return [...people]
      });

      setVehicles((prevVehicles) => {
        let vehicles: VehicleType[] = prevVehicles;
        const idx = vehicles.findIndex((v => v.personId === entity.person.id));
        const vehicleExists = idx >= 0;

        if (vehicleExists) {
          if (space === 0) {
            vehicles.splice(idx, 1);
          }
          else {
            vehicles[idx].maxSpace = space + 1;
          }
        } else {
          if (space > 0) {
            const vehicle: VehicleType = {
              personId: entity.person.id,
              maxSpace: space + 1,
            };
            return [...prevVehicles, vehicle]
          }
        }
        return [...vehicles]
      });
    } else {
      const personId = Math.random().toString(16).slice(2);
      const person: PersonType = {
        id: personId,
        name,
        vehicleId: space > 0 ? personId : undefined,
      };
      setPeople((prevPeople) => [...prevPeople, person]);
      if (space > 0) {
        const vehicle: VehicleType = {
          personId: personId,
          maxSpace: space + 1,
        };
        setVehicles((prevVehicles) => [...prevVehicles, vehicle]);
      }
    }
    
    onClose();
  };

  const onDeleteClick = () => {
    setPeople((prevPeople) => {
      let people: PersonType[] = prevPeople;
      const idx = people.findIndex((p => p.id === entity?.person.id));
      people.splice(idx, 1);
      return [...people]
    });
    setVehicles((prevVehicles) => {
      let vehicles: VehicleType[] = prevVehicles;
      const idx = vehicles.findIndex((v => v.personId === entity?.person.id));
      const vehicleExists = idx >= 0;
      if (vehicleExists) {
        vehicles.splice(idx, 1);
      }
      return [...vehicles]
    });
  };

  const increaseSpace = () => {
    if (space < maxSpace) {
      onChangeSpace(space + 1);
    }
  };

  const decreaseSpace = () => {
    if (space > 0) {
      onChangeSpace(space - 1);
    }
  };

  const isSaveDisabled = () => {
    let isDisabled = false;
    if (!!!name) {
      isDisabled = true;
    }
    if (!entity && people.find((p)=>{return p.name === name})) {
      isDisabled = true;
    }
    return isDisabled;
  };

  const isDeleteDisabled = () => {
    return !!!entity;
  };

  const isMinusDisabled = () => {
    return space === 0;
  };

  const isPlusDisabled = () => {
    return space === maxSpace
  };

  const onQRScannerClose = (data? : ScenarioType) => {
    setQrScannerVisible(false);

    if (data) {
      setPeople(data.people);
      setVehicles(data.vehicles);
      setShuttleType && setShuttleType(data.shuttleType);
      onClose();
      setShuttleVisible && setShuttleVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>

      <View style={styles.modal}>


        {/* Top Buttons Container */}
        <View style={styles.topButtonsContainer}>
          {/* Back button */}
          <Pressable
            onPress={onClose}>
            <FontAwesome style={styles.pressableIcon} name='angle-left' />
          </Pressable>

          {/*  Title */}
          <Text style={styles.title}>{entity ? 'Edit' : 'Add'} Person</Text>

          {/* QR Code Scanner */}
          {entity ? 
          <FontAwesome style={styles.hiddenButton} name='qrcode' /> : 
          <Pressable
              onPress={()=>{setQrScannerVisible(true)}}>
              <FontAwesome style={styles.pressableIcon} name='qrcode' />
          </Pressable>
          }
        </View>
        

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.icon}>{space > 0 ? "🚗" : "🧍"}</Text>
          <TextInput
            style={styles.inputName}
            onChangeText={onChangeName}
            value={name}
            placeholder='Name'
          />
        </View>

        {/* Space available Input */}
        <View style={styles.inputContainer}>

          {/* Title */}
          <Text style={styles.inputTitle}>
            Space available:
          </Text>

          <View style={styles.inputSpaceContainer}>
            {/* minus */}
            <Pressable
              onPress={decreaseSpace}>
              <FontAwesome style={isMinusDisabled() ? styles.pressableIconDisabled : styles.iconPlusMinus} name='minus-circle' />
            </Pressable>

            {/* # / No Car */}
            <Text style={styles.inputSpaceValue}>
              {space === 0 ? 'No Car' : space}
            </Text>

            {/* plus */}
            <Pressable
              onPress={increaseSpace}>
              <FontAwesome style={isPlusDisabled() ? styles.pressableIconDisabled : styles.iconPlusMinus} name='plus-circle' />
            </Pressable>
          </View>

        </View>

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

        {/* Save */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={isSaveDisabled() ? styles.buttonSaveDisabled : styles.buttonSave}
            onPress={onSaveClick}
            disabled={isSaveDisabled()}>
            <Text style={isSaveDisabled() ? styles.buttonSaveTextDisabled : styles.buttonSaveText}>Save</Text>
          </Pressable>
        </View>

        {/* Delete */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={isDeleteDisabled() ? styles.buttonDeleteDisabled : styles.buttonDelete}
            onPress={onDeleteClick}
            disabled={isDeleteDisabled()}>
            <Text style={isDeleteDisabled() ? styles.buttonDeleteTextDisabled : styles.buttonDeleteText}>
              <FontAwesome style={{}} size={20} name='trash' /> Remove
            </Text>
          </Pressable>
        </View>

      </View>

      {/* QRCode Scanner Modal */}
      <Modal
          animationType="slide"
          transparent={true}
          visible={qrScannerVisible}
          onRequestClose={()=>onQRScannerClose}>
          <QRCodeScanner onClose={onQRScannerClose} />
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 10,
    backgroundColor: '#F5F5F5',
    borderColor: 'grey',
    borderWidth: 1,
    gap: 15,
  },
  topButtonsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: undefined,
  },
  title: {
    margin: 10,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    gap: 5,
  },
  inputName: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 20,
    flex: 1,
    padding: 10,
  },
  inputTitle: {
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 18,
  },
  inputSpaceContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputSpaceValue: {
    color: 'black',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 16,
    width: 60,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  buttonSave: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#1B9321',
  },
  buttonSaveDisabled: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: 'grey',
  },
  buttonSaveText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonSaveTextDisabled: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonDelete: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#BE1E1E',
  },
  buttonDeleteDisabled: {
    borderColor: 'grey',
    borderWidth: 0,
    borderRadius: 20,
    padding: 10,
    color: 'grey',
    backgroundColor: 'white',
  },
  buttonDeleteText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonDeleteTextDisabled: {
    color: 'grey',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  iconPlusMinus: {
    fontSize: 28,
    color: '#1B9321',
  },
  pressableIconDisabled: {
    fontSize: 28,
    color: 'grey',
  },
  icon: {
    fontSize: 30,
  },
  pressableIcon: {
    fontSize: 28,
    marginHorizontal: 15,
    color: '#2E2E2E',
  },
  hiddenButton: {
    fontSize: 28,
    marginHorizontal: 15,
    color: 'white',
  },
});
