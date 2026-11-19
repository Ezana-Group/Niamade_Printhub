// Cloudflare Pages Function: /api/contact
// Handles contact & quote inquiries, saves to Sanity, and dispatches email alert.

interface Env {
  SANITY_API_TOKEN?: string;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  NOTIFICATION_EMAIL?: string;
  RESEND_API_KEY?: string;
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function onRequestPost(context: any) {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const rawBody = await context.request.json().catch(() => ({}));
    const data: Record<string, any> = rawBody || {};

    const name = data.name || data.customerName || "";
    const phone = data.phone || data.whatsapp || "";
    const email = data.email || "";
    const service = data.service || data.svc || "General Quote Request";
    const material = data.material || data.mat || "Advise me";
    const quantity = Number(data.quantity || data.qty) || 1;
    const message = data.message || data.msg || "";

    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: "Name is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const projectId = context.env.SANITY_PROJECT_ID || "m7x6icn3";
    const dataset = context.env.SANITY_DATASET || "production";
    const token =
      context.env.SANITY_API_TOKEN ||
      "skygOrLXyMmWLsjwtorwFxjPeKvB0GuiuVuGQzX8EVUCekz5F47hrIDfU39i4iiBdThNKYOUKsSQFID0UhsfiyHDkgoynGxZHE2YJi28RLxEBctoJ7gPynRki1QM75knT1WSbVnjigmRSTpoqR3z7yNvnMgRELuI6hFhO7LuaQgrKjNnogO9";

    const inquiryDoc = {
      _type: "contactInquiry",
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      service: service.trim(),
      material: material.trim(),
      quantity,
      message: message.trim(),
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Sanity Studio
    if (token) {
      const sanityEndpoint = `https://${projectId}.api.sanity.io/v2023-08-01/data/mutate/${dataset}`;
      await fetch(sanityEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mutations: [{ create: inquiryDoc }],
        }),
      }).catch((e) => console.error("Sanity contact save error:", e));
    }

    // 2. Dispatch Email Notification
    const notificationEmail =
      context.env.NOTIFICATION_EMAIL || "printhubafrica3@gmail.com";
    const resendKey = context.env.RESEND_API_KEY || "";

    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "PrintHub Quotes <onboarding@resend.dev>",
            to: [notificationEmail],
            subject: `💬 New Quote Request from ${name} (${service})`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6; color: #2B1D16;">
                <h2 style="color: #A6360A;">New Quote Request on PrintHub Africa</h2>
                <p>A customer has requested a quote via <strong>printhub.africa/contact</strong>.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Customer:</td><td>${name}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Phone / WhatsApp:</td><td><a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}">${phone || "Not provided"}</a></td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${email || "Not provided"}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Need:</td><td>${service}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Material:</td><td>${material}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Quantity:</td><td>${quantity}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Details:</td><td>${message}</td></tr>
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
};
