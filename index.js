import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';


const app = express();
const PORT = 4000 || process.env.PORT;
const databaseString = process.env.DATABASE_URL

mongoose.connect(databaseString, {
  
})
const database = mongoose.connection;

database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database connected successfully'));

app.use(cors);
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
