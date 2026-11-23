// Cloudflare Pages Function: /api/contact
// Handles contact & quote inquiries, saves to Sanity, and dispatches email alert.

interface Env {
  SANITY_API_TOKEN?: string;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  NOTIFICATION_EMAIL?: string;
  QUOTES_NOTIFICATION_EMAIL?: string;
  QUOTES_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
}

function escapeHtml(str: unknown): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getCorsHeaders(request: Request) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = [
    "https://printhub.africa",
    "https://www.printhub.africa",
    "http://localhost:4321",
    "http://localhost:3000",
    "http://127.0.0.1:4321",
  ];
  const isAllowed = allowedOrigins.includes(origin) ||
    origin.endsWith(".pages.dev") ||
    origin.endsWith(".printhub.africa");

  const allowOrigin = isAllowed ? origin : "https://printhub.africa";

  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Vary": "Origin",
  };
}

export async function onRequestOptions(context: { request: Request }) {
  const headers = getCorsHeaders(context.request);
  return new Response(null, {
    status: 204,
    headers: {
      ...headers,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function onRequestPost(context: any) {
  const corsHeaders = getCorsHeaders(context.request);

  try {
    const rawBody = await context.request.json().catch(() => ({}));
    const data: Record<string, any> = rawBody || {};

    const name = String(data.name || data.customerName || "").trim();
    const phone = String(data.phone || data.whatsapp || "").trim();
    const email = String(data.email || "").trim();
    const service = String(data.service || data.svc || "General Quote Request").trim();
    const material = String(data.material || data.mat || "Advise me").trim();
    const quantity = Number(data.quantity || data.qty) || 1;
    const message = String(data.message || data.msg || "").trim();

    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: "Name is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const projectId = context.env.SANITY_PROJECT_ID || "m7x6icn3";
    const dataset = context.env.SANITY_DATASET || "production";
    const token = context.env.SANITY_API_TOKEN;

    if (!token) {
      console.error("Missing SANITY_API_TOKEN environment variable in /api/contact");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error: SANITY_API_TOKEN is missing" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const inquiryDoc = {
      _type: "contactInquiry",
      name,
      phone,
      email,
      service,
      material,
      quantity,
      message,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Sanity Studio
    const sanityEndpoint = `https://${projectId}.api.sanity.io/v2023-08-01/data/mutate/${dataset}`;
    const sanityRes = await fetch(sanityEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mutations: [{ create: inquiryDoc }],
      }),
    });

    if (!sanityRes.ok) {
      const errText = await sanityRes.text();
      console.error("Sanity contact save error:", errText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to record inquiry in database" }),
        { status: 502, headers: corsHeaders }
      );
    }

    // 2. Dispatch Email Notification
    const notificationEmail =
      context.env.QUOTES_NOTIFICATION_EMAIL ||
      context.env.NOTIFICATION_EMAIL ||
      "quotes@printhub.africa";
    const resendKey = context.env.RESEND_API_KEY || "";

    if (resendKey) {
      try {
        const safeName = escapeHtml(name);
        const safePhone = escapeHtml(phone);
        const safeEmail = escapeHtml(email);
        const safeService = escapeHtml(service);
        const safeMaterial = escapeHtml(material);
        const safeMessage = escapeHtml(message);
        const rawPhoneDigits = phone.replace(/[^0-9]/g, "");

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: context.env.QUOTES_FROM_EMAIL || "PrintHub Quotes <onboarding@resend.dev>",
            to: [notificationEmail],
            subject: `💬 New Quote Request from ${safeName} (${safeService})`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6; color: #2B1D16;">
                <h2 style="color: #A6360A;">New Quote Request on PrintHub Africa</h2>
                <p>A customer has requested a quote via <strong>printhub.africa/contact</strong>.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Customer:</td><td>${safeName}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Phone / WhatsApp:</td><td><a href="https://wa.me/${rawPhoneDigits}">${safePhone || "Not provided"}</a></td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${safeEmail || "Not provided"}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Need:</td><td>${safeService}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Material:</td><td>${safeMaterial}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Quantity:</td><td>${quantity}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Details:</td><td>${safeMessage}</td></tr>
                </table>
                <p><a href="https://printhub.africa/admin" style="display: inline-block; padding: 12px 24px; background-color: #A6360A; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">View in Sanity Studio</a></p>
              </div>
            `,
          }),
        });
      } catch (err) {
        console.error("Resend email dispatch error:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your inquiry has been recorded and routed to PrintHub team.",
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
