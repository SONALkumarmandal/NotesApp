import { Request, Response, NextFunction } from "express";
export const Logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.path} ${req.params}`);
    next();
};
//# sourceMappingURL=logger.middleware.js.map