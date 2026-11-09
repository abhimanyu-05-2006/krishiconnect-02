import {
  User,
  FarmerProfile,
  Product,
  Order,
  BulkPurchaseRequest,
  Review,
  Dispute,
  NotificationItem
} from '../src/types/index.js';

export const USERS: User[] = [
  {
    id: 'user_farmer_1',
    name: 'Rameshwar Patidar',
    email: 'rameshwar@krishiconnect.in',
    role: 'farmer',
    phone: '+91 98261 45890',
    avatar: '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg',
    location: 'Village Ashta, Sehore, Madhya Pradesh',
    coordinates: { lat: 23.0184, lng: 76.7212 },
    createdAt: '2025-01-15T00:00:00Z',
    kycStatus: 'verified',
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
  },
  {
    id: 'user_delivery_1',
    name: 'Vikram Singh Rajput',
    email: 'vikram.delivery@krishiconnect.in',
    role: 'delivery',
    phone: '+91 97555 43210',
    avatar: '/src/assets/images/avatar_delivery_vikram_1793947867664.jpg',
    location: 'Bhopal Central AgriFleet Hub, MP',
    coordinates: { lat: 23.2599, lng: 77.4126 },
    createdAt: '2025-02-01T00:00:00Z',
    kycStatus: 'verified',
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
  },
];

