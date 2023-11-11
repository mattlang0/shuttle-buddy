import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { View } from '../components/Themed';
import { PersonType, VehicleType, ShuttleType, StepType } from '../logic/Types';
import { calculateMeetAtPutIn } from '../logic/logic';
import { Step } from '../components/Step';

type ShuttleProps = {
  people: PersonType[],
  vehicles: VehicleType[],
  shuttleType: ShuttleType,
  onClose:()=>void
};

export default function Shuttle(props: ShuttleProps) {
  const { people, vehicles, onClose } = props;
  const steps: StepType[] = calculateMeetAtPutIn(people, vehicles);
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => {
    setActiveStep(currentstep=>currentstep === steps.length - 1 ? currentstep : currentstep + 1);
  };

  const previousStep = () => {
    setActiveStep(currentstep=>currentstep === 0 ? currentstep : currentstep - 1);
  };

  const onShare = () => {};


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
        <Step step={steps[activeStep]} />
          
        {/* Bottom Buttons Container */}
        <View style={styles.bottomButtonsContainer}>
          <Pressable
            onPress={previousStep}>
              <View style={styles.nextPreviousButton}>
                <FontAwesome style={styles.pressableIconLeftRight} name='chevron-left' />
                <Text style={styles.nextPreviousText}>Back</Text>
              </View>
          </Pressable>
          <Pressable
            onPress={nextStep}>
              <View style={styles.nextPreviousButton}>
                <Text style={styles.nextPreviousText}>Next</Text>
                <FontAwesome style={styles.pressableIconLeftRight} name='chevron-right' />
              </View>
          </Pressable>
        </View>
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
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    margin: 10,
    backgroundColor: undefined,
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
  nextPreviousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: undefined,
  },
  nextPreviousText: {
    fontSize: 20,
    color: 'white',
  },
  pressableIconLeftRight: {
    fontSize: 20,
    marginHorizontal: 15,
    color: 'white',
  },
});
