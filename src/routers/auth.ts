import { Hono } from "hono";
import { registerController } from "../controllers/auth/register.controller";

const authRouter = new Hono()

authRouter.post("/register", registerController)

export default authRouter