export const FARMER_PROFILES: FarmerProfile[] = [
  {
    id: 'fp_1',
    userId: 'user_farmer_1',
    farmerName: 'Rameshwar Patidar',
    farmName: 'Narmada Organic Farms',
    location: 'Village Ashta, Sehore',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    coordinates: { lat: 23.0184, lng: 76.7212 },
    totalAcres: 18,
    farmingType: 'Organic',
    isVerified: true,
    rating: 4.9,
    totalRatingsCount: 142,
    experienceYears: 24,
    phone: '+91 98261 45890',
    avatar: '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg',
    bio: 'Pioneer organic farmer certified under NPOP. Using Jeevamrit & traditional soil revitalisation for zero-pesticide tomatoes, onions, and Sharbati wheat.',
    specialties: ['Organic Tomatoes', 'Sharbati Wheat', 'Red Onions'],
    bankAccountLinked: true,
    upiId: 'rameshwar@upi',
  },
  {
    id: 'fp_2',
    userId: 'user_farmer_2',
    farmerName: 'Suresh Meena',
    farmName: 'Betwa Agro Greens',
    location: 'Sanchi Road, Vidisha',
    state: 'Madhya Pradesh',
    district: 'Vidisha',
    coordinates: { lat: 23.5251, lng: 77.8081 },
    totalAcres: 12,
    farmingType: 'Natural/ZBNF',
    isVerified: true,
    rating: 4.8,
    totalRatingsCount: 98,
    experienceYears: 16,
    phone: '+91 98263 77412',
    avatar: '/src/assets/images/avatar_indian_farmer_man_1793948006710.jpg',
    bio: 'Dedicated to Zero Budget Natural Farming (ZBNF). Specialising in seasonal green peas, cauliflower, and desi chana.',
    specialties: ['Green Peas', 'Cauliflower', 'Desi Chana'],
    bankAccountLinked: true,
    upiId: 'sureshmeena@oksbi',
  },
  {
    id: 'fp_3',
    userId: 'user_farmer_3',
    farmerName: 'Bhagwandas Lodhi',
    farmName: 'Vindhyachal Pure Produce',
    location: 'Goharganj, Raisen',
    state: 'Madhya Pradesh',
    district: 'Raisen',
    coordinates: { lat: 23.0526, lng: 77.6521 },
    totalAcres: 25,
    farmingType: 'Conventional',
    isVerified: true,
    rating: 4.7,
    totalRatingsCount: 86,
    experienceYears: 28,
    phone: '+91 94251 33698',
    avatar: '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg',
    bio: 'Large-scale producer of high-grade potatoes, onions, and soybean with integrated pest management (IPM) to minimize chemical residue.',
    specialties: ['Chipsona Potatoes', 'Soybean', 'Garlic'],
    bankAccountLinked: true,
    upiId: 'bhagwandas@icici',
  },
  {
    id: 'fp_4',
    userId: 'user_farmer_4',
    farmerName: 'Kavita Dhurve',
    farmName: 'Satpura Herbal & Spices',
    location: 'Hoshangabad (Narmadapuram)',
    state: 'Madhya Pradesh',
    district: 'Hoshangabad',
    coordinates: { lat: 22.7519, lng: 77.7289 },
    totalAcres: 8,
    farmingType: 'Organic',
    isVerified: true,
    rating: 4.95,
    totalRatingsCount: 110,
    experienceYears: 12,
    phone: '+91 97521 88442',
    avatar: '/src/assets/images/avatar_indian_farmer_woman_1793947990792.jpg',
    bio: 'Women-led organic collective producing high-curcumin Lakadong & indigenous turmeric, fresh ginger, and coriander.',
    specialties: ['Organic Turmeric', 'Ginger', 'Coriander'],
    bankAccountLinked: true,
    upiId: 'kavitadhurve@paytm',
  },
  {
    id: 'fp_5',
    userId: 'user_farmer_5',
    farmerName: 'Mohanlal Verma',
    farmName: 'Berasia Golden Orchards',
    location: 'Berasia, Bhopal Rural',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    coordinates: { lat: 23.6334, lng: 77.4339 },
    totalAcres: 15,
    farmingType: 'Organic',
    isVerified: true,
    rating: 4.85,
    totalRatingsCount: 74,
    experienceYears: 20,
    phone: '+91 98266 55198',
    avatar: '/src/assets/images/avatar_indian_farmer_man_1793948006710.jpg',
    bio: 'Award-winning fruit grower supplying naturally ripened Kesar mangoes, sweet papayas, and guava without carbide.',
    specialties: ['Kesar Mango', 'Guava', 'Papaya'],
    bankAccountLinked: true,
    upiId: 'mohanverma@upi',
  },
  {
    id: 'fp_6',
    userId: 'user_farmer_6',
    farmerName: 'Devendra Patel',
    farmName: 'Patel Dairy & Fodder Farm',
    location: 'Phanda Kalan, Sehore',
    state: 'Madhya Pradesh',
    district: 'Sehore',
    coordinates: { lat: 23.1812, lng: 77.2185 },
    totalAcres: 10,
    farmingType: 'Organic',
    isVerified: true,
    rating: 4.9,
    totalRatingsCount: 165,
    experienceYears: 18,
    phone: '+91 94254 11200',
    avatar: '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg',
    bio: 'A2 Gir cow milk, bilona ghee, and fresh organic paneer delivered straight from clean pastoral pens within 4 hours of milking.',
    specialties: ['A2 Gir Cow Milk', 'Vedic Bilona Ghee', 'Fresh Paneer'],
    bankAccountLinked: true,
    upiId: 'pateldairy@barodamp',
  },
  {
    id: 'fp_7',
    userId: 'user_farmer_7',
    farmerName: 'Gajraj Kushwaha',
    farmName: 'Green Valley Vegetables',
    location: 'Kolar Road, Bhopal Outskirts',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    coordinates: { lat: 23.1672, lng: 77.4194 },
    totalAcres: 6,
    farmingType: 'Conventional',
    isVerified: false,
    rating: 4.6,
    totalRatingsCount: 42,
    experienceYears: 9,
    phone: '+91 98271 22345',
    avatar: '/src/assets/images/avatar_indian_farmer_man_1793948006710.jpg',
    bio: 'Fast-cycle seasonal greens grower. Harvests early morning at 4 AM for immediate dispatch to Bhopal markets.',
    specialties: ['Palak Spinach', 'Methi', 'Bottle Gourd'],
    bankAccountLinked: false,
    upiId: 'gajraj@upi',
  },
  {
    id: 'fp_8',
    userId: 'user_farmer_8',
    farmerName: 'Dinesh Yadav',
    farmName: 'Yadav Pulse & Grain Farm',
    location: 'Bareli, Raisen',
    state: 'Madhya Pradesh',
    district: 'Raisen',
    coordinates: { lat: 22.8687, lng: 78.2325 },
    totalAcres: 30,
    farmingType: 'Organic',
    isVerified: true,
    rating: 4.75,
    totalRatingsCount: 58,
    experienceYears: 22,
    phone: '+91 94258 77651',
    avatar: '/src/assets/images/farmer_portrait_mentor_1793946353253.jpg',
    bio: 'Unpolished protein-rich pulses: Arhar (Tur), Moong, and Urad dal, naturally sun-dried and stone milled.',
    specialties: ['Unpolished Toor Dal', 'Yellow Moong', 'Kabuli Chana'],
    bankAccountLinked: true,
    upiId: 'dineshyadav@sbi',
  },
  {
    id: 'fp_9',
    userId: 'user_farmer_9',
    farmerName: 'Laxminarayan Solanki',
    farmName: 'Malwa Spice Agro',
    location: 'Sonkatch, Dewas Border',
    state: 'Madhya Pradesh',
    district: 'Dewas',
    coordinates: { lat: 22.9774, lng: 76.3688 },
    totalAcres: 14,
    farmingType: 'Natural/ZBNF',
    isVerified: true,
    rating: 4.88,
    totalRatingsCount: 92,
    experienceYears: 26,
    phone: '+91 98260 99123',
    avatar: '/src/assets/images/avatar_indian_farmer_man_1793948006710.jpg',
    bio: 'Traditional garlic and red chilli cultivator. Grown with zero synthetic fertilizers, renowned for pungent aroma and high oil content.',
    specialties: ['Desi Garlic', 'Teja Red Chilli', 'Mustard Seeds'],
    bankAccountLinked: true,
    upiId: 'laxmiagro@hdfc',
  },
  {
    id: 'fp_10',
    userId: 'user_farmer_10',
    farmerName: 'Sunita Bai',
    farmName: 'Panchavati Natural Farm',
    location: 'Kurwai, Vidisha',
    state: 'Madhya Pradesh',
    district: 'Vidisha',
    coordinates: { lat: 24.0487, lng: 78.0583 },
    totalAcres: 9,
    farmingType: 'Organic',
    isVerified: true,
    rating: 4.92,
    totalRatingsCount: 88,
    experienceYears: 14,
    phone: '+91 97531 33445',
    avatar: '/src/assets/images/avatar_indian_farmer_woman_1793947990792.jpg',
    bio: 'Certified organic vegetables using biodynamic compost and vermicompost. Supplying fresh capsicum, broccoli, and cluster beans.',
    specialties: ['Green Capsicum', 'Organic Broccoli', 'Guar Beans'],
    bankAccountLinked: true,
    upiId: 'sunitabai@airtel',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    farmerId: 'fp_1',
    farmerName: 'Rameshwar Patidar',
    farmName: 'Narmada Organic Farms',
    location: 'Village Ashta, Sehore',
    district: 'Sehore',
    name: 'Vine-Ripened Organic Desi Tomato',
    category: 'Vegetables',
    description: 'Freshly harvested desi red tomatoes with high lycopene, rich natural tang, and firm skin. Grown without synthetic sprays.',
    pricePerUnit: 28,
    unit: 'kg',
    availableQuantity: 450,
    harvestDate: '2026-11-05',
    isOrganic: true,
    imageUrl: '/src/assets/images/ripe_desi_tomatoes_1794193349094.jpg',
    rating: 4.9,
    reviewsCount: 38,
    minOrderQuantity: 1,
    shelfLifeDays: 7,
    status: 'In Stock',
    wholesaleDiscountPercent: 15,
    wholesaleMinQuantity: 50,
  },
  {
    id: 'prod_2',
    farmerId: 'fp_1',
    farmerName: 'Rameshwar Patidar',
    farmName: 'Narmada Organic Farms',
    location: 'Village Ashta, Sehore',
    district: 'Sehore',
    name: 'Premium Sharbati Gehun (Sehore Wheat)',
    category: 'Grains',
    description: 'World-renowned Sehore Sharbati wheat, famous for golden hue, soft roti texture, and sweet taste. Naturally sun-dried.',
    pricePerUnit: 42,
    unit: 'kg',
    availableQuantity: 3200,
    harvestDate: '2026-10-28',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewsCount: 64,
    minOrderQuantity: 5,
    shelfLifeDays: 365,
    status: 'In Stock',
    wholesaleDiscountPercent: 12,
    wholesaleMinQuantity: 200,
  },
  {
    id: 'prod_3',
    farmerId: 'fp_1',
    farmerName: 'Rameshwar Patidar',
    farmName: 'Narmada Organic Farms',
    location: 'Village Ashta, Sehore',
    district: 'Sehore',
    name: 'Nasik Red Sweet Onion',
    category: 'Vegetables',
    description: 'Crisp, spicy-sweet red onions. Cured naturally in farm sheds for prolonged shelf stability without sprout suppressants.',
    pricePerUnit: 32,
    unit: 'kg',
    availableQuantity: 1200,
    harvestDate: '2026-11-03',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    reviewsCount: 29,
    minOrderQuantity: 2,
    shelfLifeDays: 30,
    status: 'In Stock',
    wholesaleDiscountPercent: 18,
    wholesaleMinQuantity: 100,
  },
  {
    id: 'prod_4',
    farmerId: 'fp_2',
    farmerName: 'Suresh Meena',
    farmName: 'Betwa Agro Greens',
    location: 'Sanchi Road, Vidisha',
    district: 'Vidisha',
    name: 'Tender Sweet Green Peas (Matar)',
    category: 'Vegetables',
    description: 'Morning plucked sweet green peas, pods bursting with tender sugary pearls. Perfect for curries, poha, and freezing.',
    pricePerUnit: 45,
    unit: 'kg',
    availableQuantity: 380,
    harvestDate: '2026-11-05',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 42,
    minOrderQuantity: 1,
    shelfLifeDays: 5,
    status: 'In Stock',
    wholesaleDiscountPercent: 10,
    wholesaleMinQuantity: 40,
  },
  {
    id: 'prod_5',
    farmerId: 'fp_2',
    farmerName: 'Suresh Meena',
    farmName: 'Betwa Agro Greens',
    location: 'Sanchi Road, Vidisha',
    district: 'Vidisha',
    name: 'Snow White Cauliflower (Gobhi)',
    category: 'Vegetables',
    description: 'Tightly packed, crisp organic cauliflower head shielded from direct sun to maintain pure creamy white color.',
    pricePerUnit: 25,
    unit: 'piece',
    availableQuantity: 150,
    harvestDate: '2026-11-04',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 19,
    minOrderQuantity: 1,
    shelfLifeDays: 6,
    status: 'In Stock',
  },
  {
    id: 'prod_6',
    farmerId: 'fp_3',
    farmerName: 'Bhagwandas Lodhi',
    farmName: 'Vindhyachal Pure Produce',
    location: 'Goharganj, Raisen',
    district: 'Raisen',
    name: 'Freshly Dug Chipsona Potatoes (Aloo)',
    category: 'Vegetables',
    description: 'Low-sugar, high-starch fresh potatoes. Non-cold-storage, direct from harvest. Does not turn sweet when cooked.',
    pricePerUnit: 22,
    unit: 'kg',
    availableQuantity: 2800,
    harvestDate: '2026-11-02',
    isOrganic: false,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    reviewsCount: 31,
    minOrderQuantity: 3,
    shelfLifeDays: 45,
    status: 'In Stock',
    wholesaleDiscountPercent: 20,
    wholesaleMinQuantity: 150,
  },
  {
    id: 'prod_7',
    farmerId: 'fp_4',
    farmerName: 'Kavita Dhurve',
    farmName: 'Satpura Herbal & Spices',
    location: 'Hoshangabad',
    district: 'Hoshangabad',
    name: 'Raw High-Curcumin Organic Turmeric',
    category: 'Spices',
    description: 'Fresh aromatic turmeric rhizomes testing >6.5% natural curcumin. Ground stone powders or raw use for golden milk.',
    pricePerUnit: 180,
    unit: 'kg',
    availableQuantity: 220,
    harvestDate: '2026-10-25',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewsCount: 52,
    minOrderQuantity: 1,
    shelfLifeDays: 180,
    status: 'In Stock',
  },
  {
    id: 'prod_8',
    farmerId: 'fp_4',
    farmerName: 'Kavita Dhurve',
    farmName: 'Satpura Herbal & Spices',
    location: 'Hoshangabad',
    district: 'Hoshangabad',
    name: 'Fiery Fresh Hill Ginger (Adrak)',
    category: 'Spices',
    description: 'Fibrous, punchy fresh ginger harvested from moist Satpura foothills. Powerful digestive and immune booster.',
    pricePerUnit: 90,
    unit: 'kg',
    availableQuantity: 180,
    harvestDate: '2026-11-04',
    isOrganic: true,
    imageUrl: '/src/assets/images/fresh_hill_ginger_1794193347212.jpg',
    rating: 4.9,
    reviewsCount: 27,
    minOrderQuantity: 1,
    shelfLifeDays: 20,
    status: 'In Stock',
  },
  {
    id: 'prod_9',
    farmerId: 'fp_5',
    farmerName: 'Mohanlal Verma',
    farmName: 'Berasia Golden Orchards',
    location: 'Berasia, Bhopal Rural',
    district: 'Bhopal',
    name: 'Tree-Ripened Allahabad Safeda Guava',
    category: 'Fruits',
    description: 'Sweet, fragrant white-flesh guavas with smooth skin and edible soft seeds. Harvested same-day of delivery.',
    pricePerUnit: 60,
    unit: 'kg',
    availableQuantity: 240,
    harvestDate: '2026-11-05',
    isOrganic: true,
    imageUrl: '/src/assets/images/fresh_safeda_guava_1794193348241.jpg',
    rating: 4.8,
    reviewsCount: 22,
    minOrderQuantity: 1,
    shelfLifeDays: 4,
    status: 'In Stock',
  },
  {
    id: 'prod_10',
    farmerId: 'fp_6',
    farmerName: 'Devendra Patel',
    farmName: 'Patel Dairy & Fodder Farm',
    location: 'Phanda Kalan, Sehore',
    district: 'Sehore',
    name: 'Pure A2 Gir Cow Raw Milk (Chilled)',
    category: 'Dairy',
    description: 'Single-source raw whole A2 milk from pasture-fed indigenous Gir cows. Tested zero antibiotics, hormones, or adulterants.',
    pricePerUnit: 75,
    unit: 'litre',
    availableQuantity: 120,
    harvestDate: '2026-11-05',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    reviewsCount: 94,
    minOrderQuantity: 1,
    shelfLifeDays: 2,
    status: 'In Stock',
  },
  {
    id: 'prod_11',
    farmerId: 'fp_6',
    farmerName: 'Devendra Patel',
    farmName: 'Patel Dairy & Fodder Farm',
    location: 'Phanda Kalan, Sehore',
    district: 'Sehore',
    name: 'Handcrafted Malai Paneer',
    category: 'Dairy',
    description: 'Melt-in-mouth artisanal cottage cheese made from fresh whole cow milk curdled with lemon juice. No preservatives.',
    pricePerUnit: 360,
    unit: 'kg',
    availableQuantity: 45,
    harvestDate: '2026-11-05',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    reviewsCount: 67,
    minOrderQuantity: 1,
    shelfLifeDays: 4,
    status: 'In Stock',
  },
  {
    id: 'prod_12',
    farmerId: 'fp_7',
    farmerName: 'Gajraj Kushwaha',
    farmName: 'Green Valley Vegetables',
    location: 'Kolar Road, Bhopal',
    district: 'Bhopal',
    name: 'Crisp Hydro-Washed Palak Spinach',
    category: 'Organic Produce',
    description: 'Dark green leafy spinach leaves rinsed in clean borewell water and bundled. Packed with natural dietary iron and vitamins.',
    pricePerUnit: 30,
    unit: 'kg',
    availableQuantity: 90,
    harvestDate: '2026-11-05',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    reviewsCount: 15,
    minOrderQuantity: 1,
    shelfLifeDays: 3,
    status: 'In Stock',
  },
  {
    id: 'prod_13',
    farmerId: 'fp_8',
    farmerName: 'Dinesh Yadav',
    farmName: 'Yadav Pulse & Grain Farm',
    location: 'Bareli, Raisen',
    district: 'Raisen',
    name: 'Desi Unpolished Toor Dal (Arhar)',
    category: 'Pulses',
    description: 'Sun-ripened, naturally dehusked without water or oil polishing. Cooks quickly into creamy, fragrant traditional dal.',
    pricePerUnit: 145,
    unit: 'kg',
    availableQuantity: 800,
    harvestDate: '2026-10-15',
    isOrganic: true,
    imageUrl: '/src/assets/images/unpolished_toor_dal_1794193348720.jpg',
    rating: 4.85,
    reviewsCount: 36,
    minOrderQuantity: 1,
    shelfLifeDays: 365,
    status: 'In Stock',
  },
  {
    id: 'prod_14',
    farmerId: 'fp_9',
    farmerName: 'Laxminarayan Solanki',
    farmName: 'Malwa Spice Agro',
    location: 'Sonkatch, Dewas',
    district: 'Dewas',
    name: 'Pungent Desi Garlic (Lahsun)',
    category: 'Spices',
    description: 'Small bulb Malwa desi garlic with purple stripes. High allicin concentration, intensely pungent aroma, long-lasting storage.',
    pricePerUnit: 160,
    unit: 'kg',
    availableQuantity: 340,
    harvestDate: '2026-10-20',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    reviewsCount: 44,
    minOrderQuantity: 1,
    shelfLifeDays: 90,
    status: 'In Stock',
  },
  {
    id: 'prod_15',
    farmerId: 'fp_10',
    farmerName: 'Sunita Bai',
    farmName: 'Panchavati Natural Farm',
    location: 'Kurwai, Vidisha',
    district: 'Vidisha',
    name: 'Crunchy Green Bell Pepper (Capsicum)',
    category: 'Vegetables',
    description: 'Thick-walled, crisp green capsicums grown in polyhouse with organic compost. High juiciness and sweet crunch.',
    pricePerUnit: 55,
    unit: 'kg',
    availableQuantity: 160,
    harvestDate: '2026-11-04',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80',
    rating: 4.75,
    reviewsCount: 18,
    minOrderQuantity: 1,
    shelfLifeDays: 8,
    status: 'In Stock',
  },
];

