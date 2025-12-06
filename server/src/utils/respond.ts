import { Response } from "express";


export const response = (res : Response , status : number , data :any)=>{
    return res.status(status).json({
        success :true,
        data
    })
}

