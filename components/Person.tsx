import { PersonType } from "../logic/Types";
import {
    View,
    Text,
    StyleSheet,
  } from 'react-native';

type PersonProps = {
    person: PersonType;
};

export const Person = (props: PersonProps) => {
    const { person } = props;
    let personIcon = "🧍";
  
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
      paddingLeft: 25,
      marginTop: 10,
    },
    personIcon: {
      fontSize: 20,
      marginHorizontal: 5,
    },
    personText: {
      fontSize: 12,
      lineHeight: 24,
      fontWeight: '300',
    },
  });