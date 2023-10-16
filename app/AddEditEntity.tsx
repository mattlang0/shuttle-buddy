import React, { SetStateAction, Dispatch } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '../components/Themed';
import { PersonType, VehicleType, EntityType } from '../logic/Types';

type AddEditEntityProps = {
  onClose:()=>void,
  setPeople: Dispatch<SetStateAction<[] | PersonType[]>>,
  setVehicles: Dispatch<SetStateAction<[] | VehicleType[]>>,
  people: PersonType[]
  entity?: EntityType;
};

export default function AddEditEntity(props: AddEditEntityProps) {
  const { onClose, setPeople, setVehicles, people, entity } = props;
  const [name, onChangeName] = React.useState(entity ? entity.person.name : '');
  const [space, onChangeSpace] = React.useState(entity?.vehicle? entity.vehicle.maxSpace - 1 : 0);

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
    if (space < 10) {
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

  return (
    <View style={styles.container}>

      <Text style={styles.title}>{entity ? 'Edit' : 'Add'} Person</Text>

      <TextInput
        style={styles.nameInput}
        onChangeText={onChangeName}
        value={name}
        placeholder='Name'
        autoFocus
      />
      <View style={styles.spaceContainer}>
        <Text style={styles.textSpaceLabel}>
          Space available:
        </Text>
        <View style={styles.spaceContainer}>
          <Pressable
            style={[styles.buttonDecreaseIncrease]}
            onPress={decreaseSpace}>
            <Text style={styles.buttonText}>-</Text>
          </Pressable>
          <Text style={styles.textSpaceLabel}>
            {space === 0 ? 'No Car' : space}
          </Text>
          <Pressable
            style={[styles.buttonDecreaseIncrease]}
            onPress={increaseSpace}>
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <View style={styles.buttonContainer}>
        {entity ? 
        <Pressable
          style={[styles.buttonDelete]}
          onPress={onDeleteClick}>
          <Text style={styles.buttonText}>Delete</Text>
        </Pressable> : 
        <Pressable
          style={[styles.buttonClose]}
          onPress={onClose}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>}
        <Pressable
          disabled={isSaveDisabled()}
          style={[styles.buttonSave]}
          onPress={onSaveClick}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-between',
    padding: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,

  },
  spaceContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  spaceInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textSpaceLabel: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDecreaseIncrease: {
    backgroundColor: 'grey',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
  },
  buttonSave: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'green',
  },
  buttonDelete: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nameInput: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
