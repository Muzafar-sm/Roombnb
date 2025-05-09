"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const auth_1 = require("../middleware/auth");
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY is not defined in environment variables');
    throw new Error('STRIPE_SECRET_KEY is required');
}
const router = express_1.default.Router();
const stripe = new stripe_1.default(stripeSecretKey);
router.post('/create-payment-intent', auth_1.auth, async (req, res) => {
    var _a, _b;
    try {
        const { amount } = req.body;
        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()) !== null && _b !== void 0 ? _b : null,
            },
        });
        res.json({
            clientSecret: paymentIntent.client_secret
        });
    }
    catch (err) {
        console.error('Error creating payment intent:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to create payment intent' });
    }
});
exports.default = router;
//# sourceMappingURL=payment.js.map