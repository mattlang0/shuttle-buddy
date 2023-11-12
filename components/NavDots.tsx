import React from 'react';
import { StyleSheet, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type NavDotsProps =  {
    index: number;
    count: number;
}

export const NavDots = (props: NavDotsProps) => {
    const { index, count } = props;

    return (
        <View style={styles.container}>
            {Array.from(Array(count)).map((x, i) => <FontAwesome key={i} style={i === index ? styles.selected : styles.unselected} name='circle' />)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 10,
        marginBottom: 10,
        backgroundColor: undefined,
    },
    selected: {
        fontSize: 18,
        color: 'white'
    },
    unselected: {
        fontSize: 12,
        color: 'white'
    }
});