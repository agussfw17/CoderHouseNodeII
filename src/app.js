import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import passport from './config/passport.js';

import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import sessionRoutes from './routes/session.routes.js';

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),
        cookie: {
            maxAge: 1000 * 60 * 60,
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'Lax'
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/session', sessionRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;