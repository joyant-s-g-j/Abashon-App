import { View, Text } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps = 5 }) => {
  return (
    <View className='flex-row items-center justify-center mt-6'>
        {[...Array(totalSteps)].map((_, index) => {
            const step = index + 1;
            const isCompleted = step < currentStep;
            const isActive = step === currentStep;

            return (
                <View key={index} className='flex-row items-center'>
                    <View
                        className={`size-10 rounded-full items-center justify-center 
                            ${isCompleted ? "bg-green-500" : isActive ? "bg-primary-300" : "border-2 border-black-100"}`}
                    >
                        {isCompleted ? (
                            <Feather size={18} color="white" name="check" />
                        ) : (
                            <Text
                                className={`text-sm font-rubik-bold
                                ${isActive ? 'text-white' : 'text-black-300'}`}
                            >
                                {step}
                            </Text>
                        )}
                    </View>

                    {step !== totalSteps && (
                        <View className={`h-0.5 w-8 mx-1
                            ${currentStep > step ? "bg-green-500" : "bg-black-100"}`}
                        />
                    )}
                </View>
            )
        })}
    </View>
  )
}

export default Stepper