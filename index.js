import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRouter from './route/userRoutes.js';
import messageRoutes from './route/messagesRoute.js';
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 8000;
const databaseString = process.env.DATABASE_URL

mongoose.connect(databaseString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const database = mongoose.connection;

database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database connected successfully'));

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: '*',
    // credentials: true,
    //  "Access-Control-Allow-Origin": "*"
  }
})

global.onlineUsers = new Map();
io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id)
  });

  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data.message);
    }
  });
});
