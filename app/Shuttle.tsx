import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, Pressable, StyleSheet, ImageBackground, Modal } from 'react-native';
import { View } from '../components/Themed';
import { PersonType, VehicleType, ShuttleType, StepType } from '../logic/Types';
import { calculateMeetAtPutIn } from '../logic/logic';
import SwipableTabs from './SwipableTabs';
import { NavDots } from '../components/NavDots';
import QRCodeModal from './QRCodeModal';

type ShuttleProps = {
  people: PersonType[],
  vehicles: VehicleType[],
  shuttleType: ShuttleType,
  onClose:()=>void
};

export default function Shuttle(props: ShuttleProps) {
  const { people, vehicles, shuttleType, onClose} = props;
  const steps: StepType[] = calculateMeetAtPutIn(people, vehicles);
  const [activeStep, setActiveStep] = useState(0);
  const [qrCodeVisible, setQRCodeVisible] = useState(false);

  const nextStep = () => {
    setActiveStep(currentstep=>currentstep === steps.length - 1 ? currentstep : currentstep + 1);
  };

  const previousStep = () => {
    setActiveStep(currentstep=>currentstep === 0 ? currentstep : currentstep - 1);
  };

  const isBackButtonDisabled = () => {
    return activeStep === 0;
  }

  const isNextButtonDisabled = () => {
    return activeStep === steps.length - 1
  }

  const onShare = () => {
    setQRCodeVisible(true);
  };


  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/images/1.png')} resizeMode='cover' style={styles.image}>

        {/* Top Buttons Container */}
        <View style={styles.topButtonsContainer}>

          {/* Back button */}
          <Pressable
            onPress={onClose}>
            <FontAwesome style={styles.pressableIcon} name='angle-left' />
          </Pressable>

          {/* Shuttle Buddy Step # Title */}
          <View style={styles.titleContainer}>
              <Text style={styles.titleShuttleBuddy}>Shuttle Buddy |</Text>
              <Text style={styles.titleStepNumber}>Step {activeStep + 1}</Text>
          </View>

          {/* Share button */}
          <Pressable
            onPress={onShare}>
            <FontAwesome style={styles.pressableIcon} name='long-arrow-up' />
          </Pressable>

        </View>

        {/* Step */}
        <SwipableTabs steps={steps} index={activeStep} setIndex={setActiveStep}/>

        {/* Bottom Nav Dots */}
        <NavDots index={activeStep} count={steps.length} />

        {/* QR Code Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={qrCodeVisible}
            onRequestClose={() => {
              setQRCodeVisible(!setQRCodeVisible);
            }}>
            <QRCodeModal onClose={() => {setQRCodeVisible(false)}} people={people} vehicles={vehicles} shuttleType={shuttleType}/>
        </Modal>

      </ImageBackground>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  topButtonsContainer: {
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: undefined,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: undefined,
  },
  titleShuttleBuddy: {
    fontSize: 25,
    fontWeight: '100',
  },
  titleStepNumber: {
    margin: 10,
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
  },
  pressableIcon: {
    fontSize: 28,
    marginHorizontal: 15,
    color: '#2E2E2E',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
