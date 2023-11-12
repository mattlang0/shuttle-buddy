import React, { Dispatch, SetStateAction, useState } from 'react';
import { EntityType, PersonType, VehicleType } from "../logic/Types";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AddEditEntity from '../app/AddEditEntity';

type EntityProps = {
    entity: EntityType;
    people: PersonType[];
    vehicles: VehicleType[];
    setPeople: Dispatch<SetStateAction<[] | PersonType[]>>,
    setVehicles: Dispatch<SetStateAction<[] | VehicleType[]>>,
};

export const Entity = (props: EntityProps) => {
    const [editEntityVisible, setEditEntityVisible] = useState(false);

    const { entity, people, vehicles, setPeople, setVehicles } = props;
    let icon = entity.vehicle ? "🚗" : "🧍";
    let name = entity.person.name;
    let space = entity.vehicle?.maxSpace || null;
    
    return (
      <View style={styles.container}>

        <Text style={styles.icon}>{icon}</Text>

        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{name}</Text>
          {space && <Text style={styles.nameSubtext}>Room for {space - 1} passengers</Text>}
        </View>

        <View style={styles.separator} />
        
        <Pressable onPress={() => setEditEntityVisible(true)}>
            <FontAwesome size={28} style={styles.iconEdit} name={'ellipsis-v'} color={'grey'} />
        </Pressable>

        {/* Edit Person Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={editEntityVisible}
            onRequestClose={() => {
            setEditEntityVisible(!editEntityVisible);
            }}>
            <AddEditEntity onClose={() => setEditEntityVisible(!editEntityVisible)} setPeople={setPeople} setVehicles={setVehicles} people={people} entity={entity}/>
        </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
        paddingBottom: 10,
        gap: 10,
    },
    icon: {
      fontSize: 30,
    },
    nameContainer: {
      display: 'flex',
    },
    nameText: {
        fontSize: 16,
    },
    nameSubtext: {
        fontSize: 12,
        color: 'grey',
    },
    separator: {
      flex: 1,
    },
    iconEdit: {
        fontSize: 25,
        paddingRight: 13,
    },
  });