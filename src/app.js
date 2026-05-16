import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';

import authRoutes from './routes/auth.routes.js';

const app = express();
console.log('APP LOADED')
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);

export default app;