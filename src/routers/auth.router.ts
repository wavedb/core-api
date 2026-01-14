import { Hono } from "hono";
import {
	loginController,
	registerController,
} from "../controllers/auth.controller";

const authRouter = new Hono();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);

export default authRouter;
