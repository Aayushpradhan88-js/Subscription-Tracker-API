import express from "express";
import { workflowReminder } from "../controllers/upstashworkflowcontroller.js";

const upstashworkflowroutes = express.Router();

upstashworkflowroutes.post("/subscription/remainder", workflowReminder);

export default upstashworkflowroutes;