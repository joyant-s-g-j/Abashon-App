import React from 'react';
import { Text } from 'react-native';

interface Props {
  title: string;
  size?: string; // Tailwind size like 'text-2xl', 'text-xl', etc.
}

const Heading: React.FC<Props> = ({ title, size = 'text-2xl' }) => {
  return (
    <Text className={`${size} text-black-300 font-rubik-bold`}>
      {title}
    </Text>
  );
};

export default Heading;
