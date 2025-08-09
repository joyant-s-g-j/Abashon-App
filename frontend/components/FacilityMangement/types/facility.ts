import { ImageSourcePropType } from "react-native";

export type Facility = {
  _id: string;
  name: string;
  icon: string | ImageSourcePropType;
  isActive?: boolean;
  createdAt?: string;
}

export type FacilityFormData = {
  name: string;
  icon: string;
  imageUri: string | null;
  iconBase64: string | null;
  originalIcon?: string;
}