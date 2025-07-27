import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
// import {ARCJET_KEY, ARCJET_ENV} from "../config/env.js";

const aj = arcjet({

    // eslint-disable-next-line no-undef
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],

    
    rules: [
        shield({ mode: "LIVE" }),

        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                // { userAgent: /Postman/i },
            ],
        }),

        tokenBucket({
            mode: "LIVE",
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),
    ],
});
console.log("arcject env = ",process.env.ARCJET_ENV)

export default aj;