import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    console.log("📨 Sending email to:", email);
    console.log("🔑 API KEY:", process.env.RESEND_API_KEY);
    console.log("📤 FROM:", process.env.EMAIL_FROM);

    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: process.env.TEST_EMAIL || "shashixcello@gmail.com",
      subject: "Test Email 🚀",
      html: `
        <h1>Amwin CRM</h1>
        <p>Your email system is working successfully ✅</p>
      `,
    });

    console.log("✅ RESEND RESPONSE:", data);

    return Response.json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error("❌ EMAIL ERROR:", error);

    return Response.json(
      {
        error: "Failed to send email",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}