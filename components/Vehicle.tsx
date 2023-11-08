import { PersonType, VehicleType } from "../logic/Types";
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { Passenger } from "./Passenger";

type VehicleProps = {
    vehicle: VehicleType;
    people: PersonType[];
};

export const Vehicle = ({vehicle, people}: VehicleProps) => {
  const ownersName: string = people.find(p=>p.id === vehicle.personId)?.name || '';
  const peopleInVehicle: PersonType[] = people.filter(
    (person) => person.vehicleId === vehicle.personId
  );

  return (
    <View style={styles.container}>

      {/* Title */}
      <View style={styles.vehicleContainer}>
        <Text style={styles.vehicleIcon}>🚗</Text>
        <Text style={styles.vehicleText}>{ownersName}'s car</Text>
      </View>

      {/* Passengers */}
      <View  style={styles.peopleContainer}>
        {peopleInVehicle.length > 0 &&
          peopleInVehicle.map((person: PersonType) => {
            return <Passenger key={person.id} person={person} />;
          })}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({    
  container: {
    marginLeft: 10
  },
  vehicleContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  vehicleIcon: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  vehicleText: {
    fontSize: 18,
    fontWeight: '300',
    color: 'white',
  },
  peopleContainer: {
    flexWrap: 'wrap',
    paddingLeft: 50,
    gap: -5,
  },
});