export const ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'KC-2026-8812',
    buyerId: 'user_consumer_1',
    buyerName: 'Pooja Sharma',
    buyerPhone: '+91 94250 88219',
    buyerRole: 'consumer',
    items: [
      {
        productId: 'prod_1',
        productName: 'Vine-Ripened Organic Desi Tomato',
        farmerId: 'fp_1',
        farmerName: 'Rameshwar Patidar',
        quantity: 3,
        unit: 'kg',
        unitPrice: 28,
        totalPrice: 84,
        imageUrl: '/src/assets/images/ripe_desi_tomatoes_1794193349094.jpg',
      },
      {
        productId: 'prod_4',
        productName: 'Tender Sweet Green Peas (Matar)',
        farmerId: 'fp_2',
        farmerName: 'Suresh Meena',
        quantity: 2,
        unit: 'kg',
        unitPrice: 45,
        totalPrice: 90,
        imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80',
      },
      {
        productId: 'prod_10',
        productName: 'Pure A2 Gir Cow Raw Milk (Chilled)',
        farmerId: 'fp_6',
        farmerName: 'Devendra Patel',
        quantity: 2,
        unit: 'litre',
        unitPrice: 75,
        totalPrice: 150,
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
      },
    ],
    farmerIds: ['fp_1', 'fp_2', 'fp_6'],
    deliveryAddress: {
      street: 'Flat 402, Narmada Residency, E-3 Arera Colony',
      city: 'Bhopal',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462016',
      landmark: 'Near Habibganj / Rani Kamlapati Station',
    },
    pricingBreakdown: {
      itemsSubtotal: 324,
      platformFee: 15,
      deliveryCharge: 35,
      tax: 0,
      totalAmount: 374,
      farmerEarningsTotal: 324,
    },
    paymentMethod: 'Razorpay',
    paymentStatus: 'Paid',
    paymentId: 'pay_DEMO_998124',
    status: 'Out for Delivery',
    deliveryPartnerId: 'user_delivery_1',
    deliveryPartnerName: 'Vikram Singh Rajput',
    deliveryPartnerPhone: '+91 97555 43210',
    estimatedDeliveryTime: 'Today by 11:30 AM',
    timeline: [
      { status: 'Confirmed', timestamp: '2026-11-05 06:15 AM', description: 'Order confirmed and routed to local farmer hubs' },
      { status: 'Accepted', timestamp: '2026-11-05 06:45 AM', description: 'Farmers accepted order for harvest preparation' },
      { status: 'Preparing', timestamp: '2026-11-05 07:30 AM', description: 'Crates packed and quality verified at farm gates' },
      { status: 'Picked Up', timestamp: '2026-11-05 08:45 AM', description: 'Picked up by AgriFleet refrigerated dispatch van' },
      { status: 'Out for Delivery', timestamp: '2026-11-05 09:30 AM', description: 'Out for direct delivery to Arera Colony' },
    ],
    createdAt: '2026-11-05T06:15:00Z',
    updatedAt: '2026-11-05T09:30:00Z',
  },
  {
    id: 'ord_102',
    orderNumber: 'KC-2026-8790',
    buyerId: 'user_retailer_1',
    buyerName: 'Rajesh Agrawal (GreenLeaf Supermart)',
    buyerPhone: '+91 98930 11420',
    buyerRole: 'retailer',
    items: [
      {
        productId: 'prod_1',
        productName: 'Vine-Ripened Organic Desi Tomato',
        farmerId: 'fp_1',
        farmerName: 'Rameshwar Patidar',
        quantity: 120,
        unit: 'kg',
        unitPrice: 24, // wholesale discounted
        totalPrice: 2880,
        imageUrl: '/src/assets/images/ripe_desi_tomatoes_1794193349094.jpg',
      },
      {
        productId: 'prod_3',
        productName: 'Nasik Red Sweet Onion',
        farmerId: 'fp_1',
        farmerName: 'Rameshwar Patidar',
        quantity: 150,
        unit: 'kg',
        unitPrice: 26,
        totalPrice: 3900,
        imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80',
      },
    ],
    farmerIds: ['fp_1'],
    deliveryAddress: {
      street: 'Warehouse 12, Transport Nagar, Kokta',
      city: 'Bhopal',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462022',
      landmark: 'Opposite Mandi Gate',
    },
    pricingBreakdown: {
      itemsSubtotal: 6780,
      platformFee: 150,
      deliveryCharge: 250,
      tax: 0,
      totalAmount: 7180,
      farmerEarningsTotal: 6780,
    },
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    paymentId: 'upi_TXN_881239',
    status: 'Ready for Pickup',
    deliveryPartnerId: 'user_delivery_1',
    deliveryPartnerName: 'Vikram Singh Rajput',
    deliveryPartnerPhone: '+91 97555 43210',
    estimatedDeliveryTime: 'Today by 02:00 PM',
    timeline: [
      { status: 'Confirmed', timestamp: '2026-11-04 05:00 PM', description: 'Bulk order confirmed by GreenLeaf Supermart' },
      { status: 'Accepted', timestamp: '2026-11-04 06:10 PM', description: 'Farmer Rameshwar Patidar confirmed crate allotment' },
      { status: 'Preparing', timestamp: '2026-11-05 06:00 AM', description: 'Produce graded, weighed and palletized' },
      { status: 'Ready for Pickup', timestamp: '2026-11-05 08:00 AM', description: 'Staged at farm pickup dock in Ashta, Sehore' },
    ],
    createdAt: '2026-11-04T17:00:00Z',
    updatedAt: '2026-11-05T08:00:00Z',
  },
  {
    id: 'ord_103',
    orderNumber: 'KC-2026-8755',
    buyerId: 'user_consumer_1',
    buyerName: 'Pooja Sharma',
    buyerPhone: '+91 94250 88219',
    buyerRole: 'consumer',
    items: [
      {
        productId: 'prod_2',
        productName: 'Premium Sharbati Gehun (Sehore Wheat)',
        farmerId: 'fp_1',
        farmerName: 'Rameshwar Patidar',
        quantity: 25,
        unit: 'kg',
        unitPrice: 42,
        totalPrice: 1050,
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
      },
    ],
    farmerIds: ['fp_1'],
    deliveryAddress: {
      street: 'Flat 402, Narmada Residency, E-3 Arera Colony',
      city: 'Bhopal',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462016',
      landmark: 'Near Habibganj Station',
    },
    pricingBreakdown: {
      itemsSubtotal: 1050,
      platformFee: 20,
      deliveryCharge: 50,
      tax: 0,
      totalAmount: 1120,
      farmerEarningsTotal: 1050,
    },
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    status: 'Delivered',
    deliveryPartnerId: 'user_delivery_1',
    deliveryPartnerName: 'Vikram Singh Rajput',
    deliveryPartnerPhone: '+91 97555 43210',
    timeline: [
      { status: 'Confirmed', timestamp: '2026-11-01 10:00 AM', description: 'Order confirmed' },
      { status: 'Accepted', timestamp: '2026-11-01 11:30 AM', description: 'Farmer accepted order' },
      { status: 'Preparing', timestamp: '2026-11-01 03:00 PM', description: '25kg bag packed & sealed' },
      { status: 'Picked Up', timestamp: '2026-11-02 09:00 AM', description: 'Dispatched from Ashta' },
      { status: 'Out for Delivery', timestamp: '2026-11-02 01:15 PM', description: 'Out for delivery' },
      { status: 'Delivered', timestamp: '2026-11-02 03:45 PM', description: 'Delivered safely with OTP verification' },
    ],
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-02T15:45:00Z',
  },
];

