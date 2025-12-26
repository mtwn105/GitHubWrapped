import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Supporter from "@/lib/models/Supporter";
import DodoPayments from "dodopayments";

// Our product ID for GitHub Wrapped donations
const DONATION_PRODUCT_ID = "pdt_utV5Od6d2mwisWqSUciJu";

// Initialize DodoPayments client
const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY || "",
  environment: process.env.NODE_ENV === "production" ? "live_mode" : "test_mode",
});

// Webhook payload types based on actual DodoPayments structure
interface ProductCartItem {
  product_id: string;
  quantity: number;
}

interface WebhookPayload {
  business_id: string;
  timestamp: string;
  type: string;
  data: {
    payment_id: string;
    status: string;
    customer: {
      customer_id: string;
      email: string;
      name: string;
      phone_number: string | null;
    };
    product_cart: ProductCartItem[];
    total_amount: number;
    currency: string;
    created_at: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;

    // Get all headers as a record
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    let event: WebhookPayload;

    // Verify and unwrap webhook using SDK
    if (webhookSecret) {
      try {
        event = client.webhooks.unwrap(rawBody, {
          headers,
          key: webhookSecret,
        }) as unknown as WebhookPayload;
      } catch (verifyError) {
        console.error("Webhook verification error:", verifyError);
        return NextResponse.json(
          { error: "Webhook verification failed" },
          { status: 401 }
        );
      }
    } else {
      // If no secret configured, use unsafe unwrap (not recommended for production)
      console.warn("DODO_WEBHOOK_SECRET not configured, using unsafe unwrap");
      event = client.webhooks.unsafeUnwrap(rawBody) as unknown as WebhookPayload;
    }

    // Only process successful payments
    if (event.type !== "payment.succeeded") {
      console.log(`Ignoring event type: ${event.type}`);
      return NextResponse.json({ received: true, status: "event_ignored" });
    }

    // Validate product_id - check if our donation product is in the cart
    const productCart = event.data.product_cart || [];
    const hasDonationProduct = productCart.some(
      (item) => item.product_id === DONATION_PRODUCT_ID
    );

    if (!hasDonationProduct) {
      console.log(
        `Ignoring payment - product_id not matching. Expected: ${DONATION_PRODUCT_ID}, Got: ${productCart.map((p) => p.product_id).join(", ")}`
      );
      return NextResponse.json({
        received: true,
        status: "product_not_matching",
      });
    }

    await dbConnect();

    const paymentId = event.data.payment_id;

    // Check if this payment was already processed (idempotency)
    const existingSupporter = await Supporter.findOne({ paymentId });
    if (existingSupporter) {
      console.log(`Payment ${paymentId} already processed`);
      return NextResponse.json({ received: true, status: "already_processed" });
    }

    // Extract customer info from payment data
    const customerName = event.data.customer?.name || "Anonymous Supporter";
    const customerEmail = event.data.customer?.email || "";
    const totalAmount = event.data.total_amount || 0;
    const currency = event.data.currency || "USD";

    // Create new supporter record
    const supporter = new Supporter({
      paymentId,
      name: customerName,
      email: customerEmail,
      amount: totalAmount / 100, // Convert from cents/paise to main currency unit
      currency,
      createdAt: new Date(),
      displayOnWall: true,
    });

    await supporter.save();
    console.log(
      `New supporter added: ${supporter.name} - ${currency} ${supporter.amount}`
    );

    return NextResponse.json({ received: true, status: "supporter_added" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Return 200 for GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" });
}
