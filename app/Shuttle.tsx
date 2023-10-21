import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
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
    setActiveStep((currentstep)=>{
      if (currentstep === steps.length - 1) {
        return currentstep
      }
      return currentstep + 1
    });
  };

  const previousStep = () => {
    setActiveStep((currentstep)=>{
      if (currentstep === 0) {
        return currentstep
      }
      
      return currentstep - 1
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step {activeStep + 1}</Text>
      
      <View style={styles.stepContainer}>
        <Step step={steps[activeStep]}/>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

      <View style={styles.stepController}>
        <Pressable
          style={[styles.button]}
          onPress={previousStep}>
          <Text style={styles.buttonText}>{'<'}</Text>
        </Pressable>
        <Pressable
          style={[styles.button]}
          onPress={nextStep}>
          <Text style={styles.buttonText}>{'>'}</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.button]}
        onPress={onClose}>
        <Text style={styles.buttonText}>Close</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'stretch',
    margin: 10,
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  stepController: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#2196F3',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
