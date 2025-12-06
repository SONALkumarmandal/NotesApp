import { Request,Response,NextFunction } from "express";

export const Logger = (req : Request,res : Response,next : NextFunction)=>{
    console.log(`[${new Date().toISOString()}] ${req.path} ${req.params}`)
    next()
}