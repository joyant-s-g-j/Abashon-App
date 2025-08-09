export type Category = {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
};

export type CategoryFormData = {
  name: string;
};

export interface AddButtonProps {
  onPress: () => void;
}