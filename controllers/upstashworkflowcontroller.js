import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

import Subscription from '../models/subscriptionmodel.js';
import dayjs from 'dayjs';

const REMINDER = [7, 5, 2, 1];

export const workflowReminder = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;

    const subscription = await fetchSubscription(context, subscriptionId);
    if (!subscription || subscription.status !== 'active') {
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal Date hasbeen passed for subscription ${subscriptionId}`);
        return;
    }

    for (let dayBefore of REMINDER) {
        const reminderDate = renewalDate.subtract(dayBefore, 'day');

        if (reminderDate.isBefore(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${dayBefore} days before`, reminderDate)
        };

        await triggerReminder(context, `${dayBefore} days before`);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async() => {
        return Subscription.findById(subscriptionId).populate('user', 'name email')
    })
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleep until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async(context, label) => {
    return await context.run(label, () =>{
        console.log(`Triggering ${label} reminder`);
    })
}