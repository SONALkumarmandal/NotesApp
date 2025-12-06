import { createApp } from "./app";
import { config } from "./config/app.config";

const app=createApp()

app.listen(config.port,()=>{
    console.log(`server started at port : ${config.port}`)
})