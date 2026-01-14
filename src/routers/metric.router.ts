import { Hono } from "hono";
import {
	getMetricsController,
	writeMetricImageController,
	writeMetricScalarController,
} from "@/controllers/metric.controller";

const metricRouter = new Hono();

metricRouter.get("/", getMetricsController);
metricRouter.post("/write/scalar", writeMetricScalarController);
metricRouter.post("/write/image", writeMetricImageController);

export default metricRouter;
