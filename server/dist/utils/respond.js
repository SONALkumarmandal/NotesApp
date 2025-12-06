import { Response } from "express";
export const response = (res, status, data) => {
    return res.status(status).json({
        success: true,
        data
    });
};
//# sourceMappingURL=respond.js.map