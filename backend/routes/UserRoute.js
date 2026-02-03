import express from 'express';
import { approveUser, getAllUsers, getSingleUser, inactiveUser, loginUser, registerUser, updateUser } from '../controller/UserController.js';
import { authenticate, authorizeRoles } from '../middleware/authmiddleware.js';


const userRouter = express.Router();
userRouter.post('/registerUser',  registerUser);
userRouter.post('/loginUser', loginUser);
userRouter.get('/', authenticate, getAllUsers);
userRouter.get('/:id', authenticate, getSingleUser);
// ✅ Admin only - approve user
userRouter.put("/approve/:id", authenticate, authorizeRoles("admin"), approveUser);
userRouter.put("/inactive/:id", authenticate, authorizeRoles("admin"), inactiveUser);
userRouter.put('/:id', authenticate, updateUser);
export default userRouter;
