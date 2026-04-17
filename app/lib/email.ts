import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail(
  to: string,
  status: "APPROVED" | "REJECTED"
) {
  const subject =
    status === "APPROVED"
      ? "Your Account Has Been Approved 🎉"
      : "Account Request Update";

  const html =
    status === "APPROVED"
      ? `
        <h2>Welcome to Amwin CRM 🚀</h2>
        <p>Your account has been approved.</p>
        <p>You can now log in and start using the platform.</p>
      `
      : `
        <h2>Account Update</h2>
        <p>We’re sorry, your account request was not approved.</p>
      `;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
  }
}