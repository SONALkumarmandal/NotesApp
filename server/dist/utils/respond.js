export const respond = (res, status, data) => {
    return res.status(status).json({
        success: true,
        data
    });
};
