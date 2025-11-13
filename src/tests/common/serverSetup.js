

import indexRouter from "../../routers/indexRouter";
import { default as express } from "express";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);


const userRouter = require("../../routers/userRouter");
app.use("/user", userRouter);

export {app}