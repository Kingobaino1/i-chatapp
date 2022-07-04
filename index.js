import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import userRouter from './route/userRoutes';
import messageRoutes from './route/messagesRoute';
import socket from 'socket.io';


const app = express();
const PORT = 4000 || process.env.PORT;
const databaseString = process.env.DATABASE_URL

mongoose.connect(databaseString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const database = mongoose.connection;

database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database connected successfully'));

app.use(cors());
app.use(express.json());
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
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
