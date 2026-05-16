import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const register = async (req, res) => {
	try {

		const { name, email, password } = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword
		});

		res.status(201).json({
			message: 'User registered',
			user
		});

	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
};

export const login = async (req, res) => {
	try {
		const user = req.user;

		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
		);

		res.cookie('authToken', token, {
			httpOnly: true,
			sameSite: 'Lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 1000 * 60 * 60
		});

		res.json({
			message: 'Login successful',
			token,
			user: {
				id: user._id,
				email: user.email,
				role: user.role
			}
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};