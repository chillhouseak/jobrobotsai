import jwt from 'jsonwebtoken';
import connectDB from '../db.js';
import User from '../models/User.js';

// ✅ Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// ✅ Auth middleware
const authMiddleware = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default async function handler(req, res) {
  try {
    // ✅ CONNECT DB FIRST (CRITICAL)
    await connectDB();

    const { method, query } = req;
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { action } = query;

    // =========================
    // ✅ GLOBAL CORS (SAFE)
    // =========================
    const allowedOrigins = [
      "https://jobrobotsaii-qbjo.vercel.app",
      "https://jobrobotsaii-6jrn.vercel.app"
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (method === "OPTIONS") {
      return res.status(200).end();
    }

    // =========================
    // 🔥 LOGIN
    // =========================
    if (action === 'login' && method === 'POST') {
      const { email, password, name } = body || {};

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      let user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      // ✅ Create user if not exists
      if (!user) {
        const newUser = new User({
          name: name || email.split('@')[0],
          email: email.toLowerCase(),
          password
        });

        await newUser.save();

        const token = generateToken(newUser._id);

        return res.status(201).json({
          success: true,
          message: 'Account created and logged in successfully',
          data: {
            user: {
              _id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              createdAt: newUser.createdAt
            },
            token,
            isNewUser: true
          }
        });
      }

      // ✅ Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          },
          token,
          isNewUser: false
        }
      });
    }

    // =========================
    // 🔥 REGISTER
    // =========================
    if (action === 'register' && method === 'POST') {
      const { name, email, password } = body || {};

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide name, email and password'
        });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      const user = new User({
        name,
        email: email.toLowerCase(),
        password
      });

      await user.save();

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
          },
          token
        }
      });
    }

    // =========================
    // 🔥 GET CURRENT USER
    // =========================
    if (action === 'me' && method === 'GET') {
      const decoded = await authMiddleware(req);

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: { user }
      });
    }

    // =========================
    // 🔥 UPDATE PROFILE
    // =========================
    if (action === 'profile' && method === 'PUT') {
      const decoded = await authMiddleware(req);

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      Object.assign(user, body);
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });
    }

    // =========================
    // ❌ NOT FOUND
    // =========================
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });

  } catch (error) {
    console.error("🔥 AUTH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
}
