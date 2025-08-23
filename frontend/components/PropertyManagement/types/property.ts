import { Category } from "@/components/CategoryManagement";
import { Facility } from "@/components/FacilityMangement";
import { ImageSourcePropType } from "react-native";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}
export interface Rating {
    _id?: string;
    user: string | User;
    rating: number;
    commnent?: string;
    createdAt: Date;
}

export interface Specifications {
  bed: string;
  bath: string;
  area: string;
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export type Property = {
    _id: string;
    name: string;
    thumbnailImage: string | ImageSourcePropType;
    type: string | Category;
    specifications: string | Specifications;
    ratings: Rating[];
    averageRating: number;
    owner: string | User;
    description: string;
    facilities: string[] | Facility[];
    galleryImages: string[];
    location: Location;
    price: number;
    isFeatured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PropertyFormData {
    name: string;
    thumbnailImage: string;
    type: string | Category;
    specifications: {
        bed: string;
        bath: string;
        area: string;
    };
    owner: User | string | null;
    description: string;
    facilities: string[] | Facility[];
    galleryImages: string[];
    location: {
        address: string;
        latitude: string;
        longitude: string;
    };
    price: string;
    isFeatured: boolean;
    imageUri: string | null;
    imageBase64: string | null;
    originalImage?: string | null;
}

export interface PropertyCreateData {
    name: string;
    thumbnailImage: string;
    type: string;
    specifications: {
        bed: string;
        bath: string;
        area: string;
    };
    owner: string;
    description: string;
    facilities: string[];
    galleryImages: string[];
    location: {
        address: string;
        latitude: number;
        longitude: number;
    };
    price: number;
    isFeatured: boolean;
}

export interface PropertyFilters {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bed?: string;
    bath?: string;
    isFeatured?: boolean;
    location?: string;
}

export type PropertyStep = 1 | 2 | 3 | 4 | 5;