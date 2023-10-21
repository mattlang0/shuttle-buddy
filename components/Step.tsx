import { StepType } from "../logic/Types";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Vehicle } from "./Vehicle";
import { Person } from './Person';

type StepProps = {
    step: StepType;
};

export const Step = ({step}: StepProps) => {
    const putInGroup = step[0];
    const takeOutGroup = step[1];

    const putInPeople = putInGroup.People;
    const putInVehicles = putInGroup.Vehicles;
    const putInPeopleNotInVehicles = putInGroup.People.filter((p)=>!p.vehicleId);

    const takeOutPeople = takeOutGroup.People;
    const takeOuVehicles = takeOutGroup.Vehicles;
    const takeOutPeopleNotInVehicles = takeOutGroup.People.filter((p)=>!p.vehicleId);

    return (
        <View style={styles.container}>
            {/* Put in */}
            <View style={styles.groupContainer}>
                <View style={styles.locationIndicator}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.text}>Put In</Text>
                </View>
                <View style={styles.group}>
                    <FlatList 
                        data={putInVehicles}
                        renderItem={({item}) => <Vehicle vehicle={item} people={[...putInPeople, ...takeOutPeople]}/>}
                        keyExtractor={item => item.personId}>
                    </FlatList>
                    <FlatList 
                        horizontal
                        data={putInPeopleNotInVehicles}
                        renderItem={({item}) => <Person person={item}/>}
                        keyExtractor={item => item.id}>
                    </FlatList>
                </View>
            </View>
            {/* Take out */}
            <View style={styles.groupContainer}>
                <View style={styles.locationIndicator}>
                <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.text}>Take out</Text>
                </View>
                <View style={styles.group}>
                    <FlatList 
                        data={takeOuVehicles}
                        renderItem={({item}) => <Vehicle vehicle={item} people={[...putInPeople, ...takeOutPeople]}/>}
                        keyExtractor={item => item.personId}>
                    </FlatList>
                    <FlatList 
                        horizontal
                        data={takeOutPeopleNotInVehicles}
                        renderItem={({item}) => <Person person={item}/>}
                        keyExtractor={item => item.id}>
                    </FlatList>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({    
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    groupContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIndicator: {
        width: 60,
        alignItems: 'center',
        
    },
    group: {
        flex: 1,
    },
    locationIcon: {
        fontSize: 30,
    },
    text: {
        fontSize: 15,
    }
  });