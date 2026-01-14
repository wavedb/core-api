import { Hono } from "hono";
import {
	getMetricsController,
	writeMetricController,
} from "@/controllers/metric.controller";

const metricRouter = new Hono();

metricRouter.get("/", getMetricsController);
metricRouter.post("/write", writeMetricController);
export default metricRouter;
