import authHandler from './auth/[action].js';
import adminHandler from './admin/[...action].js';
import aiHandler from './ai/[action].js';
import webhookHandler from './webhooks/[action].js';

export default async function handler(req, res) {
  const { url } = req;
  const pathname = url.split('?')[0];

  // Auth routes: /api/auth/login, /api/auth/register, etc.
  if (pathname.startsWith('/api/auth/')) {
    const action = pathname.split('/api/auth/')[1];
    req.query = { action };
    return authHandler(req, res);
  }

  // Admin routes: /api/admin/login, /api/admin/users, etc.
  if (pathname.startsWith('/api/admin/')) {
    const action = pathname.split('/api/admin/')[1];
    req.query = { action };
    return adminHandler(req, res);
  }

  // AI routes: /api/ai/answer, /api/ai/status, etc.
  if (pathname.startsWith('/api/ai/')) {
    const action = pathname.split('/api/ai/')[1];
    req.query = { action };
    return aiHandler(req, res);
  }

  // Webhook routes: /api/webhooks/ipn, /api/webhooks/health, etc.
  if (pathname.startsWith('/api/webhooks/')) {
    const action = pathname.split('/api/webhooks/')[1];
    req.query = { action };
    return webhookHandler(req, res);
  }

  // Health check
  if (pathname === '/api' || pathname === '/api/health') {
    return res.status(200).json({
      success: true,
      message: 'JobRobots AI API is running',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(404).json({
    success: false,
    message: 'Route not found'
  });
}
