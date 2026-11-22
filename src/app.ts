import express from "express";
import { apiRouter } from "./routes.js";

export const app = express();

app.use(apiRouter);

app.use(express.json());
