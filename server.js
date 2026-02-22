const express = require("express");
const QRCode = require("qrcode");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// ==================== SUPABASE SETUP ====================
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
  console.log("Supabase: Connected");
} else {
  console.warn("Supabase: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}



// ==================== EMAIL CONFIRMATION ROUTES ====================

// Resend confirmation email via Supabase built-in email service
app.post("/api/auth/resend-confirmation", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });

    // Use Supabase to resend the signup confirmation email
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Confirmation email resent successfully via Supabase" });
  } catch (err) {
    console.error("Resend confirmation error:", err.message);
    res.status(500).json({ error: "Failed to resend confirmation email" });
  }
});

// Admin endpoint: manually confirm a user's email (for testing)
app.post("/api/auth/confirm-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!supabase) return res.status(503).json({ error: "Supabase not configured" });

    // List users and find by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return res.status(500).json({ error: listError.message });

    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Confirm the user's email via admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    });

    if (updateError) return res.status(500).json({ error: updateError.message });

    res.json({ message: "Email confirmed successfully", userId: user.id });
  } catch (err) {
    console.error("Confirm email error:", err.message);
    res.status(500).json({ error: "Failed to confirm email" });
  }
});

// ==================== AUTH MIDDLEWARE ====================
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (!supabase) {
    return res.status(503).json({ error: "Supabase not configured" });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};

// ==================== AUTH ROUTES ====================

// Get current user profile
app.get("/api/profile", authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
app.put("/api/profile", authenticateUser, async (req, res) => {
  try {
    const { full_name, phone, avatar_url } = req.body;
    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name, phone, avatar_url, updated_at: new Date().toISOString() })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Get all users (admin/farmer route)
app.get("/api/users", authenticateUser, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (!profile || profile.role !== "farmer") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at");

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ==================== STRIPE SETUP ====================
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create Stripe Payment Intent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "inr", customerName, customerEmail } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: "Valid amount is required (minimum ₹1)" });
    }

    // Stripe expects amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency: currency,
      metadata: {
        customerName: customerName || "AgriTech Customer",
        platform: "AgriTech Marketplace",
      },
      description: `AgriTech Marketplace Order - ${customerName || "Customer"}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
    });
  } catch (error) {
    console.error("Stripe PaymentIntent error:", error.message);
    res.status(500).json({ error: error.message || "Payment creation failed" });
  }
});

// Verify Stripe Payment Status
app.get("/payment-status/:paymentIntentId", async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
    });
  } catch (error) {
    console.error("Payment status error:", error.message);
    res.status(500).json({ error: "Could not retrieve payment status" });
  }
});

// Stripe Webhook (optional — for production payment confirmation)
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (endpointSecret) {
      const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      
      switch (event.type) {
        case "payment_intent.succeeded":
          console.log("✅ Payment succeeded:", event.data.object.id);
          break;
        case "payment_intent.payment_failed":
          console.log("❌ Payment failed:", event.data.object.id);
          break;
        default:
          console.log(`Unhandled event: ${event.type}`);
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// ==================== UPI QR CODE ====================
// Default merchant UPI ID for receiving payments
const DEFAULT_MERCHANT_UPI = "yadarohit1235@okicici";

// API to generate UPI QR code dynamically
app.post("/generate-qr", async (req, res) => {
  try {
    const { upiId, name, amount } = req.body;

    // Use the default merchant UPI ID if none provided
    const payeeUpi = upiId || DEFAULT_MERCHANT_UPI;
    const payeeName = name || "AgriTech Marketplace";

    // UPI payment string (standard UPI deep link format)
    const upiString = `upi://pay?pa=${payeeUpi}&pn=${encodeURIComponent(payeeName)}&am=${amount || ""}&cu=INR`;

    // Generate QR image as base64 Data URL
    const qrImage = await QRCode.toDataURL(upiString, {
      width: 300,
      margin: 2,
      color: {
        dark: "#2d5016",
        light: "#ffffff",
      },
    });

    res.json({ qrImage, upiString });
  } catch (error) {
    console.error("QR generation error:", error);
    res.status(500).json({ error: "QR generation failed" });
  }
});

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.json({ 
    status: "AgriTech Server running",
    services: {
      stripe: !!process.env.STRIPE_SECRET_KEY ? "configured" : "missing STRIPE_SECRET_KEY in .env",
      supabase: supabase ? "connected" : "missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
      email: supabase ? "Supabase built-in" : "requires Supabase",
      upiQR: "active",
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AgriTech Server running on http://localhost:${PORT}`);
  console.log(`Stripe: ${process.env.STRIPE_SECRET_KEY ? "Configured" : "Add STRIPE_SECRET_KEY to .env"}`);
  console.log(`Supabase: ${supabase ? "Connected" : "Add SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY to .env"}`);
  console.log(`Email: Supabase built-in`);
  console.log(`UPI QR: Active`);
});