export const BULK_REQUESTS: BulkPurchaseRequest[] = [
  {
    id: 'bulk_1',
    retailerId: 'user_retailer_1',
    retailerName: 'Rajesh Agrawal',
    businessName: 'GreenLeaf Supermart & Fresh Hub',
    businessType: 'Supermarket',
    productName: 'Organic Red Tomatoes',
    category: 'Vegetables',
    requiredQuantity: 10,
    unit: 'quintal',
    targetPricePerUnit: 2200,
    requiredByDate: '2026-11-10',
    destinationCity: 'Bhopal (MP Nagar)',
    status: 'Bids Received',
    matchedFarmersCount: 3,
    bids: [
      {
        farmerId: 'fp_1',
        farmerName: 'Rameshwar Patidar (Sehore)',
        offeredPrice: 2250,
        deliveryAvailable: true,
        note: 'Can supply grade A vine-ripened tomatoes in 25kg returnable plastic crates directly from Ashta.',
      },
      {
        farmerId: 'fp_10',
        farmerName: 'Sunita Bai (Vidisha)',
        offeredPrice: 2300,
        deliveryAvailable: false,
        note: 'Available for farm-gate loading at Kurwai.',
      },
    ],
    createdAt: '2026-11-03T11:00:00Z',
  },
  {
    id: 'bulk_2',
    retailerId: 'user_retailer_2',
    retailerName: 'Chef Sanjeev Anand',
    businessName: 'Jehan Numa Palace Kitchens',
    businessType: 'Restaurant',
    productName: 'Sharbati Wheat (Milled Flour/Grain)',
    category: 'Grains',
    requiredQuantity: 25,
    unit: 'quintal',
    targetPricePerUnit: 3900,
    requiredByDate: '2026-11-15',
    destinationCity: 'Bhopal (Shamla Hills)',
    status: 'Open',
    matchedFarmersCount: 4,
    createdAt: '2026-11-04T14:30:00Z',
  },
];

