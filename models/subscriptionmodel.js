import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: { 
        type: String,
         required: true,
          trim: true 
        },
    price: {
         type: 
         Number, 
         required: true,
          min: 0 
        },
    currency: { 
        type: String, 
        enum: ['USD', 'EUR', 'INR', 'NPR'],
         default: 'USD' 
        },
    frequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
         required: true
         },
    category: {
         type: String, 
         enum: ['health', 'fitness', 'food', 'entertainment', 'education', 'technology', 'others'], 
         required: true 
        },
    paymentMethod: { 
        type: String, 
        enum: ['esewa','khalti','card', 'paypal', 'bank_transfer'], 
        required: true 
    },
    status: {
         type: String, 
         enum: ['active', 'cancelled', 'expired'],
          default: 'active' 
        },
    startDate: { 
        type: Date, 
        required: true 
    },
    renewalDate: { 
        type: Date 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Users',
          required: true,
           index: true 
        }
}, { timestamps: true });

subscriptionSchema.pre('save', function(next) {
    if (this.isModified('startDate') || this.isModified('frequency') || !this.renewalDate) {
        const days = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + (days[this.frequency] || 30));
    }
    
    if (this.renewalDate < new Date()) this.status = 'expired';
    
    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;