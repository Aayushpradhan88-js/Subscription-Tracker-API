import { Client as WorkflowClient } from "@upstash/workflow";

export const workflowClient = new WorkflowClient({
    // eslint-disable-next-line no-undef
    key: process.env.QSTASH_KEY,
    // eslint-disable-next-line no-undef
    token: process.env.QSTASH_TOKEN
});