export const REVIEWS: Review[] = [
  // 1. Customer Crop Reviews
  {
    id: 'rev_crop_1',
    category: 'crop',
    orderId: 'ord_101',
    productId: 'prod_1',
    productName: 'Vine-Ripened Organic Desi Tomato',
    farmerId: 'farmer_1',
    farmerName: 'Rameshwar Patidar',
    userId: 'user_consumer_2',
    userName: 'Dr. Vivek Saxena',
    userRole: 'consumer',
    userLocation: 'Arera Colony, Bhopal',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Authentic desi sweetness and morning dew freshness!',
    comment: 'Real tomato aroma that supermarket tomatoes have completely lost. Juicy, firm, and delivered within 18 hours of plucking from Sehore. The salad had an unbelievable natural tang.',
    tags: ['Dew Fresh', 'Naturally Sweet', 'Zero Wax', '100% Organic'],
    verifiedPurchase: true,
    date: '2026-11-04',
  },
  {
    id: 'rev_crop_2',
    category: 'crop',
    orderId: 'ord_103',
    productId: 'prod_2',
    productName: 'Premium Sharbati Gehun (Sehore Wheat)',
    farmerId: 'farmer_1',
    farmerName: 'Rameshwar Patidar',
    userId: 'user_consumer_1',
    userName: 'Pooja Sharma',
    userRole: 'consumer',
    userLocation: 'Gulmohar, Bhopal',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Extraordinary soft rotis, cleanest grain ever bought',
    comment: 'The rotis are extraordinarily soft, golden, and naturally sweet! Knowing it came straight from Rameshwar ji’s field in Sehore gives total peace of mind. Excellent price transparency.',
    tags: ['Golden Grain', 'Softest Rotis', 'Direct Farm-Gate', 'Super Clean'],
    verifiedPurchase: true,
    date: '2026-11-03',
  },
  {
    id: 'rev_crop_3',
    category: 'crop',
    orderId: 'ord_99',
    productId: 'prod_10',
    productName: 'Pure A2 Gir Cow Raw Milk',
    farmerId: 'farmer_3',
    farmerName: 'Mohanlal Dangi',
    userId: 'user_consumer_3',
    userName: 'Meenakshi Iyer',
    userRole: 'consumer',
    userLocation: 'Shahpura, Bhopal',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Rich natural malai layer, zero adulteration',
    comment: 'The thick natural cream layer (malai) on this milk is undeniable proof of purity. My kids love the natural sweetness. Great initiative to connect farmers directly with city families.',
    tags: ['A2 Purity', 'Thick Malai', 'Grass-Fed Cows', 'Chilled Transit'],
    verifiedPurchase: true,
    date: '2026-11-02',
  },
  {
    id: 'rev_crop_4',
    category: 'crop',
    orderId: 'ord_95',
    productId: 'prod_4',
    productName: 'Tender Sweet Green Peas (Matar)',
    farmerId: 'farmer_2',
    farmerName: 'Kamla Bai Mewada',
    userId: 'user_consumer_4',
    userName: 'Alok Saxena',
    userRole: 'consumer',
    userLocation: 'Kolar Road, Bhopal',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 4,
      serviceOrHandling: 5,
    },
    title: 'Crisp green pods, harvested at dawn',
    comment: 'Pods were crisp, sweet, and bursting with tender green peas. No chemical water sprinkling or dye. Delivered fresh in ventilated agri-crates.',
    tags: ['Tender & Sweet', 'Dawn Harvested', 'Eco-Packaging'],
    verifiedPurchase: true,
    date: '2026-10-31',
  },

  // 2. Farmer Service Reviews (Platform Services, Payouts, Transparency)
  {
    id: 'rev_srv_1',
    category: 'platform_service',
    farmerId: 'farmer_1',
    farmerName: 'Rameshwar Patidar',
    userId: 'user_farmer_1',
    userName: 'Rameshwar Patidar',
    userRole: 'farmer',
    userLocation: 'Village Ashta, Sehore',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Got paid ₹28/kg direct via UPI within 3 hours of dispatch!',
    comment: 'In the local Sehore mandi, commission agents (arhatiyas) were offering ₹21/kg with a 6% cut and delayed ledger payments. On KrishiConnect, I sold 450 kg tomatoes directly at ₹28/kg. The digital weighing scale was calibrated in front of me and full payment was credited straight to my Bank of India account within 3 hours.',
    tags: ['Zero Mandi Cut', 'Instant UPI Payout', 'Transparent Weighing', '₹18,000+ Extra Profit'],
    verifiedPurchase: true,
    date: '2026-11-05',
  },
  {
    id: 'rev_srv_2',
    category: 'platform_service',
    farmerId: 'farmer_2',
    farmerName: 'Kamla Bai Mewada',
    userId: 'user_farmer_2',
    userName: 'Kamla Bai Mewada',
    userRole: 'farmer',
    userLocation: 'Bairagarh Kalan, Sehore',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Total respect for woman organic growers, zero middleman intimidation',
    comment: 'Going to the mandi as a woman farmer was always stressful due to aggressive traders and forced price slashes. KrishiConnect brings AgriFleet right to our farm gate. Clean returnable plastic crates are provided, and consumers directly appreciate our certified organic compost farming.',
    tags: ['Empowering Women Farmers', 'Farm-Gate Collection', 'NPOP Certified', 'Fair Weighbridge'],
    verifiedPurchase: true,
    date: '2026-11-04',
  },
  {
    id: 'rev_srv_3',
    category: 'platform_service',
    farmerId: 'farmer_3',
    farmerName: 'Mohanlal Dangi',
    userId: 'user_farmer_3',
    userName: 'Mohanlal Dangi',
    userRole: 'farmer',
    userLocation: 'Village Gulabganj, Vidisha',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 4,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Gemini AI Pricing recommended ₹34/kg when trader offered ₹22',
    comment: 'The KrishiMitra AI pricing feature accurately analyzed upcoming wedding demand and advised holding my harvest price at ₹34/kg. Within 12 hours, a chain of Bhopal restaurants bought the entire 6 quintal lot. This platform protects our sweat and dignity.',
    tags: ['AI Smart Pricing', 'Direct Bulk Buyers', 'Dignity for Farmers'],
    verifiedPurchase: true,
    date: '2026-11-01',
  },

  // 3. AgriFleet Delivery Reviews
  {
    id: 'rev_del_1',
    category: 'delivery',
    orderId: 'ord_101',
    userId: 'user_consumer_2',
    userName: 'Dr. Vivek Saxena',
    userRole: 'consumer',
    userLocation: 'Arera Colony, Bhopal',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Arrived at 7:15 AM before morning tea, ice-pack still intact',
    comment: 'The AgriFleet delivery vehicle arrived promptly at 7:15 AM. Vikram, the delivery partner, was polite, sanitized his hands, and delivered the sealed modular agri-crate right to our door. The produce temperature was cool and morning moisture was completely preserved.',
    tags: ['7:15 AM Dawn Transit', 'Sealed Agri-Crate', 'Cold-Chain Chilled', 'Courteous Driver'],
    verifiedPurchase: true,
    date: '2026-11-04',
  },
  {
    id: 'rev_del_2',
    category: 'delivery',
    orderId: 'ord_104',
    userId: 'user_farmer_1',
    userName: 'Rameshwar Patidar',
    userRole: 'farmer',
    userLocation: 'Village Ashta, Sehore',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Fleet pickup arrived on the dot at 6:00 AM, zero crate mishandling',
    comment: 'Our biggest problem with traditional transport was broken crates and damaged vegetables on rough village roads. AgriFleet uses air-suspension mini trucks with padded crate locks. Zero fruit bruising occurred between Sehore and Bhopal.',
    tags: ['Punctual 6:00 AM Pickup', 'Zero Fruit Bruising', 'Air Suspension'],
    verifiedPurchase: true,
    date: '2026-11-03',
  },
  {
    id: 'rev_del_3',
    category: 'delivery',
    orderId: 'ord_98',
    userId: 'user_retailer_1',
    userName: 'Rajesh Agrawal',
    userRole: 'retailer',
    userLocation: 'MP Nagar, Bhopal',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Commercial lot delivered straight to supermarket loading dock by 8 AM',
    comment: 'AgriFleet delivered 25 modular crates directly into our cold storage bay before opening hours. Driver provided the digital weight manifest on his app with digital signature receipt. Seamless logistics.',
    tags: ['B2B Dock Delivery', 'Digital Manifest', 'On-Time Commercial'],
    verifiedPurchase: true,
    date: '2026-11-02',
  },

  // 4. Retailer & Bulk Buyer Reviews
  {
    id: 'rev_ret_1',
    category: 'retail',
    orderId: 'ord_102',
    userId: 'user_retailer_1',
    userName: 'Rajesh Agrawal (GreenLeaf Supermart)',
    userRole: 'retailer',
    userLocation: 'MP Nagar Zone II, Bhopal',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Grade-A sorting, saved 22% vs APMC Karond Mandi wholesale',
    comment: 'We procured 8 quintals of Sehore Sharbati wheat and 250 kg organic desi tomatoes through KrishiConnect. The sorting and grading standards were 100% uniform. Compared to the middleman rate at Karond Mandi, our procurement cost was 22% lower, and our retail customers raved about the shelf life.',
    tags: ['Grade-A Sorting', '22% Cost Savings', '100% GST Invoice', 'Zero In-Transit Spoilage'],
    verifiedPurchase: true,
    date: '2026-11-04',
  },
  {
    id: 'rev_ret_2',
    category: 'retail',
    orderId: 'ord_91',
    userId: 'user_retailer_2',
    userName: 'Chef Manav Kapoor (Heritage Hospitality Group)',
    userRole: 'retailer',
    userLocation: 'Bhopal-Indore Highway Hub',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 5,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Kitchen wastage dropped from 18% down to 2%',
    comment: 'When buying from mandi brokers, bottom crates always had rotten or immature produce. With KrishiConnect direct farm lots, every single tomato and bundle of palak is hand-graded. Our kitchen food waste dropped from 18% to under 2%. The culinary flavor difference is noticeable in our gravies.',
    tags: ['Culinary Quality', 'Waste Dropped 16%', 'Reliable Recurring Supply'],
    verifiedPurchase: true,
    date: '2026-11-01',
  },
  {
    id: 'rev_ret_3',
    category: 'retail',
    orderId: 'ord_87',
    userId: 'user_retailer_3',
    userName: 'Sunil Gupta (Gupta Kirana & Wholesale)',
    userRole: 'retailer',
    userLocation: 'Main Mandi Road, Sehore',
    rating: 5,
    subRatings: {
      freshnessOrQuality: 5,
      deliveryOrTimeliness: 4,
      valueOrFairPrice: 5,
      serviceOrHandling: 5,
    },
    title: 'Direct farmer lot transparency with full tax invoicing',
    comment: 'We buy pulses (Desi Chana & Tur Dal) in 50 kg sacks. The QR-code traceability showing which farm in Vidisha it came from has become our top selling point in store. Clear digital invoices with no unaccounted commission cash.',
    tags: ['QR Provenance', 'Clean Digital Billing', 'Direct Farm Lot'],
    verifiedPurchase: true,
    date: '2026-10-29',
  },
];

