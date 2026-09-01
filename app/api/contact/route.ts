import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT } from "@/lib/contact";

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isContactPayload(body: unknown): body is ContactPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.firstName === "string" &&
    typeof b.lastName === "string" &&
    typeof b.email === "string" &&
    typeof b.message === "string"
  );
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);

  if (!isContactPayload(body)) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const firstName = body.firstName.trim();
  const lastName = body.lastName.trim();
  const email = body.email.trim();
  const message = body.message.trim();

  if (!firstName || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Contact form isn't configured yet." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const { error } = await resend.emails.send({
    from: "Portfolio Contact Form <onboarding@resend.dev>",
    to: CONTACT.email,
    replyTo: email,
    subject: `New message from ${fullName}`,
    text: `From: ${fullName} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Couldn't send your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
