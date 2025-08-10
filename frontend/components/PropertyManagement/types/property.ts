export type Category = {
    _id: string;
    name: string;
}

export type Facility = {
    _id: string;
    name: string;
    icon: string;
}

export type User = {
    _id: string;
    name: string;
    email: string
}

export type Property = {
  _id: string;
  name: string;
  thumnailImage: string;
  type: Category;
  averageRating: number;
  specifications: {
    bed: string;
    bath: string;
    area: string;
  };
  owner: User;
  description: string;
  facilities: Facility;
  galleryImages: string[];
  location: {
    address: string;
    latitude: number;
    longtitude: number;
  };
  price: number;
  isFeatured: boolean;
  createdAt: string;
}

export type NewPropertyState = {
  name: string;
  thumnailImage: string;
  thumbnailUri: string | null;
  type: string;
  specifications: {
    bed: string;
    bath: string;
    area: string;
  };
  owner: string;
  description: string;
  facilities: string;
  galleryImages: string[];
  galleryUris: string[];
  location: {
    address: string;
    latitude: number;
    longtitude: number;
  };
  price: string;
  isFeatured: boolean;
}

export type EditPropertyState = {
  name: string;
  thumnailImage: string;
  thumbnailUri: string | null;
  originalThumbnail: string;
  type: string;
  specifications: {
    bed: string;
    bath: string;
    area: string;
  };
  owner: string;
  description: string;
  facilities: string;
  galleryImages: string[];
  galleryUris: string[];
  originalGalleryImages: string[];
  location: {
    address: string;
    latitude: number;
    longtitude: number;
  };
  price: string;
  isFeatured: boolean;
}