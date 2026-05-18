import { Router } from 'express';
import passport from 'passport';
import { register, login, logout } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);

router.post('/login', passport.authenticate('local', { session: false }), login);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: true }), (req, res) => {
        res.json({ message: 'GitHub login successful', user: req.user });
    }
);

router.post('/logout', logout);

export default router;