// lib/makePaymentRequest.js
import axios from "axios"

export const makePaymentRequest = axios.create({
    baseURL: process.env.BACKEND_URL, // Ajusta según tu configuración
    headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    },
})
