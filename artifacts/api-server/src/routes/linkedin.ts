import { Router } from "express";
import { db, applicants } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/auth/linkedin/callback", async (req, res) => {
  const { code, error, error_description } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (error) {
    console.error("LinkedIn OAuth error:", error, error_description);
    return res.redirect(`${frontendUrl}/?error=linkedin_cancelled#candidate`);
  }

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    // 1. Intercambiar el código por el Access Token
    const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID || "78vr5glq0apt4n",
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI || "http://localhost:5000/api/auth/linkedin/callback",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || "Token exchange failed");
    }

    // 2. Obtener los datos del perfil (OpenID Connect)
    const userinfoResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoResponse.json();
    if (!userinfoResponse.ok) {
      throw new Error("Failed to fetch LinkedIn profile");
    }

    // 3. Crear o actualizar postulante en la Base de Datos (Upsert seguro)
    let applicant;

    // Buscar si ya existe por linkedinId
    if (profile.sub) {
      const [byLinkedin] = await db
        .select()
        .from(applicants)
        .where(eq(applicants.linkedinId, profile.sub));

      if (byLinkedin) {
        [applicant] = await db
          .update(applicants)
          .set({
            firstName: profile.given_name || byLinkedin.firstName,
            lastName: profile.family_name || byLinkedin.lastName,
            email: profile.email || byLinkedin.email,
            pictureUrl: profile.picture || byLinkedin.pictureUrl,
            updatedAt: new Date(),
          })
          .where(eq(applicants.id, byLinkedin.id))
          .returning();
      }
    }

    // Si no se encontró por LinkedIn, verificar si ya existía por email
    if (!applicant && profile.email) {
      const [byEmail] = await db
        .select()
        .from(applicants)
        .where(eq(applicants.email, profile.email));

      if (byEmail) {
        [applicant] = await db
          .update(applicants)
          .set({
            linkedinId: profile.sub,
            firstName: profile.given_name || byEmail.firstName,
            lastName: profile.family_name || byEmail.lastName,
            pictureUrl: profile.picture || byEmail.pictureUrl,
            updatedAt: new Date(),
          })
          .where(eq(applicants.id, byEmail.id))
          .returning();
      }
    }

    // Si es un usuario nuevo, insertarlo
    if (!applicant) {
      [applicant] = await db
        .insert(applicants)
        .values({
          linkedinId: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          pictureUrl: profile.picture,
        })
        .returning();
    }

    // 4. Redirigir al formulario del frontend posicionando en #candidate
    const queryParams = new URLSearchParams({
      applicantId: applicant.id,
      email: applicant.email || "",
      firstName: applicant.firstName || "",
      lastName: applicant.lastName || "",
      pictureUrl: applicant.pictureUrl || "",
    });

    return res.redirect(`${frontendUrl}/?${queryParams.toString()}#candidate`);
  } catch (err: any) {
    console.error("LinkedIn Auth Error:", err);
    return res.redirect(`${frontendUrl}/?error=linkedin_auth_failed#candidate`);
  }
});

export default router;