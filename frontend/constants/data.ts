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

export const categories = [
  { title: "All", category: "All" },
  { title: "Houses", category: "House" },
  { title: "Condos", category: "Condos" },
  { title: "Duplexes", category: "Duplexes" },
  { title: "Studios", category: "Studios" },
  { title: "Villas", category: "Villa" },
  { title: "Apartments", category: "Apartments" },
  { title: "Townhomes", category: "Townhomes" },
  { title: "Others", category: "Others" },
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

export const stats = [
  { label: 'Total Properties', value: '247', color: 'bg-blue-500' },
  { label: 'Categories', value: '12', color: 'bg-green-500' },
  { label: 'Facilities', value: '38', color: 'bg-purple-500' },
  { label: 'Active Listings', value: '189', color: 'bg-orange-500' }
]

export const adminDashboard = [
  {
    id: 'property',
    title: 'Property',
    icon: '🏢',
    description: 'Manage property listings',
    route: 'property-management'
  },
  {
    id: 'category',
    title: 'Category',
    icon: '📂',
    description: 'Configure categories',
    route: 'category-management'
  },
  {
    id: 'facility',
    title: 'Facility',
    icon: '🏊',
    description: 'Update facilities',
    route: 'facility-management'
  }
]
