import { Facility } from "@/components/FacilityMangement";
import { Property, PropertyFormData, User } from "../types/property";

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

export const extractOwnerId = (owner: User | string | null): string | null => {
    if(!owner) return null;
    if ( typeof owner === 'string') return owner;
    if (typeof owner === 'object' && owner !== null) return owner._id
    return null;
}

const isFacility = (item: any): item is Facility => {
    return item && 
        typeof item === 'object' &&
        typeof item._id === 'string' &&
        typeof item.name === 'string'
}

export const extractFacilityIds = (facilities: string[] | Facility[]): string[] => {
    if(!Array.isArray(facilities)) return [];

    const result = facilities.map(facility => {
        if(typeof facility === 'string') {
            const trimmedId = facility.trim();
            if (trimmedId.length === 0) {
                return '';
            }
            return trimmedId;
        }

        if(isFacility(facility)) {
            const facilityId = facility._id.trim();
            if (facilityId.length === 0) {
                return '';
            }
            return facilityId;
        }
        return '';
        
    }).filter(id => {
        const isValid = id !== '' && typeof id === 'string' && id.trim().length > 0;
        return isValid
    })

    return result;
}

export const transformPropertyDataForApi = (propertyData: PropertyFormData) => {
    const ownerIdExtracted = extractOwnerId(propertyData.owner);
    const facilityIdsExtracted = extractFacilityIds(propertyData.facilities);
    const transformed = {
        name: propertyData.name,
        thumbnailImage: propertyData.thumbnailImage,
        type: typeof propertyData.type === 'object' && propertyData.type !== null 
            ? propertyData.type._id 
            : propertyData.type,
        specifications: propertyData.specifications,
        owner: ownerIdExtracted,
        description: propertyData.description,
        facilities: facilityIdsExtracted,
        galleryImages: propertyData.galleryImages,
        location: {
            address: propertyData.location.address,
            latitude: parseFloat(propertyData.location.latitude) || 0,
            longitude: parseFloat(propertyData.location.longitude) || 0,
        },
        price: parseFloat(propertyData.price) || 0,
        isFeatured: propertyData.isFeatured,
    };

    console.log('Final transformed data:', transformed);
    return transformed;
}