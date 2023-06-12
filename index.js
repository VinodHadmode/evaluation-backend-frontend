const express=require("express")
const { connection } = require("./db")
const { userRouter } = require("./routes/user.route")
const { postRouter } = require("./routes/post.route")
require("dotenv").config()

const app=express()

app.use(express.json())
app.use("/users",userRouter)
app.use("/posts",postRouter)


app.listen(process.env.port,async()=>{
    try { 
           await connection
           console.log("Connected to DB!!");
    } catch (error) {
        console.log("Something went wrong while connceting!!");
        console.log(error);
    }
    console.log(`Server is running on 8080 port`);

})

/*
{
    "name": "Vinod",
    "email": "vinod@gmail.com",
    "pass": "vinod123",
    "gender": "male",
    "age": 27,
    "city": "Pune",
    "is_married": false
}
*/