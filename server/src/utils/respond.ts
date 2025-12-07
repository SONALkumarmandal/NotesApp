import { Response } from "express";


export const respond = (res : Response , status : number , data :any)=>{
    return res.status(status).json({
        success :true,
        data
    })
}

