import mongoose from "mongoose";

const schema = mongoose.schema;

const subscriptionModel = new schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: [true, 'subscription price is required'],
            min: [0, 'price must be greater than 0'],
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'INR', 'NPR'],
            default: 'USD'
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly']
        },
        category: {
            type: String,
            enum: ['health', 'fitness', 'food', 'entertainment', 'education', 'technology', 'others'],
            required: 'true'
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired'],
            default: 'active'
        },
        startDate: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return value > Date.now();
                },
            }
        },
        renewalDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value >= this.startDate()
                },
                message: 'Start dat e must be in the past'
            }
        },
        user: {
            type: mongoose.schema.Types.objectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

subscriptionModel.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };

        this.renewalDate = new Date(this.startDate());
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //AUTO-UPDATE IF THE RENEWAL DATE IS PASSED
    if(this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionModel);
export default Subscription;