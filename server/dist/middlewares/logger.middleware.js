export const Logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.path} ${req.params}`);
    next();
};
