import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Pressable, StyleSheet } from 'react-native';
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

  // const onShare = () => {};

  return (
    <View style={styles.container}>

      {/* Top Buttons Container */}
      <View style={styles.topButtonsContainer}>
        <Pressable
          onPress={onClose}>
          <FontAwesome style={styles.pressableIcon} name='chevron-left' />
        </Pressable>
        {/* <Pressable
          onPress={onShare}>
          <FontAwesome style={styles.topBarIcon} name='share' />
        </Pressable> */}
      </View>

      {/* Step */}
      <Step step={steps[activeStep]} activeStep={activeStep}/>
        
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
  topButtonsContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: undefined,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: undefined,
  },
  pressableIcon: {
    fontSize: 24,
    margin: 10,
    color: '#2E2E2E',
  },
});
