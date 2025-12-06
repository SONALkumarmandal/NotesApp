import type { Request,Response,NextFunction } from "express";
import { config } from "../config/app.config";

export const getAppInfo = (req : Request , res :Response,next : NextFunction)=>{
   res.json({
     success : true,
     appName : config.app_name,
     environment : config.env_node,
     version : "V1"
   })
}


export const getAppHealth = (req : Request , res :Response,next : NextFunction)=>{
   res.json({
     success : true,
     status : "OK",
     uptime : process.uptime()
   })
}

export const getEnv = (req : Request , res :Response,next : NextFunction)=>{
   res.json({
     appName : config.app_name,
     environment : config.env_node,
     port :config.port
   })
}