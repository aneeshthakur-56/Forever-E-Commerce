import express from "express";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 4000;

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is runing on ${PORT}`);
    });
})
