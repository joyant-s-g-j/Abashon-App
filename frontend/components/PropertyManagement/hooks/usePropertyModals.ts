import { useState } from "react"
import { Property, PropertyFormData } from "../types/property"
import { Alert } from "react-native"

export const usePropertyModals = () => {
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [newProperty, setNewProperty] = useState<PropertyFormData>({
        name: '',
        thumbnailImage: '',
        type: '',
        specifications: {
            bed: '',
            bath: '',
            area: '',
        },
        description: '',
        facilities: '',
        galleryImages: [],
        location: {
            address: '',
            latitude: '',
            longitude: '',
        },
        price: '',
        isFeatured: false,
        imageUri: null,
        imageBase64: null
    });
    const [editProperty, setEditProperty] = useState<PropertyFormData & { originalImage: string }>({
        name: '',
        thumbnailImage: '',
        type: '',
        specifications: {
            bed: '',
            bath: '',
            area: '',
        },
        description: '',
        facilities: '',
        galleryImages: [],
        location: {
            address: '',
            latitude: '',
            longitude: '',
        },
        price: '',
        isFeatured: false,
        imageUri: null,
        imageBase64: null,
        originalImage: ''
    })

    const openAddModal = () => setShowAddModal(true);

    const closeAddModal = () => {
        setNewProperty({ 
            name: '',
            thumbnailImage: '',
            type: '',
            specifications: {
                bed: '',
                bath: '',
                area: '',
            },
            description: '',
            facilities: '',
            galleryImages: [],
            location: {
                address: '',
                latitude: '',
                longitude: '',
            },
            price: '',
            isFeatured: false,
            imageUri: null,
            imageBase64: null
        })
        setShowAddModal(false)
    };

    const openEditModal = (property: Property) => {
        setSelectedProperty(property);
        const specs = typeof property.specifications === 'object' && property.specifications !== null
            ? property.specifications
            : { bed: '', bath: '', area: '' }
        const place = property.location || { address: '', latitude: 0, longitude: 0 }
        setEditProperty({
            name: property.name,
            thumbnailImage: typeof property.thumbnailImage === 'string'
                ? property.thumbnailImage
                : String(property.thumbnailImage),
            type: typeof property.type === 'string'
                ? property.type
                : property.type.name || '',
            specifications: {
                bed: specs.bed || '',
                bath: specs.bath || '',
                area: specs.area || '',
            },
            description: property.description || '',
            facilities: typeof property.facilities === 'string'
                ? property.facilities
                : property.facilities.name || '',
            galleryImages: property.galleryImages || [],
            location: {
                address: place.address || '',
                latitude: String(place.latitude || ''),
                longitude: String(place.longitude || '')
            },
            price: String(property.price || ''),
            isFeatured: property.isFeatured || false,
            imageUri: null,
            imageBase64: null,
            originalImage: typeof property.thumbnailImage === 'string'
                ? property.thumbnailImage
                : String(property.thumbnailImage)
        })
        setShowEditModal(true)
    }

    const closeEditModal = () => {
        setEditProperty({
            name: '',
            thumbnailImage: '',
            type: '',
            specifications: {
                bed: '',
                bath: '',
                area: '',
            },
            description: '',
            facilities: '',
            galleryImages: [],
            location: {
                address: '',
                latitude: '',
                longitude: '',
            },
            price: '',
            isFeatured: false,
            imageUri: null,
            imageBase64: null,
            originalImage: ''
        })
        setSelectedProperty(null);
        setShowEditModal(false)
    }

    const handleDeleteProperty = (property: Property, onConfirmDelete: (property: Property) => void) => {
        Alert.alert(
            'Delete Property',
            `Are you sure you want to delete "${property.name}"? This active cannot be undone.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => onConfirmDelete(property)
                }
            ]
        )
    };

    const updateNewPropertyImage = (imageData: string) => {
        setNewProperty(prev => ({
            ...prev,
            imageUri: imageData,
            imageBase64: imageData,
            image: imageData
        }))
    };

    const updateEditPropertyImage = (imageData: string) => {
        setEditProperty(prev => ({
            ...prev,
            imageUri: imageData,
            imageBase64: imageData,
            image: imageData
        }))
    };

    return {
        showAddModal,
        showEditModal,
        selectedProperty,
        newProperty,
        editProperty,
        openAddModal,
        closeAddModal,
        openEditModal,
        closeEditModal,
        handleDeleteProperty,
        setNewProperty,
        setEditProperty,
        updateNewPropertyImage,
        updateEditPropertyImage
    }
}