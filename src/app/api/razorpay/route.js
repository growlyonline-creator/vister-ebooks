import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
    try {
        const { amount } = await req.json();

        const instance = new Razorpay({
            key_id: "rzp_live_SSZ0OP8zl6nSzK", // आपकी असली LIVE ID
            key_secret: "jZSzwbkSmR9oMXc9V011QkYD", // आपकी असली LIVE Secret
        });

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR",
            receipt: "vister_live_order_" + Date.now(),
        };

        const order = await instance.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}