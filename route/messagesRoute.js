import { Router } from 'express';
import * as messages from '../contoller/messagesController';

const messageRoutes = Router();

messageRoutes.post('/addMsg', messages.addMessage);
messageRoutes.post('/getMsg', messages.getMessages)

export default messageRoutes;
