import express from "express";
import { workflowClient } from "../config/upstash";

const upstashworkflowroutes = express.Router();

upstashworkflowroutes.get("/", upstashworkflowcontroller);

export default upstashworkflowroutes;