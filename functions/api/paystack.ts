// Cloudflare Pages Function: /api/paystack
// Handles Paystack webhook events (charge.success) to:
// 1. Verify payment signature
// 2. Update order in Sanity (paymentStatus: paid)
// 3. Send confirmation email to customer via Resend
// 4. Send notification email to booking@printhub.africa

interface Env {
  PAYSTACK_SECRET_KEY?: string;
  SANITY_API_TOKEN?: string;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  RESEND_API_KEY?: string;
  ORDER_NOTIFICATION_EMAIL?: string;
  ORDER_FROM_EMAIL?: string;
}

// Verify Paystack HMAC-SHA512 signature
async function verifyPaystackSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex === signature;
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-paystack-signature",
    },
  });
}

export async function onRequestPost(context: any) {
  const env: Env = context.env;
  const secret = env.PAYSTACK_SECRET_KEY || "";
  const rawBody = await context.request.text();
  const signature = context.request.headers.get("x-paystack-signature") || "";

  // ── 1. Verify webhook signature ──────────────────────────────────
  if (secret) {
    const valid = await verifyPaystackSignature(rawBody, signature, secret);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── 2. Only handle successful charges ───────────────────────────
  if (event.event !== "charge.success") {
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = event.data || {};
  const paystackRef = data.reference || "";
  const amountKes = Math.round((data.amount || 0) / 100); // Paystack sends kobo
  const customerEmail = data.customer?.email || "";
  const customerName = data.metadata?.name || data.customer?.first_name || "Customer";
  const customerPhone = data.metadata?.phone || "";
  const productName = data.metadata?.productName || "3D Print Order";
  const productSlug = data.metadata?.productSlug || "";
  const quantity = Number(data.metadata?.quantity) || 1;
  const size = data.metadata?.size || "";
  const colour = data.metadata?.colour || "";
  const customNote = data.metadata?.custom_note || "";
  const delivery = data.metadata?.delivery || "";
  const deliveryCity = data.metadata?.deliveryCity || "";
  const deliveryFeeKes = Number(data.metadata?.deliveryFeeKes) || 0;
  const subtotalKes = Number(data.metadata?.subtotalKes) || (amountKes - deliveryFeeKes);
  const orderRef = data.metadata?.orderRef || `PH-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const paidAt = new Date().toISOString();

  const projectId = env.SANITY_PROJECT_ID || "m7x6icn3";
  const dataset = env.SANITY_DATASET || "production";
  const token = env.SANITY_API_TOKEN || "";

  // ── 3. Save/update order in Sanity ──────────────────────────────
  if (token) {
    try {
      const sanityEndpoint = `https://${projectId}.api.sanity.io/v2023-08-01/data/mutate/${dataset}`;

      // Try to patch existing order first (by paystackRef), else create
      const patchRes = await fetch(sanityEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mutations: [
            {
              createOrReplace: {
                _type: "order",
                _id: `order-${paystackRef}`,
                orderRef,
                productName,
                productSlug,
                quantity,
                size,
                colour,
                customNote,
                delivery,
                deliveryCity,
                deliveryFeeKes,
                subtotalKes,
                amountKes,
                customerName,
                customerEmail,
                customerPhone,
                paymentStatus: "paid",
                paystackRef,
                paidAt,
                fulfilmentStatus: "queued",
                adminNotes: "",
                createdAt: paidAt,
              },
            },
          ],
        }),
      });

      if (!patchRes.ok) {
        const err = await patchRes.text();
        console.error("Sanity order save error:", err);
      }
    } catch (err) {
      console.error("Sanity fetch error:", err);
    }
  }

  const resendKey = env.RESEND_API_KEY || "";
  const notificationEmail = env.ORDER_NOTIFICATION_EMAIL || "booking@printhub.africa";
  const fromEmail = env.ORDER_FROM_EMAIL || "PrintHub Africa <booking@printhub.africa>";

  // ── 4a. Confirmation email → Customer ───────────────────────────
  if (resendKey && customerEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [customerEmail],
          subject: `✅ Order confirmed [${orderRef}] — ${productName}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6; color: #2B1D16;">
              <h2 style="color: #A6360A;">Payment received — your order is confirmed! 🎉</h2>
              <p>Hi ${customerName}, thank you for your order. We've received your payment and your item is heading into our print queue.</p>

              <div style="background: #FFF8EE; border: 1px solid #EAD9C5; border-radius: 12px; padding: 18px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #A6360A;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold; width: 40%;">Reference:</td><td>${orderRef}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Product:</td><td>${productName}</td></tr>
                  ${size ? `<tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Size:</td><td>${size}</td></tr>` : ""}
                  ${colour ? `<tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Colour:</td><td>${colour}</td></tr>` : ""}
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Quantity:</td><td>${quantity}</td></tr>
                  ${customNote ? `<tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Customisation:</td><td>${customNote}</td></tr>` : ""}
                  ${delivery ? `<tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Delivery:</td><td>${delivery}</td></tr>` : ""}
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Items Subtotal:</td><td>KES ${subtotalKes.toLocaleString()}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Delivery Fee:</td><td>${deliveryFeeKes === 0 ? "FREE" : `KES ${deliveryFeeKes.toLocaleString()}`}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: bold;">Total Paid:</td><td><strong>KES ${amountKes.toLocaleString()}</strong></td></tr>
                </table>
              </div>

              <h3 style="color: #A6360A;">What happens next?</h3>
              <ol style="padding-left: 20px;">
                <li style="margin-bottom: 8px;">We confirm your payment and add your order to the print queue (usually within 1 hour).</li>
                <li style="margin-bottom: 8px;">We'll send you a WhatsApp message with an estimated completion date and any clarifying questions.</li>
                <li style="margin-bottom: 8px;">Your item is printed, quality-checked, and dispatched or made ready for collection in Eldoret.</li>
              </ol>

              <p>Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/254792732929">+254 792 732 929</a>.</p>
              <p style="color: #6E5C50; font-size: 13px;">— The PrintHub Africa Team · Eldoret, Kenya · <a href="https://printhub.africa">printhub.africa</a></p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.error("Resend customer email error:", err);
    }
  }

  // ── 4b. Notification email → Admin ──────────────────────────────
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [notificationEmail],
          subject: `🛍️ New Order [${orderRef}]: ${customerName} — KES ${amountKes.toLocaleString()}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6; color: #2B1D16;">
              <h2 style="color: #A6360A;">New Paid Order — PrintHub Africa</h2>
              <p style="color: #6E5C50;">Ref: <strong>${orderRef}</strong> · Paystack: <strong>${paystackRef}</strong></p>
              <div style="background: #FFF8EE; border: 1px solid #EAD9C5; border-radius: 12px; padding: 18px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold; width: 40%;">Customer:</td><td>${customerName}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td><a href="https://wa.me/${customerPhone.replace(/[^0-9]/g, "")}">${customerPhone || "Not provided"}</a></td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${customerEmail || "Not provided"}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Product:</td><td>${productName}</td></tr>
                  ${size ? `<tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Size:</td><td>${size}</td></tr>` : ""}
                  ${colour ? `<tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Colour:</td><td>${colour}</td></tr>` : ""}
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Quantity:</td><td>${quantity}</td></tr>
                  ${customNote ? `<tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Customisation:</td><td>${customNote}</td></tr>` : ""}
                  ${delivery ? `<tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Delivery:</td><td>${delivery}</td></tr>` : ""}
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Items Subtotal:</td><td>KES ${subtotalKes.toLocaleString()}</td></tr>
                  <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Delivery Fee:</td><td>${deliveryFeeKes === 0 ? "FREE" : `KES ${deliveryFeeKes.toLocaleString()}`}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: bold;">Amount Paid:</td><td><strong>KES ${amountKes.toLocaleString()}</strong> ✅</td></tr>
                </table>
              </div>
              <p>
                <a href="https://printhub.africa/admin" style="display: inline-block; padding: 12px 24px; background-color: #A6360A; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Manage in Sanity Studio →</a>
              </p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.error("Resend admin notification error:", err);
    }
  }

  return new Response(JSON.stringify({ received: true, orderRef }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
