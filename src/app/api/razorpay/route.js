import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
    try {
        const { amount } = await req.json();

        const instance = new Razorpay({
            key_id: "rzp_test_SQonzMTHGjREv2", // आपकी Key ID
            key_secret: "R2CvEZV71GIxGf40AHPXv5VO", // आपकी Secret Key
        });

        const options = {
            amount: Math.round(Number(amount) * 100), // पैसे (Paise) में
            currency: "INR",
            receipt: "vister_order_" + Date.now(),
        };

        const order = await instance.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}