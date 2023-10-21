import { PersonType, VehicleType } from "../logic/Types";
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { Person } from "./Passenger";

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
        <View style={styles.vehicleContainer}>
          <Text style={styles.vehicleIcon}>🚗</Text>
          <Text style={styles.vehicleText}>{ownersName}'s car</Text>
        </View>
        <View  style={styles.peopleContainer}>
          {peopleInVehicle.length > 0 &&
            peopleInVehicle.map((person: PersonType) => {
              return <Person key={person.id} person={person} />;
            })}
        </View>
      </View>
    );
};

const styles = StyleSheet.create({    
    container: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
    },
    vehicleContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
    },
    vehicleIcon: {
        fontSize: 30,
    },
    vehicleText: {
        fontSize: 12,
    },
    peopleContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexGrow: 1,
    },
  });