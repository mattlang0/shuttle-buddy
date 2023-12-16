import React, { useState, useEffect } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ScenarioType } from '../logic/Types';
import { colors } from '../assets/colors';

type QRCodeScannerProps = {
    onClose:(data? : ScenarioType)=>void,
};

type dataType = {
    type: string;
    data: string;
};

export default function QRCodeScanner(props: QRCodeScannerProps) {
    const { onClose } = props;
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        };
    
        getBarCodeScannerPermissions();
      }, []);

    const handleBarCodeScanned = ({ data }: dataType) => {
        setScanned(true);

        try {
            const parsedData: ScenarioType =  JSON.parse(data);
            onClose(parsedData);
        } catch (error) {
            onClose();
            alert('Error scanning data');
        }
    };

    const getScannerComponent = () => {
        if (hasPermission === null) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>Requesting camera permission</Text>
                </View>
            );
        }
        if (hasPermission === false) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>No access to camera</Text>
                </View>
            );
        }
        return (
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.scanner}
            />
        );
    };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={()=>{onClose()}}>
                <FontAwesome style={styles.pressableIcon} name='angle-left' />
            </Pressable>

            {getScannerComponent()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    pressableIcon: {
      fontSize: 28,
      margin: 15,
      color: colors.dark,
    },
    text: {
        textAlign: 'center',
    },
    scanner: {
        flex: 1,
    },
});