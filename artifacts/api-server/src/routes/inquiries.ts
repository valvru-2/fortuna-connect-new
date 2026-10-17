import { Router } from "express";
import { db, companyInquiries } from "@workspace/db";

const router = Router();

async function sendEmailViaResend(to: string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY no encontrada en variables de entorno. Email omitido.");
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("❌ Error de Resend:", data);
    return false;
  }

  console.log("✅ Email enviado vía Resend:", data.id);
  return true;
}

// POST /api/inquiries
router.post(["/", "/inquiries"], async (req, res) => {
  try {
    const { company, contact, email, service, vacancies } = req.body || {};

    if (!company || !contact || !email || !service) {
      return res.status(400).json({ error: "Empresa, contacto, correo y servicio son obligatorios." });
    }

    const vacCount = parseInt(vacancies, 10) || 1;

    // 1. Guardar en Base de Datos PostgreSQL
    const [inquiry] = await db
      .insert(companyInquiries)
      .values({
        company,
        contact,
        email,
        service,
        vacancies: vacCount,
        status: "nueva",
      })
      .returning();

    const adminEmail = process.env.ADMIN_EMAIL || email;

    // 2. Alerta interna para el equipo de Fortuna
    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1120; color: #f3f6fb; padding: 32px; border-radius: 4px;">
        <h2 style="color: #91b4ff; margin-top: 0; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">Fortuna Connect · Nueva Solicitud B2B</h2>
        <p style="color: #cad3df; font-size: 15px;">Se ha registrado una nueva solicitud corporativa desde el portal:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; color: #ffffff; font-size: 14px;">
          <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 10px 0; color: #94a3b8;">Empresa:</td><td style="padding: 10px 0; font-weight: 600;">${company}</td></tr>
          <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 10px 0; color: #94a3b8;">Persona de contacto:</td><td style="padding: 10px 0; font-weight: 600;">${contact}</td></tr>
          <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 10px 0; color: #94a3b8;">Correo corporativo:</td><td style="padding: 10px 0; font-weight: 600;"><a href="mailto:${email}" style="color: #91b4ff;">${email}</a></td></tr>
          <tr style="border-bottom: 1px solid #1e293b;"><td style="padding: 10px 0; color: #94a3b8;">Servicio requerido:</td><td style="padding: 10px 0; font-weight: 600;">${service}</td></tr>
          <tr><td style="padding: 10px 0; color: #94a3b8;">Vacantes estimadas:</td><td style="padding: 10px 0; font-weight: 600;">${vacCount}</td></tr>
        </table>
      </div>
    `;

    // 3. Confirmación automática al cliente
    const clientHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff; color: #0b1120; padding: 36px; border: 1px solid #e2e8f0;">
        <h1 style="font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-top: 0; color: #0b1120;">FORTUNA CONNECT</h1>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">Estimado/a <strong>${contact}</strong>,</p>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          Hemos recibido correctamente la solicitud de consulta para <strong>${company}</strong> sobre nuestro servicio de <strong>${service}</strong>.
        </p>
        <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #475569;">
            Un consultor senior de nuestro equipo de talento corporativo revisará los requerimientos y se pondrá en contacto contigo en un plazo máximo de <strong>24 horas laborables</strong>.
          </p>
        </div>
        <p style="font-size: 13px; color: #64748b; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
          Fortuna Connect — Consultoría Independiente de Talento Ejecutivo & Advisory.<br>
          <a href="https://thefortunaconnect.com" style="color: #2563eb; text-decoration: none;">thefortunaconnect.com</a>
        </p>
      </div>
    `;

    // Enviar ambos correos en paralelo
    await Promise.allSettled([
      sendEmailViaResend([adminEmail], `🎯 Nueva Solicitud B2B: ${company}`, adminHtml),
      sendEmailViaResend([email], `Hemos recibido tu consulta — Fortuna Connect`, clientHtml),
    ]);

    return res.status(201).json({
      success: true,
      message: "Consulta registrada y notificaciones enviadas",
      inquiry,
    });
  } catch (error: any) {
    console.error("Error al registrar consulta B2B:", error);
    return res.status(500).json({ error: error.message || "Error interno al procesar la solicitud" });
  }
});

export default router;