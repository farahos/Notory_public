import express from 'express';
import { connect } from 'mongoose';
import conectBD from './config/db.js';
import { registerUser } from './controller/UserController.js';
import userRouter from './routes/UserRoute.js';
import cookieParser from 'cookie-parser';
import TokenRoute from './routes/TokenRoute.js';
import aggrementRoutes from './routes/agreementroutes.js';
import personRoutes from './routes/PersonRoutes.js';
import motorcycleRoutes from './routes/motorcycleroutes.js';
import shareRoutes from './routes/shareroutes.js'
import wakaladRoutes from './routes/wakaladRoutes.js';
import tasdiiqRoutes from './routes/tasdiiqRoutes.js';
const app = express();
const PORT = 8000

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/transactions', aggrementRoutes);
app.use('/api/agreements', aggrementRoutes);
app.use("/api/persons", personRoutes);
app.use("/api/motors", motorcycleRoutes);
app.use("/api/shares", shareRoutes);
app.use("/api/wakaalads", wakaladRoutes);
app.use("/api/tasdiiqs", tasdiiqRoutes);


// forget password
app.use('/api/forgetpassword', TokenRoute);


conectBD();
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);

})
