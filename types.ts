
export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price: number;
  imageUrl: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  themes: string[];
  imageUrl?: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  venueId: string;
  theme: string;
  catering: string;
  foodPresentation: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  totalAmount: number;
  createdAt: string;
}

export interface Feedback {
  id: string;
  clientId: string;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
