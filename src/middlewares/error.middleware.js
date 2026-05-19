export const errorMiddleware = (error, req, res, next) => {
    console.error(error);
    return res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Error interno del servidor'
    });
};

export const notFoundMiddleware = (req, res, next) => {
    return res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
    });
};  