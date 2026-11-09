import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  role: Role;
  token: string | null;
  loginAsRole: (role: Role) => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;
  allDemoUsers: User[];
  isDemoSwitchOpen: boolean;
  setIsDemoSwitchOpen: (open: boolean) => void;
}

const DEFAULT_USERS: User[] = [
  {
    id: 'user_farmer_1',
    name: 'Rameshwar Patidar',
    email: 'rameshwar@krishiconnect.in',
    role: 'farmer',
    phone: '+91 98261 45890',
    avatar: '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg',
    location: 'Sehore, Madhya Pradesh',
    coordinates: { lat: 23.0184, lng: 76.7212 },
    createdAt: '2025-01-15T00:00:00Z',
    kycStatus: 'verified',
    kycData: {
      aadhaarNumber: 'XXXX-XXXX-4812',
      khasraNumber: '142/2, 143/1',
      landAreaAcres: 18,
      verifiedAt: '2025-01-16T10:00:00Z',
    },
  },
  {
    id: 'user_consumer_1',
    name: 'Pooja Sharma',
    email: 'pooja.sharma@gmail.com',
    role: 'consumer',
    phone: '+91 94250 88219',
    avatar: '/src/assets/images/avatar_consumer_pooja_1793947866234.jpg',
    location: 'Arera Colony, Bhopal, MP',
    coordinates: { lat: 23.2185, lng: 77.4343 },
    createdAt: '2025-02-10T00:00:00Z',
    kycStatus: 'verified',
    kycData: {
      verifiedAt: '2025-02-10T09:30:00Z',
    },
  },
  {
    id: 'user_retailer_1',
    name: 'Rajesh Agrawal',
    email: 'rajesh@greenleafmart.com',
    role: 'retailer',
    phone: '+91 98930 11420',
    avatar: '/src/assets/images/avatar_retailer_rajesh_1793947866819.jpg',
    location: 'MP Nagar Zone II, Bhopal, MP',
    coordinates: { lat: 23.2332, lng: 77.4338 },
    createdAt: '2025-01-20T00:00:00Z',
    kycStatus: 'verified',
    kycData: {
      businessName: 'GreenLeaf Supermart & Wholesale',
      gstin: '23AABCG1234F1Z8',
      fssaiLicense: '11421850000342',
      verifiedAt: '2025-01-22T14:15:00Z',
    },
  },
  {
    id: 'user_delivery_1',
    name: 'Vikram Singh Rajput',
    email: 'vikram.delivery@krishiconnect.in',
    role: 'delivery',
    phone: '+91 97555 43210',
    avatar: '/src/assets/images/avatar_delivery_vikram_1793947867664.jpg',
    location: 'Bhopal Central Hub, MP',
    coordinates: { lat: 23.2599, lng: 77.4126 },
    createdAt: '2025-02-01T00:00:00Z',
    kycStatus: 'verified',
    kycData: {
      drivingLicense: 'MP-04-2021-0089234',
      vehicleRc: 'MP-04-GB-9821',
      vehicleType: 'Tata Ace / Mini Truck',
      verifiedAt: '2025-02-02T11:00:00Z',
    },
  },
  {
    id: 'user_admin_1',
    name: 'Ananya Deshmukh',
    email: 'admin@krishiconnect.in',
    role: 'admin',
    phone: '+91 98270 99887',
    avatar: '/src/assets/images/avatar_admin_ananya_1793947867286.jpg',
    location: 'KrishiConnect HQ, Bhopal',
    coordinates: { lat: 23.2484, lng: 77.4029 },
    createdAt: '2025-01-01T00:00:00Z',
    kycStatus: 'verified',
    kycData: {
      verifiedAt: '2025-01-01T00:00:00Z',
    },
  },
];

interface AuthContextType {
  user: User | null;
  role: Role;
  token: string | null;
  loginAsRole: (role: Role) => void;
  loginWithEmail: (email: string) => boolean;
  loginWithPhone: (phone: string, role: Role) => User;
  updateUserKyc: (kycData: any) => void;
  logout: () => void;
  allDemoUsers: User[];
  isDemoSwitchOpen: boolean;
  setIsDemoSwitchOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'consumer',
  token: null,
  loginAsRole: () => {},
  loginWithEmail: () => false,
  loginWithPhone: () => DEFAULT_USERS[1],
  updateUserKyc: () => {},
  logout: () => {},
  allDemoUsers: DEFAULT_USERS,
  isDemoSwitchOpen: false,
  setIsDemoSwitchOpen: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('krishi_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    // Default to consumer for immediate rich shopping experience on first view
    return DEFAULT_USERS[1];
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('krishi_token') || 'demo_token';
  });

  const [isDemoSwitchOpen, setIsDemoSwitchOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('krishi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('krishi_user');
    }
  }, [user]);

  const loginAsRole = (role: Role) => {
    const found = DEFAULT_USERS.find((u) => u.role === role);
    if (found) {
      setUser(found);
      const t = `jwt_${found.id}_${Date.now()}`;
      setToken(t);
      localStorage.setItem('krishi_token', t);
    }
  };

  const loginWithPhone = (phone: string, role: Role): User => {
    // Check if phone matches any existing default user
    const normalized = phone.replace(/[^0-9]/g, '');
    const found = DEFAULT_USERS.find(
      (u) => u.phone.replace(/[^0-9]/g, '').slice(-10) === normalized.slice(-10) && u.role === role
    ) || DEFAULT_USERS.find((u) => u.role === role);

    const targetUser: User = found || {
      id: `usr_${Date.now()}`,
      name: `${role.charAt(0).toUpperCase() + role.slice(1)} Partner`,
      email: `${role}_${normalized.slice(-4)}@krishiconnect.in`,
      role,
      phone: `+91 ${phone}`,
      location: 'Madhya Pradesh, India',
      createdAt: new Date().toISOString(),
      kycStatus: role === 'consumer' ? 'verified' : 'pending',
    };

    setUser(targetUser);
    const t = `jwt_${targetUser.id}_${Date.now()}`;
    setToken(t);
    localStorage.setItem('krishi_token', t);
    return targetUser;
  };

  const loginWithEmail = (email: string) => {
    const found = DEFAULT_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      const t = `jwt_${found.id}_${Date.now()}`;
      setToken(t);
      localStorage.setItem('krishi_token', t);
      return true;
    }
    // Fallback: create consumer
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'consumer',
      phone: '+91 94250 88219',
      location: 'Bhopal, MP',
      createdAt: new Date().toISOString(),
      kycStatus: 'verified',
    };
    setUser(newUser);
    setToken(`jwt_${newUser.id}`);
    return true;
  };

  const updateUserKyc = (kycData: any) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      kycStatus: 'verified',
      kycData: {
        ...user.kycData,
        ...kycData,
        verifiedAt: new Date().toISOString(),
      },
    };
    setUser(updatedUser);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('krishi_user');
    localStorage.removeItem('krishi_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'consumer',
        token,
        loginAsRole,
        loginWithEmail,
        loginWithPhone,
        updateUserKyc,
        logout,
        allDemoUsers: DEFAULT_USERS,
        isDemoSwitchOpen,
        setIsDemoSwitchOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
