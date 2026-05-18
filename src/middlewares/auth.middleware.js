import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token invalido' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({ error: 'Token invalido o expirado' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.log('Error en authenticateToken: ', error);
        return res.status(401).json({ error: 'Token invalido' });
    }
};