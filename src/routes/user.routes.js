import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: 'Protected profile', user: req.user });
  }
);

router.get('/admin', authenticateToken, roleMiddleware('admin'), (req, res) => {
    res.json({ message: 'Admin panel' });
  }
);

export default router;