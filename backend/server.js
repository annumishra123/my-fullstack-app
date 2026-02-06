import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import router from './routes/index-route.js';

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tasksystem';

dotenv.config()

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)
app.use(express.json());
app.use(morgan('dev'));

app.use("/api-v1", router)



mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({messsage: "Internal server error"});
});


app.use((req, res)=>{
    res.status(200).json({
        message: "Not found"
    });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
