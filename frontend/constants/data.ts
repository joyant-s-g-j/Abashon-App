import { PropertyFormData } from "@/components/PropertyManagement";
import icons from "./icons";
import images from "./images";

export const cards = [
  {
    title: "Card 1",
    location: "Location 1",
    price: "$100",
    rating: 4.8,
    category: "house",
    image: images.newYork,
  },
  {
    title: "Card 2",
    location: "Location 2",
    price: "$200",
    rating: 3,
    category: "house",
    image: images.japan,
  },
  {
    title: "Card 3",
    location: "Location 3",
    price: "$300",
    rating: 2,
    category: "flat",
    image: images.newYork,
  },
  {
    title: "Card 4",
    location: "Location 4",
    price: "$400",
    rating: 5,
    category: "villa",
    image: images.japan,
  },
];

export const featuredCards = [
  {
    title: "Featured 1",
    location: "Location 1",
    price: "$100",
    rating: 4.8,
    image: images.newYork,
    category: "house",
  },
  {
    title: "Featured 2",
    location: "Location 2",
    price: "$200",
    rating: 3,
    image: images.japan,
    category: "flat",
  },
];

export const settings = [
  {
    title: "My Bookings",
    icon: icons.calendar,
  },
  {
    title: "Payments",
    icon: icons.wallet,
  },
  {
    title: "Profile",
    icon: icons.person,
    route: "edit-profile"
  },
  {
    title: "Notifications",
    icon: icons.bell,
  },
  {
    title: "Security",
    icon: icons.shield,
  },
  {
    title: "Language",
    icon: icons.language,
  },
  {
    title: "Help Center",
    icon: icons.info,
  },
  {
    title: "Invite Friends",
    icon: icons.people,
  },
];

export const facilities = [
  {
    title: "Car Parking",
    icon: icons.carPark,
  },
  {
    title: "Swimming",
    icon: icons.swim,
  },
  {
    title: "Gym",
    icon: icons.dumbell,
  },
  {
    title: "Dining Area",
    icon: icons.cutlery,
  },
  {
    title: "Wifi",
    icon: icons.wifi,
  },
  {
    title: "Pet Center",
    icon: icons.dog,
  },
  {
    title: "Sports Center",
    icon: icons.run,
  },
  {
    title: "Laundry",
    icon: icons.laundry,
  },
];

export const gallery = [
  {
    id: 1,
    image: images.newYork,
  },
  {
    id: 2,
    image: images.japan,
  },
  {
    id: 3,
    image: images.newYork,
  },
  {
    id: 4,
    image: images.japan,
  },
  {
    id: 5,
    image: images.newYork,
  },
  {
    id: 6,
    image: images.japan,
  },
];


export const adminDashboard = [
  {
    id: 'property',
    title: 'Property',
    icon: 'business-outline',
    description: 'Manage property listings',
    route: '/admin-dashboard/property-management',
  },
  {
    id: 'category',
    title: 'Category',
    icon: 'folder-open-outline',
    description: 'Configure categories',
    route: '/admin-dashboard/category-management',
  },
  {
    id: 'facility',
    title: 'Facility',
    icon: 'water-outline',
    description: 'Update facilities',
    route: '/admin-dashboard/facility-management',
  },
  {
    id: 'users',
    title: 'Customer Management',
    icon: 'people-outline',
    description: 'Browse and manage registered customers',
    route: '/admin-dashboard/user-management',
  },
  {
    id: 'agents',
    title: 'Agent Directory',
    icon: 'person-outline',
    description: 'Review and manage verified agents',
    route: '/admin-dashboard/agent-management',
  },
];

export const instructionSections = {
    title: 'Core Responsibilities',
    emoji: '📋',
    points: [
      'Ensure all necessary facilities and category are created before allowing property creation',
      'Verify that all required property details are properly added',
      'Confirm that an agent is assigned to the property before publishing',
      'Validate the assigned agent’s phone number and email for accuracy',
    ]
}

type SpecificationKey = keyof PropertyFormData["specifications"];

export const specificationsFields: {
  key: SpecificationKey;
  label: string;
  placeholder: string;
}[] = [
  {
    key: 'bed',
    label: 'Bedrooms *',
    placeholder: 'Number of bedrooms',
  },
  {
    key: 'bath',
    label: 'Bathrooms *',
    placeholder: 'Number of bathrooms',
  },
  {
    key: 'area',
    label: 'Area (sq ft) *',
    placeholder: 'Enter property area',
  },
]

type LocationKey = keyof PropertyFormData["location"];

export const locationFields: {
  key: LocationKey;
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}[] = [
  {
    key: 'address',
    label: 'Address *',
    placeholder: 'Enter property address',
    keyboardType: 'default',
  },
  {
    key: 'latitude',
    label: 'Latitude *',
    placeholder: 'Enter latitude (e.g., 23.8103)',
    keyboardType: 'numeric',
  },
  {
    key: 'longitude',
    label: 'Longitude *',
    placeholder: 'Enter longitude (e.g., 90.4125)',
    keyboardType: 'numeric',
  },
]