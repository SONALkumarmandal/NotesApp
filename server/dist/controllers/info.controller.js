import { Request, Response, NextFunction } from "express";
import { config } from "../config/app.config";
export const getAppInfo = (req, res, next) => {
    res.json({
        success: true,
        appName: config.app_name,
        environment: config.env_node,
        version: "V1"
    });
};
export const getAppHealth = (req, res, next) => {
    res.json({
        success: true,
        status: "OK",
        uptime: process.uptime()
    });
};
export const getEnv = (req, res, next) => {
    res.json({
        appName: config.app_name,
        environment: config.env_node,
        port: config.port
    });
};
//# sourceMappingURL=info.controller.js.map