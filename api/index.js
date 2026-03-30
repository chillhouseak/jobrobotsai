import authHandler from './auth/[action].js';
import adminHandler from './admin/[...action].js';
import aiHandler from './ai/[action].js';
import webhookHandler from './webhooks/[action].js';
import imageHandler from './ai/image.js';
// ✅ CORS
const setCorsHeaders = (req, res) => {
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
};

export default async function handler(req, res) {
  try {
    const { url, method } = req;
    let pathname = url.split("?")[0];

    // ✅ REMOVE /api PREFIX (IMPORTANT FIX)
    if (pathname.startsWith("/api")) {
      pathname = pathname.replace("/api", "");
    }

    // ✅ Handle OPTIONS FIRST
    if (method === "OPTIONS") {
      setCorsHeaders(req, res);
      return res.status(200).end();
    }

    // ✅ Apply CORS
    setCorsHeaders(req, res);

    // ========================
    // 🔥 ROUTING (NOW WORKS WITH /api)
    // ========================

    if (pathname.startsWith("/auth/")) {
      const action = pathname.split("/auth/")[1];
      req.query = { action };
      return await authHandler(req, res);
    }

    if (pathname.startsWith("/admin/")) {
      const action = pathname.split("/admin/")[1];
      req.query = { action };
      return await adminHandler(req, res);
    }

    if (pathname.startsWith("/ai/")) {
      const action = pathname.split("/ai/")[1];
      req.query = { action };
      return await aiHandler(req, res);
    }

    if (pathname.startsWith("/webhooks/")) {
      const action = pathname.split("/webhooks/")[1];
      req.query = { action };
      return await webhookHandler(req, res);
    }

    // ✅ Health check
    if (pathname === "/" || pathname === "/health") {
      return res.status(200).json({
        success: true,
        message: "API is running"
      });
    }
    if (pathname.startsWith("/api/ai/image")) {
  return await imageHandler(req, res);
}

    return res.status(404).json({
      success: false,
      message: "Route not found"
    });

  } catch (error) {
    console.error("🔥 API ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}
