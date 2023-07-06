import express, {Express, Request, Response} from "express"
const PORT = 3000;


const app : Express = express();

//Home route

app.get("/", (req: Request,res : Response)=>{
    res.send("Welcome to shortlyurl App");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})