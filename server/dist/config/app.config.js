import dotenv from "dotenv";
dotenv.config();
export const config = {
    port: process.env.PORT || 3000,
    env_node: process.env.NODE || "Developement",
    app_name: process.env.APP_NAME || "Notes_App"
};
