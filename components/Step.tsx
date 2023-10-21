import { StepType } from "../logic/Types";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Vehicle } from "./Vehicle";

type StepProps = {
    step: StepType;
};

export const Step = ({step}: StepProps) => {
    const putInGroup = step[0];
    const takeOutGroup = step[1];

    const putInPeople = putInGroup.People;
    const putInVehicles = putInGroup.Vehicles;

    const takeOutPeople = takeOutGroup.People;
    const takeOuVehicles = takeOutGroup.Vehicles;

    return (
        <View style={styles.container}>
            {/* Put in */}
            <View style={styles.groupContainer}>
                <View style={styles.locationIndicator}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.text}>Put In</Text>
                </View>
                <FlatList 
                    data={putInVehicles}
                    renderItem={({item}) => <Vehicle vehicle={item} people={putInPeople}/>}
                    keyExtractor={item => item.personId}>
                </FlatList>
            </View>
            {/* Take out */}
            <View style={styles.groupContainer}>
                <View style={styles.locationIndicator}>
                <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.text}>Take out</Text>
                </View>
                <FlatList 
                    data={takeOuVehicles}
                    renderItem={({item}) => <Vehicle vehicle={item} people={takeOutPeople}/>}
                    keyExtractor={item => item.personId}>
                </FlatList>
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