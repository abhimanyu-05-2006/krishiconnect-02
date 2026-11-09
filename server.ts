import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import {
  calculateSmartPricing,
  generateDemandForecast,
  askAgriAssistant,
} from './server/gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Routes
  const router = express.Router();

  // Maps Config for client
  router.get('/config/maps', (req, res) => {
    res.json({
      apiKey: process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || '',
    });
  });

  // Auth & Demo users
  router.get('/auth/users', (req, res) => {
    res.json(db.users);
  });

  router.post('/auth/login', (req, res) => {
    const { role, email } = req.body;
    let user;
    if (email) {
      user = db.getUserByEmail(email);
    } else if (role) {
      user = db.users.find((u) => u.role === role);
    }
    if (!user) {
      // Default to farmer or consumer
      user = db.users[0];
    }
    res.json({ success: true, user, token: `jwt_token_${user.id}` });
  });

  // Farmers
  router.get('/farmers', (req, res) => {
    res.json(db.getFarmers());
  });

  router.get('/farmers/:id', (req, res) => {
    const farmer = db.getFarmer(req.params.id);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
    const products = db.getProducts({ farmerId: farmer.id });
    res.json({ ...farmer, products });
  });

  router.put('/farmers/:id', (req, res) => {
    const updated = db.updateFarmerProfile(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Farmer not found' });
    res.json(updated);
  });

  // Products
  router.get('/products', (req, res) => {
    const { category, isOrganic, search, farmerId, district } = req.query;
    const products = db.getProducts({
      category: category as string,
      isOrganic: isOrganic !== undefined ? isOrganic === 'true' : undefined,
      search: search as string,
      farmerId: farmerId as string,
      district: district as string,
    });
    res.json(products);
  });

  router.get('/products/:id', (req, res) => {
    const product = db.getProduct(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const farmer = db.getFarmer(product.farmerId);
    res.json({ ...product, farmer });
  });

  router.post('/products', (req, res) => {
    try {
      const created = db.addProduct(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.put('/products/:id', (req, res) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  });

  router.delete('/products/:id', (req, res) => {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true, deleted });
  });

  // Orders
  router.get('/orders', (req, res) => {
    const { buyerId, farmerId, role } = req.query;
    const orders = db.getOrders({
      buyerId: buyerId as string,
      farmerId: farmerId as string,
      role: role as string,
    });
    res.json(orders);
  });

  router.get('/orders/:id', (req, res) => {
    const order = db.getOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  router.post('/orders', (req, res) => {
    try {
      const order = db.createOrder(req.body);
      res.status(201).json(order);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  router.patch('/orders/:id/status', (req, res) => {
    const { status, description } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, description);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  });

  // Bulk requests for retailers
  router.get('/bulk-requests', (req, res) => {
    res.json(db.bulkRequests);
  });

  router.post('/bulk-requests', (req, res) => {
    const created = db.createBulkRequest(req.body);
    res.status(201).json(created);
  });

  router.post('/bulk-requests/:id/bid', (req, res) => {
    const reqItem = db.bulkRequests.find((b) => b.id === req.params.id);
    if (!reqItem) return res.status(404).json({ error: 'Request not found' });
    if (!reqItem.bids) reqItem.bids = [];
    reqItem.bids.push(req.body);
    reqItem.status = 'Bids Received';
    res.json(reqItem);
  });

  // Reviews
  router.get('/reviews', (req, res) => {
    const { category, productId, farmerId } = req.query;
    let list = db.reviews;
    if (category) {
      list = list.filter((r) => r.category === category);
    }
    if (productId) {
      list = list.filter((r) => r.productId === productId);
    }
    if (farmerId) {
      list = list.filter((r) => r.farmerId === farmerId);
    }
    res.json(list);
  });

  router.post('/reviews', (req, res) => {
    try {
      const rev = db.addReview(req.body);
      res.status(201).json(rev);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Disputes (Admin)
  router.get('/disputes', (req, res) => {
    res.json(db.disputes);
  });

  router.patch('/disputes/:id', (req, res) => {
    const disp = db.disputes.find((d) => d.id === req.params.id);
    if (!disp) return res.status(404).json({ error: 'Dispute not found' });
    Object.assign(disp, req.body);
    res.json(disp);
  });

  // Notifications
  router.get('/notifications', (req, res) => {
    const { userId } = req.query;
    if (userId) {
      res.json(db.notifications.filter((n) => n.userId === userId));
    } else {
      res.json(db.notifications);
    }
  });

  // AI Routes
  router.post('/ai/smart-pricing', async (req, res) => {
    try {
      const result = await calculateSmartPricing(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/ai/demand-forecast', async (req, res) => {
    try {
      const result = await generateDemandForecast(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/ai/chat', async (req, res) => {
    try {
      const result = await askAgriAssistant(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/ai/insights', (req, res) => {
    res.json({
      summary: 'Central MP Mandi Supply-Demand Matrix',
      gapAnalysis: [
        {
          crop: 'Organic Desi Tomato',
          status: 'Shortage (Demand +28%)',
          recommendedAction: 'Incentivize Sehore farmers to increase polyhouse acreage.',
        },
        {
          crop: 'Sharbati Wheat',
          status: 'Balanced (High Bulk Demand)',
          recommendedAction: 'Connect institutional buyers directly to avoid seasonal trader stockpiling.',
        },
        {
          crop: 'A2 Gir Cow Milk',
          status: 'Undersupplied (+40% unfilled orders)',
          recommendedAction: 'Expand cold-chain collection to Dewas and Hoshangabad dairy clusters.',
        },
      ],
      weeklyGmvGrowth: '+18.4%',
      farmerSurplusKept: '₹4.82 Lakhs direct earnings',
    });
  });

  // Payments Demo (Razorpay)
  router.post('/payments/create-order', (req, res) => {
    const { amount, currency = 'INR', receipt } = req.body;
    res.json({
      id: `order_rzp_mock_${Date.now()}`,
      entity: 'order',
      amount: amount * 100, // paisa
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      isDemoMode: true,
      notes: { platform: 'KrishiConnect Direct Agri' },
    });
  });

  router.post('/payments/verify', (req, res) => {
    const { paymentId, orderId } = req.body;
    res.json({
      success: true,
      paymentId: paymentId || `pay_DEMO_${Math.floor(100000 + Math.random() * 900000)}`,
      orderId,
      status: 'captured',
      method: 'upi_razorpay_demo',
      message: 'Payment successfully authenticated in KrishiConnect sandbox',
    });
  });

  // Mount API router
  app.use('/api', router);

  // Serve static assets from public and src/assets directly
  app.use(express.static(path.resolve(__dirname, 'public')));
  app.use('/src/assets', express.static(path.resolve(__dirname, 'src/assets')));
  app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')));

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[KrishiConnect] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[KrishiConnect] Fatal server error:', err);
  process.exit(1);
});
