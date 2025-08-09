import { View, Text } from 'react-native';
import React from 'react';

interface StatCardProps {
  value: string | number;
  label: string;
  valueColor?: string; // Optional for custom colors
  style?: string; // Tailwind extra styles
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  valueColor = 'text-black-300',
  style = '',
}) => {
  return (
    <View className={`bg-white rounded-xl p-4 shadow-sm ${style}`}>
      <Text className={`text-2xl font-rubik-bold ${valueColor}`}>{value}</Text>
      <Text className="text-sm font-rubik text-black-200">{label}</Text>
    </View>
  );
};

export default StatCard;
