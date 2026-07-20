const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error"
    });
}

export default errorHandler;