import React, { useState, useEffect } from 'react';
import { FontAwesome } from "@expo/vector-icons";
import { Text, View, StyleSheet, Pressable, Alert } from 'react-native';
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
            const { granted } = await BarCodeScanner.getPermissionsAsync();
            if (!granted) {
                Alert.alert('Camera access required', 'Shuttle Buddy uses your camera to scan qr codes. Please allow camera access in settings.', [{text: 'OK', onPress: async () => {
                    const { granted } = await BarCodeScanner.requestPermissionsAsync();
                    setHasPermission(granted);
                }}]);
            } else {
                const { granted } = await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(granted);
            }
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

            <View style={styles.topBar}>
                <Pressable
                    onPress={()=>{onClose()}}>
                    <FontAwesome style={styles.pressableIcon} name='angle-left' />
                </Pressable>

                <Text style={styles.textTitle}>Scan a shuttle</Text>

                <FontAwesome style={styles.hiddenButton} name='angle-right' />
                
            </View>

            <Text style={styles.textDescription}>Scan a friends Shuttle Buddy QR Code</Text>
            
            <Text style={styles.textItalics}>This will overwrite your current shuttle</Text>

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
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    pressableIcon: {
        fontSize: 28,
        margin: 15,
        color: colors.dark,
    },
    hiddenButton: {
        fontSize: 28,
        margin: 15,
        color: colors.light,
    },
    textTitle: {
        textAlign: 'center',
        fontSize: 20,
    },
    textDescription: {
        textAlign: 'center',
    },
    textItalics: {
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 12
    },
    text: {
        textAlign: 'center',
    },
    scanner: {
        flex: 1,
    },
});