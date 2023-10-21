import { PersonType, VehicleType, StepType } from "../logic/Types";
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { Person } from "./Person";

type StepProps = {
    step: StepType;
};

export const Step = ({step}: StepProps) => {
    const putInGroup = step[0];
    const takeOutGroup = step[1];

    return (
        <View style={styles.container}>
            {/* Put in */}
            <View style={styles.groupContainer}>
                <View style={styles.locationIndicator}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.text}>Put In</Text>
                </View>
                <Text style={styles.group}>Group here</Text>
            </View>
            {/* Take out */}
            <View style={styles.groupContainer}>
                <View style={styles.locationIndicator}>
                    <Text>📍</Text>
                    <Text>Take Out</Text>
                </View>
                
                <Text>Group here</Text>
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
        width: 100,
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