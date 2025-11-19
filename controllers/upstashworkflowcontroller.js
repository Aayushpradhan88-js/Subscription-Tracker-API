import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import dayjs from 'dayjs';

import Subscription from '../models/subscriptionModel.js';
import { sendRemainderEmail } from '../utils/send-email.js';

const REMINDER = [7, 5, 2, 1];

export const workflowReminder = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;

    const subscription = await fetchSubscription(context, subscriptionId);
    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal Date has been passed for subscription ${subscriptionId}`);
        return;
    }

    for (const dayBefore of REMINDER) {
        const reminderDate = renewalDate.subtract(dayBefore, 'day');

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${dayBefore} days before`, reminderDate)
        };

        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${dayBefore} days before`, subscription);
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email')
    })
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleep until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendRemainderEmail({
            to: subscription.user.email,
            type: label,
            subscription
        });

        // console.log(user.email)
    })
}