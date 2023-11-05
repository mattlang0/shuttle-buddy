import { StepType, GroupType, Location, PersonType } from "../logic/Types";
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
    activeStep: number;
};

export const Step = ({step, activeStep}: StepProps) => {
    const putInGroup = step[0];
    const takeOutGroup = step[1];
    const allPeople = [...putInGroup.People, ...takeOutGroup.People];

    return (
        <View style={styles.container}>
            <Text style={styles.titleStepNumber}>Step {activeStep + 1}</Text>

            <Group group={putInGroup} allPeople={allPeople} />
            <Group group={takeOutGroup} allPeople={allPeople} />
        </View>
    );
};

type GroupProps = {
    group: GroupType,
    allPeople: PersonType[],
};

const Group = ({group, allPeople}: GroupProps) => {
    const vehicles = group.Vehicles;
    const peopleNotInVehicles = group.People.filter((p)=>!p.vehicleId);
    const title = group.Location === Location.PUT_IN ? "Put In" : "Take out";

    return (
        <View style={styles.groupContainer}>

            <View style={styles.locationIndicator}>
                
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.text}>{title}</Text>
            </View>

            <View style={styles.group}>

                <FlatList 
                    data={vehicles}
                    renderItem={({item}) => <Vehicle vehicle={item} people={allPeople}/>}
                    keyExtractor={item => item.personId}>
                </FlatList>
                <FlatList 
                    horizontal
                    data={peopleNotInVehicles}
                    renderItem={({item}) => <Person person={item}/>}
                    keyExtractor={item => item.id}>
                </FlatList>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({    
    container: {
        flex: 1,
        alignItems: 'center',
    },
    titleStepNumber: {
        margin: 20,
        fontSize: 20,
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