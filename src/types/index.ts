export type Role = 'farmer' | 'consumer' | 'retailer' | 'delivery' | 'admin';

export type KycStatus = 'verified' | 'pending' | 'unverified';

export interface KycData {
  aadhaarNumber?: string;
  khasraNumber?: string;
  landAreaAcres?: number;
  gstin?: string;
  fssaiLicense?: string;
  businessName?: string;
  drivingLicense?: string;
  vehicleRc?: string;
  vehicleType?: 'Two-Wheeler' | 'Three-Wheeler / Auto' | 'Tata Ace / Mini Truck';
  verifiedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  avatar?: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  createdAt: string;
  kycStatus?: KycStatus;
  kycData?: KycData;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  farmName: string;
  farmerName: string;
  location: string;
  state: string;
  district: string;
  coordinates: { lat: number; lng: number };
  totalAcres: number;
  farmingType: 'Organic' | 'Conventional' | 'Natural/ZBNF';
  isVerified: boolean;
  rating: number;
  totalRatingsCount: number;
  experienceYears: number;
  phone: string;
  avatar: string;
  bio: string;
  specialties: string[];
  bankAccountLinked: boolean;
  upiId?: string;
}

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Dairy'
  | 'Organic Produce';

export type ProductUnit = 'kg' | 'quintal' | 'piece' | 'litre' | 'crate (25kg)';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  location: string;
  district: string;
  name: string;
  category: ProductCategory;
  description: string;
  pricePerUnit: number;
  unit: ProductUnit;
  availableQuantity: number;
  harvestDate: string;
  isOrganic: boolean;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  minOrderQuantity: number;
  shelfLifeDays: number;
  status: 'In Stock' | 'Low Stock' | 'Harvesting Soon' | 'Sold Out';
  wholesaleDiscountPercent?: number;
  wholesaleMinQuantity?: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Accepted'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  quantity: number;
  unit: ProductUnit;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerRole: 'consumer' | 'retailer';
  items: OrderItem[];
  farmerIds: string[];
  deliveryAddress: {
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  pricingBreakdown: {
    itemsSubtotal: number;
    platformFee: number;
    deliveryCharge: number;
    tax: number;
    totalAmount: number;
    farmerEarningsTotal: number;
  };
  paymentMethod: 'COD' | 'Razorpay' | 'UPI';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentId?: string;
  status: OrderStatus;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  estimatedDeliveryTime?: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface BulkPurchaseRequest {
  id: string;
  retailerId: string;
  retailerName: string;
  businessName: string;
  businessType: 'Restaurant' | 'Supermarket' | 'Vendor' | 'Caterer';
  productName: string;
  category: ProductCategory;
  requiredQuantity: number;
  unit: ProductUnit;
  targetPricePerUnit: number;
  requiredByDate: string;
  destinationCity: string;
  status: 'Open' | 'Bids Received' | 'Accepted' | 'Completed';
  matchedFarmersCount: number;
  bids?: {
    farmerId: string;
    farmerName: string;
    offeredPrice: number;
    deliveryAvailable: boolean;
    note: string;
  }[];
  createdAt: string;
}

export type ReviewCategory = 'crop' | 'platform_service' | 'delivery' | 'retail';

export interface Review {
  id: string;
  category: ReviewCategory;
  orderId?: string;
  productId?: string;
  productName?: string;
  farmerId?: string;
  farmerName?: string;
  userId: string;
  userName: string;
  userRole: Role;
  userLocation?: string;
  rating: number;
  subRatings?: {
    freshnessOrQuality?: number;
    deliveryOrTimeliness?: number;
    valueOrFairPrice?: number;
    serviceOrHandling?: number;
  };
  title: string;
  comment: string;
  tags?: string[];
  verifiedPurchase?: boolean;
  date: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedByUserId: string;
  raisedByName: string;
  raisedByRole: Role;
  reason: string;
  details: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Rejected';
  resolutionNotes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'ai_insight' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
