export const errorMiddleware = (error, req, res, next) => {
    console.error(error);
    return res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Internal server error'
    });
};