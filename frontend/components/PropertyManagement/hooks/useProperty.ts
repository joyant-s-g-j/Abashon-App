import { useState } from "react";
import { Property } from "../types/property";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const useProperties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadProperties = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/properties`)
        } catch (error) {
            
        }
    }
}
