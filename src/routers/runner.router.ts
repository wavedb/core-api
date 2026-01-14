import { Hono } from "hono";
import {
	createRunnerController,
	getRunnerController,
} from "@/controllers/runner.controller";
import { apiKeyMiddleware } from "@/middlewares/auth";
import {
	validProjectIdMiddleware,
	validRunnerIdMiddleware,
} from "@/middlewares/project";
import type { AuthVariables } from "@/types/variables";
import metricRouter from "./metric.router";

const runnerRouter = new Hono<{ Variables: AuthVariables }>();

runnerRouter.use(apiKeyMiddleware);
runnerRouter.use(validProjectIdMiddleware);
runnerRouter.use("/:runnerId/*", validRunnerIdMiddleware);

runnerRouter.post("/", createRunnerController);

runnerRouter.get("/:runnerId", getRunnerController);
runnerRouter.route("/:runnerId/metrics", metricRouter);

export default runnerRouter;
