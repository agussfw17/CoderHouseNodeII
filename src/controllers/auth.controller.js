import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const register = async (req, res) => {
	try {

		const { name, email, password, role } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(400).json({ error: 'Email ya esta en uso' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			role: role || 'user'
		});

		res.status(201).json({ message: 'Email registrado con exito', user });
	} catch (error) {
		console.log('Error en register: ', error);
		res.status(500).json({ error: 'Error al registrar el email' });
	}
};

export const login = async (req, res) => {
	try {
		const {email, password} = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Email y password son requeridos' });
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(401).json({ error: 'Credenciales invalidas' });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ error: 'Credenciales invalidas' });
		}

		const token = jwt.sign(
			{ userId: user._id, name: user.name, email: user.email, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
		);

		res.cookie('authToken', token, {
			httpOnly: true,
			sameSite: 'Lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 1000 * 60 * 60
		});

		req.session.user = {
			id: user._id,
			email: user.email,
			role: user.role
		};

		res.json({ message: 'Login exitoso', token, user: req.session.user });
	} catch (error) {
		console.log('Error en login: ', error);
		res.status(500).json({ error: 'Error al iniciar sesion' });
	}
};

export const logout = (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			console.log('Error en logout: ', error);
			return res.status(500).json({ error: 'Error al cerrar sesion' });
		}
		res.clearCookie('authToken');
		res.json({ message: 'Sesion cerrada con exito' });
	});
};