export const DISPUTES: Dispute[] = [
  {
    id: 'disp_1',
    orderId: 'ord_88',
    raisedByUserId: 'user_consumer_4',
    raisedByName: 'Alok Saxena',
    raisedByRole: 'consumer',
    reason: 'Slightly bruised produce during rough road transit',
    details: '2 out of 5 kg tomatoes had slight pressure bruising due to bumpy transit from Sehore.',
    status: 'Resolved',
    resolutionNotes: 'Instant partial refund of ₹56 credited back to user wallet; farmer was compensated via Transit Protection Pool.',
    createdAt: '2026-10-30T10:00:00Z',
  },
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_farmer_1',
    title: 'New Order Received',
    message: 'Consumer Pooja Sharma placed an order for 3 kg Tomatoes & 2 kg Peas (Order #KC-2026-8812).',
    type: 'order',
    isRead: false,
    createdAt: '2026-11-05T06:16:00Z',
  },
  {
    id: 'notif_2',
    userId: 'user_farmer_1',
    title: 'Payment Credited',
    message: '₹6,780 credited to your linked UPI account for wholesale dispatch #KC-2026-8790.',
    type: 'payment',
    isRead: true,
    createdAt: '2026-11-04T18:00:00Z',
  },
  {
    id: 'notif_3',
    userId: 'user_farmer_1',
    title: 'AI Smart Mandi Advisory',
    message: 'Bhopal Mandi tomato wholesale rates surged 12% today. Recommended listing price: ₹28-₹32/kg.',
    type: 'ai_insight',
    isRead: false,
    createdAt: '2026-11-05T05:00:00Z',
  },
];

