import { Router } from 'express';
import * as users  from '../controller/usersController.js';

const userRouter = Router();

userRouter.post('/register', users.createUser);
userRouter.post('/login', users.login);
userRouter.post('/setAvatar/:id', users.setAvatar);
userRouter.get('/users/:id', users.allUsers);

export default userRouter;
