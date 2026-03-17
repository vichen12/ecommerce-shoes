// lib/makePaymentRequest.js
import axios from "axios"

export const makePaymentRequest = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
})
