
import { User, Order, Feedback, UserRole, Venue, Service } from './types';
import { VENUES as INITIAL_VENUES, SERVICES as INITIAL_SERVICES } from './constants';

const USERS_KEY = 'festiva_users';
const ORDERS_KEY = 'festiva_orders';
const FEEDBACK_KEY = 'festiva_feedback';
const SESSION_KEY = 'festiva_session';
const VENUES_KEY = 'festiva_venues';
const SERVICES_KEY = 'festiva_services';

// Initialize admin, venues, and services if not exist
const initDb = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (!users.find((u: any) => u.role === UserRole.ADMIN)) {
    users.push({
      id: 'admin-1',
      name: 'Festiva Admin',
      email: 'admin@festiva.com',
      phone: '0000000000',
      role: UserRole.ADMIN,
      password: 'admin'
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  const venues = localStorage.getItem(VENUES_KEY);
  if (!venues) {
    localStorage.setItem(VENUES_KEY, JSON.stringify(INITIAL_VENUES));
  }

  const services = localStorage.getItem(SERVICES_KEY);
  if (!services) {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
  }
};

initDb();

export const db = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  saveUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  updateUser: (updatedUser: User) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index > -1) {
      users[index] = updatedUser;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const current = db.getCurrentUser();
      if (current && current.id === updatedUser.id) {
        db.setSession(updatedUser);
      }
      return true;
    }
    return false;
  },
  deleteUser: (id: string) => {
    const users = db.getUsers().filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  
  getOrders: (): Order[] => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  saveOrder: (order: Order) => {
    const orders = db.getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index > -1) {
      orders[index] = order;
    } else {
      orders.push(order);
    }
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },
  deleteOrder: (id: string) => {
    const orders = db.getOrders().filter(o => o.id !== id);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  getFeedback: (): Feedback[] => JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]'),
  saveFeedback: (fb: Feedback) => {
    const feedback = db.getFeedback();
    feedback.push(fb);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
  },

  getVenues: (): Venue[] => JSON.parse(localStorage.getItem(VENUES_KEY) || '[]'),
  saveVenue: (venue: Venue) => {
    const venues = db.getVenues();
    const index = venues.findIndex(v => v.id === venue.id);
    if (index > -1) {
      venues[index] = venue;
    } else {
      venues.push(venue);
    }
    localStorage.setItem(VENUES_KEY, JSON.stringify(venues));
  },
  deleteVenue: (id: string) => {
    const venues = db.getVenues().filter(v => v.id !== id);
    localStorage.setItem(VENUES_KEY, JSON.stringify(venues));
  },

  getServices: (): Service[] => JSON.parse(localStorage.getItem(SERVICES_KEY) || '[]'),
  saveService: (service: Service) => {
    const services = db.getServices();
    const index = services.findIndex(s => s.id === service.id);
    if (index > -1) {
      services[index] = service;
    } else {
      services.push(service);
    }
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  },
  deleteService: (id: string) => {
    const services = db.getServices().filter(s => s.id !== id);
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  },

  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'),
  setSession: (user: User | null) => localStorage.setItem(SESSION_KEY, JSON.stringify(user)),
  logout: () => localStorage.removeItem(SESSION_KEY)
};
