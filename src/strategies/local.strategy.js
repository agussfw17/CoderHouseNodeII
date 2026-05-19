import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

passport.use(
	"local",
	new LocalStrategy(
		{ usernameField: 'email' },
		async (email, password, done) => {
			try {

				const user = await User.findOne({ email });
				if (!user) {
					return done(null, false, { message: 'Invalid credentials' });
				}

				const isMatch = await bcrypt.compare(password, user.password);
				if (!isMatch) {
					return done(null, false, { message: 'Invalid credentials' });
				}

				return done(null, user);

			} catch (error) {

				return done(error);
			}
		}
	)
);