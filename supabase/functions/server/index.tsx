import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const NOTIFY_EMAIL = "anass.sriri@gmail.com";

// Send notification email via Resend
async function notifyNewSignup(signupEmail: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.log("RESEND_API_KEY not set, skipping email notification");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "BeiterOS Waitlist <onboarding@resend.dev>",
        to: [NOTIFY_EMAIL],
        subject: `New Waitlist Signup: ${signupEmail}`,
        html: `
          <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
            <div style="background: #111; border-radius: 16px; padding: 32px; color: #fff;">
              <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">
                <span style="color: #E31E24;">New Waitlist Signup</span>
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; color: #999;">Someone just joined the BeiterOS waitlist.</p>
              <div style="background: #1A1A1A; border-radius: 12px; padding: 16px; border: 1px solid rgba(255,255,255,0.08);">
                <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; font-weight: 700;">Email</p>
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #fff;">${signupEmail}</p>
              </div>
              <div style="margin-top: 16px; background: #1A1A1A; border-radius: 12px; padding: 16px; border: 1px solid rgba(255,255,255,0.08);">
                <p style="margin: 0 0 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; font-weight: 700;">Signed up at</p>
                <p style="margin: 0; font-size: 16px; font-weight: 600; color: #fff;">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Europe/Berlin" })}</p>
              </div>
            </div>
            <p style="text-align: center; margin: 20px 0 0; font-size: 11px; color: #bbb;">BeiterOS Pre-Launch Waitlist</p>
          </div>
        `,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.log(`Resend API error: ${JSON.stringify(data)}`);
    } else {
      console.log(`Notification email sent for signup: ${signupEmail}`);
    }
  } catch (err) {
    console.log(`Failed to send notification email: ${err}`);
  }
}

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5c3450e9/health", (c) => {
  return c.json({ status: "ok" });
});

// Waitlist email signup
app.post("/make-server-5c3450e9/waitlist", async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return c.json({ error: "A valid email is required." }, 400);
    }

    const trimmed = email.trim().toLowerCase();
    const key = `waitlist:${trimmed}`;

    // Check if already registered
    const existing = await kv.get(key);
    if (existing) {
      return c.json({ success: true, message: "Already registered." });
    }

    // Store email with timestamp
    await kv.set(key, {
      email: trimmed,
      signedUpAt: new Date().toISOString(),
    });

    // Send notification email (non-blocking)
    notifyNewSignup(trimmed).catch((err) =>
      console.log(`Background email notification error: ${err}`)
    );

    console.log(`Waitlist signup: ${trimmed}`);
    return c.json({ success: true, message: "Email registered." });
  } catch (err) {
    console.log(`Error saving waitlist email: ${err}`);
    return c.json({ error: `Failed to save email: ${err}` }, 500);
  }
});

// Get all waitlist emails (for admin review)
app.get("/make-server-5c3450e9/waitlist", async (c) => {
  try {
    const emails = await kv.getByPrefix("waitlist:");
    return c.json({ success: true, count: emails.length, emails });
  } catch (err) {
    console.log(`Error fetching waitlist: ${err}`);
    return c.json({ error: `Failed to fetch waitlist: ${err}` }, 500);
  }
});

// BeiterX notify signup (WhatsApp or Email)
app.post("/make-server-5c3450e9/beiterx-notify", async (c) => {
  try {
    const { contact, method } = await c.req.json();
    if (!contact || typeof contact !== "string" || !method) {
      return c.json({ error: "Contact and method are required." }, 400);
    }

    const trimmed = contact.trim().toLowerCase();
    const key = `beiterx:${method}:${trimmed}`;

    const existing = await kv.get(key);
    if (existing) {
      return c.json({ success: true, message: "Already registered." });
    }

    await kv.set(key, {
      contact: trimmed,
      method,
      signedUpAt: new Date().toISOString(),
    });

    // Notify admin
    notifyNewSignup(`[BeiterX ${method}] ${trimmed}`).catch((err) =>
      console.log(`Background email notification error: ${err}`)
    );

    console.log(`BeiterX notify signup: ${method} - ${trimmed}`);
    return c.json({ success: true, message: "Registered for notification." });
  } catch (err) {
    console.log(`Error saving BeiterX notify: ${err}`);
    return c.json({ error: `Failed to save: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);