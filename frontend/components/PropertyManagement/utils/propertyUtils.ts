import { Property } from "../types/property";

export const filterProperties = (properties: Property[], searchQuery: string): Property[] => {
    const query = searchQuery.trim().toLowerCase();
    if(!searchQuery.trim()) return properties;

    return properties.filter((property) => 
        property.name?.toLowerCase().includes(query) ||
        property.description?.toLowerCase().includes(query) ||
        property.type?.toString().toLowerCase().includes(query) ||
        property.location?.address.toLowerCase().includes(query)
    )
}