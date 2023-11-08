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
};

export const Step = ({step}: StepProps) => {
    const putInGroup = step[0];
    const takeOutGroup = step[1];
    const allPeople = [...putInGroup.People, ...takeOutGroup.People];

    return (
        <View style={styles.container}>

            {/* Put In Group */}
            <Group group={putInGroup} allPeople={allPeople} />

            {/* Take Out Group */}
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
    const title = group.Location === Location.PUT_IN ? "Put in" : "Take out";
    const icon = group.Location === Location.PUT_IN ? "📍" : "🏁";

    return (
        <View style={styles.groupContainer}>

            {/* Put in / Take out Title */}
            <View style={styles.locationTitle}>
                <Text style={styles.locationIcon}>{icon}</Text>
                <Text style={styles.locationText}>{title}</Text>
            </View>

            <View style={styles.group}>

                {/* Vehicles */}
                {vehicles.length > 0 && <FlatList 
                    data={vehicles}
                    renderItem={({item}) => <Vehicle vehicle={item} people={allPeople}/>}
                    keyExtractor={item => item.personId}>
                </FlatList>}

                {/* People */}
                {peopleNotInVehicles.length > 0 && <FlatList
                    data={peopleNotInVehicles}
                    renderItem={({item}) => <Person person={item}/>}
                    keyExtractor={item => item.id}>
                </FlatList>}

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
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.9)',
        borderRadius: 20,
        margin: 10,
        padding: 10,
    },
    group: {
        flexDirection: 'row',
    },
    locationTitle: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        fontSize: 20,
    },
    locationText: {
        fontWeight: '400',
        fontSize: 20,
        color: 'white',
    },
});