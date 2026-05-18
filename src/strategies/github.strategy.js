import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

import User from '../models/user.model.js';

passport.use('github',
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                
                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        name: profile.displayName,
                        email,
                        provider: 'github'
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);