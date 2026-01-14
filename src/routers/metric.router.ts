import { Hono } from "hono";
import {
	getMetricsController,
	writeMetricAudioController,
	writeMetricImageController,
	writeMetricScalarController,
	writeMetricSystemController,
} from "@/controllers/metric.controller";

const metricRouter = new Hono();

metricRouter.get("/", getMetricsController);
metricRouter.post("/write/scalar", writeMetricScalarController);
metricRouter.post("/write/image", writeMetricImageController);
metricRouter.post("/write/audio", writeMetricAudioController);
metricRouter.post("/write/system", writeMetricSystemController)

export default metricRouter;
