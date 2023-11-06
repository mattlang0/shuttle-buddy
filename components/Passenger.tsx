import { PersonType } from "../logic/Types";
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

type PassengerProps = {
    person: PersonType;
};

export const Passenger = (props: PassengerProps) => {
  const { person } = props;
  let personIcon = "*";

  return (
    <View style={styles.personContainer}>
      <Text style={styles.personIcon}>{personIcon}</Text>
      <Text style={styles.personText}>{person?.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  personContainer: {
    flexDirection: 'row',
  },
  personIcon: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  personText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
  },
});