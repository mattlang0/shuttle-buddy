import { PersonType, VehicleType } from "../logic/Types";
import {
    View,
    FlatList,
    StyleSheet,
    StatusBar,
    } from 'react-native';
import { Entity } from './Entity';
import { Dispatch, SetStateAction } from "react";

type ListProps = {
    people: PersonType[];
    vehicles: VehicleType[];
    setPeople: Dispatch<SetStateAction<[] | PersonType[]>>,
    setVehicles: Dispatch<SetStateAction<[] | VehicleType[]>>,
};

export const List = (props: ListProps) => {
  const { people, vehicles, setPeople, setVehicles } = props;

  let entities = people.map((p)=>{
    return {person: p, vehicle: vehicles.find((v)=>{return v.personId === p.id})};
  });
  entities = entities.sort((a)=> {
    return a.vehicle ? -1 : 1;
  });

  return (
    <View>
        <FlatList 
            data={entities}
            renderItem={({item}) => <Entity entity={item} people={people} vehicles={vehicles} setPeople={setPeople} setVehicles={setVehicles}/>}
            keyExtractor={item => item.person.id}>
        </FlatList>
    </View>
  );
};