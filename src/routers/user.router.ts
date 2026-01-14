import { Hono } from "hono";
import { createUserApiKeyController } from "@/controllers/user.controller";
import { authMiddleware } from "@/middlewares/auth";
import type { AuthVariables } from "@/types/variables";

const userRouter = new Hono<{ Variables: AuthVariables }>();

userRouter.use(authMiddleware);

userRouter.post("/api-keys", createUserApiKeyController);
export default userRouter;
