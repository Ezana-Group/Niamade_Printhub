// Cloudflare Worker entrypoint for PrintHub Africa
// Handles API routes (/api/paystack, /api/contact, /api/bookings) and serves static assets.

import { onRequestPost as handlePaystackPost, onRequestOptions as handlePaystackOptions } from "../functions/api/paystack";
import { onRequestPost as handleContactPost, onRequestOptions as handleContactOptions } from "../functions/api/contact";
import { onRequestPost as handleBookingsPost, onRequestOptions as handleBookingsOptions, onRequestGet as handleBookingsGet } from "../functions/api/bookings";

export interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  PAYSTACK_SECRET_KEY?: string;
  PUBLIC_PAYSTACK_KEY?: string;
  SANITY_API_TOKEN?: string;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  RESEND_API_KEY?: string;
  ORDER_NOTIFICATION_EMAIL?: string;
  ORDER_FROM_EMAIL?: string;
  NOTIFICATION_EMAIL?: string;
  QUOTES_NOTIFICATION_EMAIL?: string;
  QUOTES_FROM_EMAIL?: string;
  BOOKING_NOTIFICATION_EMAIL?: string;
  BOOKING_FROM_EMAIL?: string;
  EASYAPPOINTMENTS_URL?: string;
  EASYAPPOINTMENTS_API_TOKEN?: string;
  [key: string]: any;
}

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // ── 1. Paystack Webhook API ───────────────────────────────────────────
    if (url.pathname === "/api/paystack" || url.pathname === "/api/paystack/") {
      if (request.method === "OPTIONS") {
        return handlePaystackOptions();
      }
      if (request.method === "POST") {
        return handlePaystackPost({
          request,
          env,
          waitUntil: (promise: Promise<any>) => ctx.waitUntil(promise),
        });
      }
      return new Response("Method Not Allowed", { status: 405 });
    }

    // ── 2. Contact & Quote API ────────────────────────────────────────────
    if (url.pathname === "/api/contact" || url.pathname === "/api/contact/") {
      if (request.method === "OPTIONS") {
        return handleContactOptions({ request });
      }
      if (request.method === "POST") {
        return handleContactPost({
          request,
          env,
          waitUntil: (promise: Promise<any>) => ctx.waitUntil(promise),
        });
      }
      return new Response("Method Not Allowed", { status: 405 });
    }

    // ── 3. Studio Bookings API ────────────────────────────────────────────
    if (url.pathname === "/api/bookings" || url.pathname === "/api/bookings/") {
      if (request.method === "OPTIONS") {
        return handleBookingsOptions({ request });
      }
      if (request.method === "GET") {
        return handleBookingsGet({ request });
      }
      if (request.method === "POST") {
        return handleBookingsPost({
          request,
          env,
          waitUntil: (promise: Promise<any>) => ctx.waitUntil(promise),
        });
      }
      return new Response("Method Not Allowed", { status: 405 });
    }

    // ── 4. Fallback to Static Assets (Astro Pages) ────────────────────────
    return env.ASSETS.fetch(request);
  },
};
