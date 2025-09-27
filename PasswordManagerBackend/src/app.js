import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import userRouter from './routes/userRoute.js';
import credentialRouter from './routes/credentialRoute.js';
import cors from 'cors';

const app = express()

app.use(express.json())

app.use(cors())

app.use('/api/v1/login', userRouter)

app.use('/api/v1/credential', credentialRouter)

app.get('/', (req, res)=>{
    res.status(200).json({message: 'Calling home'})
})


export default app