import { Router } from "express";
import multer from "multer";
import path from "path";
import { db, applicants, applications } from "@workspace/db";
import { eq } from "drizzle-orm";
import { uploadFileToS3 } from "../lib/s3";

const router = Router();

// Buffer temporal en RAM para transferir a Supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // Límite de 8 MB
});

router.post(["/", "/applications"], upload.single("cv"), async (req, res) => {
  try {
    const { role, email, applicantId, jobId } = req.body || {};
    const cvFile = req.file;

    let targetApplicantId = applicantId;

    if (!targetApplicantId) {
      if (!email) {
        return res.status(400).json({ error: "Se requiere un correo electrónico." });
      }

      const [existingApplicant] = await db
        .select()
        .from(applicants)
        .where(eq(applicants.email, email));

      if (existingApplicant) {
        targetApplicantId = existingApplicant.id;
      } else {
        const [newApplicant] = await db
          .insert(applicants)
          .values({ email })
          .returning();
        targetApplicantId = newApplicant.id;
      }
    }

    let resumeUrl: string | null = null;

    // Subida a Supabase Storage
    if (cvFile) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(cvFile.originalname);
      const keyName = `cv-${uniqueSuffix}${ext}`;

      if (process.env.S3_ACCESS_KEY_ID) {
        resumeUrl = await uploadFileToS3(cvFile.buffer, keyName, cvFile.mimetype);
      } else {
        resumeUrl = `/uploads/${keyName}`;
      }
    }

    const [newApplication] = await db
      .insert(applications)
      .values({
        applicantId: targetApplicantId,
        jobId: jobId || null,
        roleApplied: role || null,
        resumeUrl,
        status: "recibido",
      })
      .returning();

    return res.status(201).json({
      message: "Postulación registrada con éxito",
      application: newApplication,
    });
  } catch (error: any) {
    console.error("Error al registrar postulación:", error);
    return res.status(500).json({
      error: error.message || "Error interno del servidor",
      detail: error.detail,
    });
  }
});

export default router;