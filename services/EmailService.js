import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendPasswordResetCode = async (email, code) => {
  const mailOptions = {
    from: '"Sistema de Recuperação" <noreply@sistema.com>',
    to: email,
    subject: "Código de Recuperação de Senha",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Recuperação de Senha</h2>
        <p>Você solicitou a recuperação de sua senha. Use o código abaixo:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
          ${code}
        </div>
        <p>Este código expira em 15 minutos.</p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado com sucesso:", info.messageId);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
};
