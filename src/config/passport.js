import passport from 'passport';

import User from '../models/user.model.js';

import '../strategies/local.strategy.js';
import '../strategies/github.strategy.js';

passport.serializeUser((user, done) => { 
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;