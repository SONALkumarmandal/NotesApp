import { Response,Request,NextFunction } from "express";

export const errorMiddleware = (err : any ,req : Request,res : Response ,next : NextFunction)=>{
    console.log("Error Found ! : ",err.message)
    res.status(err.statusCode || 500).json({
        success : false,
        message : err.message || "Internal Server Error"
    })
}