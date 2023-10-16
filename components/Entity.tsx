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
        <Text style={styles.iconEntity}>{icon}</Text>
        <Text style={styles.textName}>{name}</Text>
        {space && <Text style={styles.textSpace}>Room for {space - 1}</Text>}
        <Pressable onPress={() => setEditEntityVisible(true)}>
            <FontAwesome size={28} style={styles.iconEdit} name={'cog'} color={'grey'} />
        </Pressable>

        {/* Add Person Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={editEntityVisible}
            onRequestClose={() => {
            setEditEntityVisible(!editEntityVisible);
            }}>
            <View style={styles.modalView}>
            <AddEditEntity onClose={() => setEditEntityVisible(!editEntityVisible)} setPeople={setPeople} setVehicles={setVehicles} people={people} entity={entity}/>
            </View>
        </Modal>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconEntity: {
      fontSize: 35,
      padding: 5
    },
    textName: {
        flex: 1,
        fontSize: 24,
    },
    textSpace: {
        fontSize: 14,
        color: 'grey',
    },
    iconEdit: {
        fontSize: 25,
        padding: 5
    },
    modalView: {
        flex: 1,
        marginTop: 180,
        marginBottom: 180,
        margin: 20,
        borderRadius: 20,
        padding: 5,
        alignItems: 'stretch',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
  });