
import { Venue, Service } from './types';

export const VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'The Grand Marquee, Lahore',
    location: 'Gulberg III, Lahore',
    capacity: 1000,
    price: 150000,
    imageUrl: 'https://picsum.photos/seed/venue1/800/600'
  },
  {
    id: 'v2',
    name: 'Serena Emerald Hall',
    location: 'Islamabad',
    capacity: 500,
    price: 250000,
    imageUrl: 'https://picsum.photos/seed/venue2/800/600'
  },
  {
    id: 'v3',
    name: 'Beach Luxury Garden',
    location: 'Karachi',
    capacity: 1500,
    price: 180000,
    imageUrl: 'https://picsum.photos/seed/venue3/800/600'
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Marriage Ceremony',
    description: 'A complete package for your big day, including Nikah and Valima arrangements.',
    basePrice: 50000,
    themes: ['Royal Mughal', 'Minimalist White', 'Ethereal Forest', 'Classic Gold']
  },
  {
    id: 's2',
    name: 'Birthday Party',
    description: 'Magical celebrations for all ages with vibrant decor and entertainment.',
    basePrice: 20000,
    themes: ['Superheroes', 'Princess Palace', 'Tropical Vibes', 'Vintage Circus']
  }
];

export const FOOD_PRESENTATION_STYLES = [
  'Traditional Buffet',
  'Fine Dining Plated',
  'Live Cooking Stations',
  'Cocktail Style'
];

export const CATERING_PACKAGES = [
  'Premium Pakistani (Mutton Karahi, Biryani, BBQ)',
  'Continental Fusion (Steaks, Pasta, Salads)',
  'Traditional Mughlai Feast',
  'Vegetarian Special'
];

export const PORTFOLIO_IMAGES = [
  { url: 'https://picsum.photos/seed/p1/800/800', title: 'Grand Wedding 2023' },
  { url: 'https://picsum.photos/seed/p2/800/800', title: 'Neon Birthday Bash' },
  { url: 'https://picsum.photos/seed/p3/800/800', title: 'Elegant Valima' },
  { url: 'https://picsum.photos/seed/p4/800/800', title: 'Kid\'s Fantasy Party' },
  { url: 'https://picsum.photos/seed/p5/800/800', title: 'Traditional Mehndi' },
  { url: 'https://picsum.photos/seed/p6/800/800', title: 'Corporate Gala' },
];
