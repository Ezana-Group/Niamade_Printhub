// Cloudflare Pages Function: /api/bookings
// Handles both PrintHub website booking submissions and Easy!Appointments webhook events.

interface Env {
  SANITY_API_TOKEN?: string;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  EASYAPPOINTMENTS_URL?: string;
  EASYAPPOINTMENTS_API_TOKEN?: string;
  NOTIFICATION_EMAIL?: string;
  BOOKING_NOTIFICATION_EMAIL?: string;
  BOOKING_FROM_EMAIL?: string;
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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Vary": "Origin",
  };
}

export async function onRequestOptions(context: { request: Request }) {
  const headers = getCorsHeaders(context.request);
  return new Response(null, {
    status: 204,
    headers: {
      ...headers,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    },
  });
}

export async function onRequestGet(context: { request: Request }) {
  const headers = getCorsHeaders(context.request);
  return new Response(
    JSON.stringify({
      status: "online",
      service: "PrintHub Africa Bookings API",
      timestamp: new Date().toISOString(),
    }),
    {
      headers,
    }
  );
}

export async function onRequestPost(context: any) {
  const corsHeaders = getCorsHeaders(context.request);

  try {
    const rawBody = await context.request.json().catch(() => ({}));
    const data: Record<string, any> = rawBody || {};

    const projectId = context.env.SANITY_PROJECT_ID || "m7x6icn3";
    const dataset = context.env.SANITY_DATASET || "production";
    const token = context.env.SANITY_API_TOKEN;

    if (!token) {
      console.error("Missing SANITY_API_TOKEN environment variable in /api/bookings");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error: SANITY_API_TOKEN is missing" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Detect if this is an Easy!Appointments Webhook payload
    let customerName = data.customerName || data.name || "";
    let customerPhone = data.customerPhone || data.phone || data.whatsapp || "";
    let customerEmail = data.customerEmail || data.email || "";
    let service = data.service || "3D Print Feasibility & Slicing Check";
    let appointmentDate = data.appointmentDate || data.date || "";
    let appointmentTime = data.appointmentTime || data.time || "";
    let meetingType = data.meetingType || "whatsapp";
    let projectDetails = data.projectDetails || data.notes || data.message || "";
    let easyAppointmentsId = data.easyAppointmentsId || "";
    let source = data.source || "website";

    // Handle Easy!Appointments webhook structure
    if (data.event && (data.event.includes("appointment") || data.appointment)) {
      source = "easyappointments";
      const appt = data.appointment || data.data?.appointment || {};
      const cust = data.customer || data.data?.customer || {};
      const srv = data.service || data.data?.service || {};

      easyAppointmentsId = String(appt.id || appt.hash || "");
      if (cust.first_name || cust.last_name) {
        customerName = `${cust.first_name || ""} ${cust.last_name || ""}`.trim();
      }
      customerPhone = cust.phone_number || customerPhone;
      customerEmail = cust.email || customerEmail;
      service = srv.name || service;
      if (appt.start_datetime) {
        const parts = appt.start_datetime.split(" ");
        appointmentDate = parts[0] || appointmentDate;
        appointmentTime = parts[1] || appointmentTime;
      }
      projectDetails = appt.notes || projectDetails;
    }

    customerName = String(customerName).trim();
    customerPhone = String(customerPhone).trim();
    customerEmail = String(customerEmail).trim();
    service = String(service).trim();
    projectDetails = String(projectDetails).trim();

    if (!customerName) {
      return new Response(
        JSON.stringify({ success: false, error: "Customer name is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!customerPhone && !customerEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "A contact phone or email is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const bookingRef =
      data.bookingRef ||
      `PH-BK-${Math.floor(10000 + Math.random() * 90000)}`;

    const bookingDoc = {
      _type: "booking",
      bookingRef,
      customerName,
      customerPhone,
      customerEmail,
      service,
      appointmentDate: appointmentDate || new Date().toISOString().split("T")[0],
      appointmentTime: appointmentTime || "10:00 AM",
      meetingType,
      duration: Number(data.duration) || 30,
      projectDetails,
      status: "pending",
      adminNotes: "",
      easyAppointmentsId: String(easyAppointmentsId),
      source,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Sanity via Mutation API
    const sanityEndpoint = `https://${projectId}.api.sanity.io/v2023-08-01/data/mutate/${dataset}`;
    const sanityRes = await fetch(sanityEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mutations: [{ create: bookingDoc }],
      }),
    });

    if (!sanityRes.ok) {
      const errText = await sanityRes.text();
      console.error("Sanity booking save error:", errText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to record booking in database" }),
        { status: 502, headers: corsHeaders }
      );
    }

    // 2. Dispatch Email Alert to Admin
    const notificationEmail =
      context.env.BOOKING_NOTIFICATION_EMAIL ||
      context.env.NOTIFICATION_EMAIL ||
      "booking@printhub.africa";
    const resendKey = context.env.RESEND_API_KEY || "";

    if (resendKey) {
      try {
        const safeName = escapeHtml(customerName);
        const safePhone = escapeHtml(customerPhone);
        const safeEmail = escapeHtml(customerEmail);
        const safeService = escapeHtml(service);
        const safeDate = escapeHtml(appointmentDate);
        const safeTime = escapeHtml(appointmentTime);
        const safeMeetingType = meetingType === "in_person" ? "In-Person (Eldoret Studio)" : meetingType === "call" ? "Phone Call" : "WhatsApp Chat";
        const safeDetails = escapeHtml(projectDetails);
        const safeRef = escapeHtml(bookingRef);
        const safeSource = escapeHtml(source);
        const rawPhoneDigits = customerPhone.replace(/[^0-9]/g, "");

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: context.env.BOOKING_FROM_EMAIL || "PrintHub Bookings <onboarding@resend.dev>",
            to: [notificationEmail],
            subject: `📅 New Booking [${safeRef}]: ${safeName} (${safeService})`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; line-height: 1.6; color: #2B1D16;">
                <h2 style="color: #A6360A; margin-bottom: 4px;">New Booking Request Received</h2>
                <p style="color: #6E5C50; margin-top: 0;">Ref: <strong>${safeRef}</strong> • Source: <strong>${safeSource}</strong></p>
                <div style="background: #FFF8EE; border: 1px solid #EAD9C5; border-radius: 12px; padding: 18px; margin: 20px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold; width: 35%;">Customer:</td><td>${safeName}</td></tr>
                    <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Phone / WhatsApp:</td><td><a href="https://wa.me/${rawPhoneDigits}">${safePhone || "Not provided"}</a></td></tr>
                    <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${safeEmail || "Not provided"}</td></tr>
                    <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Service:</td><td>${safeService}</td></tr>
                    <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Date & Time:</td><td><strong>${safeDate}</strong> at <strong>${safeTime}</strong></td></tr>
                    <tr style="border-bottom: 1px solid #EAD9C5;"><td style="padding: 8px 0; font-weight: bold;">Meeting Type:</td><td>${safeMeetingType}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Project Notes:</td><td style="padding: 8px 0;">${safeDetails || "None provided"}</td></tr>
                  </table>
                </div>
                <p style="margin-top: 24px;">
                  <a href="https://printhub.africa/admin" style="display: inline-block; padding: 12px 24px; background-color: #A6360A; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Manage in Sanity Studio →</a>
                </p>
              </div>
            `,
          }),
        });
      } catch (err) {
        console.error("Resend booking email dispatch error:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        bookingRef,
        message: "Your booking request has been received and confirmed into PrintHub system.",
        booking: {
          ref: bookingRef,
          name: customerName,
          date: appointmentDate,
          time: appointmentTime,
          service,
        },
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "Internal server error processing booking",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
