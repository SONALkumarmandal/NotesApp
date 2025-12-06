import { Request,Response,NextFunction } from "express";


export const createNote = (req : Request,res : Response , next : NextFunction)=>{
    
    const {name,task} =req.body
    try {
        res.status(201).json({
        "message" : "notes added!"
    })
    } catch (error) {
        console.log(error)
    }

}