// Helper database functions
export class Database {
  users = [...USERS];
  farmers = [...FARMER_PROFILES];
  products = [...PRODUCTS];
  orders = [...ORDERS];
  bulkRequests = [...BULK_REQUESTS];
  reviews = [...REVIEWS];
  disputes = [...DISPUTES];
  notifications = [...NOTIFICATIONS];

  // Users
  getUser(id: string) {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  // Products
  getProducts(filters?: {
    category?: string;
    isOrganic?: boolean;
    search?: string;
    farmerId?: string;
    district?: string;
  }) {
    let result = [...this.products];
    if (filters?.category && filters.category !== 'All') {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters?.isOrganic !== undefined) {
      result = result.filter((p) => p.isOrganic === filters.isOrganic);
    }
    if (filters?.farmerId) {
      result = result.filter((p) => p.farmerId === filters.farmerId);
    }
    if (filters?.district) {
      result = result.filter((p) => p.district.toLowerCase() === filters.district?.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getProduct(id: string) {
    return this.products.find((p) => p.id === id);
  }

  addProduct(productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>) {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.products[idx] = { ...this.products[idx], ...updates };
      return this.products[idx];
    }
    return null;
  }

  deleteProduct(id: string) {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const deleted = this.products.splice(idx, 1);
      return deleted[0];
    }
    return null;
  }

  // Farmers
  getFarmers() {
    return this.farmers;
  }

  getFarmer(id: string) {
    return this.farmers.find((f) => f.id === id || f.userId === id);
  }

  updateFarmerProfile(id: string, updates: Partial<FarmerProfile>) {
    const idx = this.farmers.findIndex((f) => f.id === id || f.userId === id);
    if (idx !== -1) {
      this.farmers[idx] = { ...this.farmers[idx], ...updates };
      return this.farmers[idx];
    }
    return null;
  }

  // Orders
  getOrders(filters?: { buyerId?: string; farmerId?: string; role?: string }) {
    let result = [...this.orders];
    if (filters?.buyerId) {
      result = result.filter((o) => o.buyerId === filters.buyerId);
    }
    if (filters?.farmerId) {
      result = result.filter((o) => o.farmerIds.includes(filters.farmerId!));
    }
    return result;
  }

  getOrder(id: string) {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'timeline' | 'createdAt' | 'updatedAt'>) {
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber: `KC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          status: 'Confirmed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: 'Order confirmed and routed directly to farm cooperatives',
        },
      ],
    };
    this.orders.unshift(newOrder);

    // Reduce product inventory
    for (const item of newOrder.items) {
      const prod = this.getProduct(item.productId);
      if (prod) {
        prod.availableQuantity = Math.max(0, prod.availableQuantity - item.quantity);
      }
    }

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status'], description?: string) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      order.timeline.push({
        status,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        description: description || `Order updated to ${status}`,
      });
      return order;
    }
    return null;
  }

  // Reviews
  addReview(reviewData: Omit<Review, 'id' | 'date'>) {
    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    this.reviews.unshift(newReview);
    return newReview;
  }

  // Bulk requests
  createBulkRequest(data: Omit<BulkPurchaseRequest, 'id' | 'status' | 'matchedFarmersCount' | 'createdAt'>) {
    const newReq: BulkPurchaseRequest = {
      ...data,
      id: `bulk_${Date.now()}`,
      status: 'Open',
      matchedFarmersCount: Math.floor(2 + Math.random() * 4),
      createdAt: new Date().toISOString(),
    };
    this.bulkRequests.unshift(newReq);
    return newReq;
  }
}

export const db = new Database();
