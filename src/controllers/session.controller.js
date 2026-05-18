export const getSession = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No active session' });
    }
    res.json({ user: req.user });
};