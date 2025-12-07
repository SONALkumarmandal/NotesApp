import express from "express";
import { Logger } from "./middlewares/logger.middleware";
import noteFeatures from "./routes/noteRoutes";
import { errorMiddleware } from "./middlewares/err.middleare";
export const createApp = () => {
    const app = express();
    // middleware
    app.use(express.json());
    app.use(Logger);
    // routes
    app.use("/notes", noteFeatures);
    // error handler
    app.use(errorMiddleware);
    return app;
};
