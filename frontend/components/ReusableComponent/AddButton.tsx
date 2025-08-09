import { Text, TouchableOpacity } from "react-native";
import { AddButtonProps } from "../CategoryManagement";

const AddButton: React.FC<AddButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row bg-primary-300 rounded-full size-11 items-center justify-center"
  >
    <Text className="text-white text-xl font-bold">+</Text>
  </TouchableOpacity>
);

export default AddButton;