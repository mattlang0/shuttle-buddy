import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Text, Pressable, StyleSheet } from 'react-native';
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
          <FontAwesome style={[styles.pressableIcon, {color: '#C9C9C9'}]} name='long-arrow-up' />
        </Pressable>

      </View>

      {/* Step */}
      <Step step={steps[activeStep]} />
        
      {/* Bottom Buttons Container */}
      <View style={styles.bottomButtonsContainer}>
        <Pressable
          onPress={previousStep}>
          <FontAwesome style={styles.pressableIcon} name='chevron-left' />
        </Pressable>
        <Pressable
          onPress={nextStep}>
          <FontAwesome style={styles.pressableIcon} name='chevron-right' />
        </Pressable>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    paddingTop: 20,
    backgroundColor: '#FDFFF9',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  titleShuttleBuddy: {
    fontSize: 25,
    fontWeight: '600',
  },
  titleStepNumber: {
    margin: 10,
    fontSize: 25,
    fontWeight: '100',
    textAlign: 'center',
  },
  topButtonsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: undefined,
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, 
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
});
