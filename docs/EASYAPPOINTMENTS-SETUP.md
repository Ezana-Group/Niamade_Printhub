# Easy!Appointments & Customer Booking Integration Guide

This document explains how **Easy!Appointments** (`/Users/mose/Downloads/easyappointments-1`) is integrated into **PrintHub Africa** (`printhub.africa`), how customer bookings are managed in **Sanity Studio**, and where buttons and forms have been placed.

---

## 1. Where to See Customer Bookings in Sanity Studio

Open your Sanity Content Studio at **`/admin`** (e.g. `https://printhub.africa/admin` or `http://localhost:4321/admin`):

In the left navigation sidebar, you will now see:
### 📅 Customer Bookings & Appointments
* 📋 **All Bookings**: Every appointment and consultation booked by customers, sorted with upcoming and newest requests first.
* ⏳ **Pending Confirmation**: Bookings awaiting initial contact or review.
* ✅ **Confirmed & Scheduled**: Approved consultations scheduled on the calendar.
* 🏁 **Completed Consultations**: Past completed appointments.
* ❌ **Cancelled**: Cancelled appointments for record-keeping.

### Booking Document Fields Available:
* **Booking Reference**: Unique code (e.g. `PH-BK-94821`)
* **Customer Info**: Full Name, WhatsApp / Phone number (+254...), Email
* **Service Requested**: 
  * 3D Print Feasibility & Slicing Check
  * Custom CAD Design & Modeling Session
  * Engineering Prototype & Mechanical Testing
  * In-Person Studio Visit (Eldoret)
  * Corporate Branding & Bulk Print Consultation
* **Appointment Date & Time**: Selected day and preferred time slot (in East Africa Time)
* **Meeting Mode**: In-person Studio Visit (Eldoret), WhatsApp Call, or Google Meet
* **Project Requirements / Notes**: Dimensions, intended use, preferred polymer, or questions
* **Internal Studio Notes**: Private notes for PrintHub staff
* **Status**: ⏳ Pending, ✅ Confirmed, 🏁 Completed, ❌ Cancelled
* **Easy!Appointments ID**: Correlating ID if synced from Easy!Appointments

---

## 2. Dedicated Booking Form at `printhub.africa/bookings`

The site has a dedicated booking page at **`src/pages/bookings.astro`** (`printhub.africa/bookings`):

1. **Native High-Converting Form**:
   * Interactive service selector with descriptions and estimated duration
   * Meeting mode selection (WhatsApp Call, Studio Visit in Eldoret, Google Meet)
   * Date and preferred time slot selector
   * Name, WhatsApp phone number, email, and project notes
   * On submit:
     * Saves directly into Sanity Content Studio via the `/api/bookings` endpoint.
     * Displays an instant confirmation screen with booking reference.
     * Includes a 1-click **"Open Instant WhatsApp Confirmation"** button pre-filled with the customer's booking reference and details.
     * Includes an **"Add to Google Calendar"** button.
2. **Easy!Appointments Embed Tab**:
   * When `easyAppointmentsUrl` is configured in Sanity Studio (`Site Settings` → `Bookings & Easy!Appointments`), visitors can switch to or view the embedded Easy!Appointments scheduler directly on `/bookings`!

---

## 3. Placement of Booking Buttons Across the Website

Booking consultation buttons and links have been integrated into:

1. **Header Navigation (`src/components/Header.astro`)**:
   * Added `Bookings` link directly into desktop navbar and mobile drawer menu (`/bookings/`).
2. **Footer (`src/components/Footer.astro`)**:
   * Added `Bookings` under the "Explore" link column.
   * Added `Book a studio visit or consultation →` under the "Say hello" / hours column.
3. **Homepage (`src/pages/index.astro`)**:
   * Added `<Icon name="calendar" /> Book Consultation` button in the Hero section beside "Explore What We Do" and WhatsApp.
   * Added `Book Consultation` button in the final dark CTA section.
4. **Contact Page (`src/pages/contact.astro`)**:
   * Added a prominent "Book a consultation" card (Studio visit or virtual call) in the contact options column.
   * Added "Book a studio slot →" directly inside the studio hours & Eldoret location card.
5. **Custom Orders Page (`src/pages/custom.astro`)**:
   * Added `<Icon name="calendar" /> Book Consultation` in the top hero route selector.
   * Added `<Icon name="calendar" /> Book Design Session` under "Route 2: I only have an idea".
6. **For Business Page (`src/pages/for-business.astro`)**:
   * Added `<Icon name="calendar" /> Book Consultation` in the commercial hero section.
7. **Sitemap & llms.txt (`src/pages/sitemap.xml.ts`, `src/pages/llms.txt.ts`)**:
   * Indexed `/bookings/` for search engines and AI assistants.

---

## 4. Connecting Your Easy!Appointments PHP Installation

If you run Easy!Appointments (from `/Users/mose/Downloads/easyappointments-1`) on a server (e.g. Docker, VPS, or subdomain `https://appointments.printhub.africa`):

### Option A: Webhook Synchronization (Easy!Appointments → Sanity)
Easy!Appointments has a built-in webhook system:
1. Log in to your Easy!Appointments admin panel (`/index.php/backend`).
2. Go to **Settings** → **Webhooks**.
3. Create a new webhook:
   * **Target URL**: `https://printhub.africa/api/bookings`
   * **Events**: Check `Appointment: Save` (or `appointment.save`)
4. Whenever a customer books in Easy!Appointments, it immediately posts the booking to `https://printhub.africa/api/bookings`, which creates a `booking` document in Sanity Studio!

### Option B: Embedding Easy!Appointments on `printhub.africa/bookings`
Easy!Appointments has `allow_iframe_embedding()` built-in:
1. Go to **Sanity Studio** (`/admin`).
2. Open **Business & Site Settings** → **📅 Bookings & Easy!Appointments** tab.
3. In **Easy!Appointments Installation URL**, enter your URL:
   `https://appointments.printhub.africa` (or your local URL for development)
4. Toggle **Show Embedded Easy!Appointments Scheduler** to **ON**.
5. Publish. The `/bookings` page will automatically show the scheduler!
