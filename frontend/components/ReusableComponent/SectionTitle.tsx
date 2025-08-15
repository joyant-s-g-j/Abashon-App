import React from 'react';
import { Text } from 'react-native';

interface SectionTitleProps {
  title: string;
  count?: number;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, count }) => {
  return (
    <Text className='text-lg font-rubik-semibold text-black-300 mb-4'>
      {title} {count !== undefined && `(${count})`}
    </Text>
  );
};

export default SectionTitle;
