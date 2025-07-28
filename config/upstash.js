import { Client as WorkflowClient } from "@upstash/workflow";

export const workflowClient = new WorkflowClient({
    // eslint-disable-next-line no-undef
    baseUrl: process.env.QSTASH_URL,
    // eslint-disable-next-line no-undef
    token: process.env.QSTASH_TOKEN
});