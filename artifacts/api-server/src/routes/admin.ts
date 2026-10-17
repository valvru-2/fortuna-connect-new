import { Router } from "express";
import { db, applications, applicants, jobs, companyInquiries } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdminAuth } from "../middlewares/auth.middleware";

const router = Router();

// Proteger todas las rutas administrativas
router.use(requireAdminAuth);

// Métricas generales para el dashboard
router.get("/metrics", async (_req, res) => {
  try {
    const allApps = await db.select().from(applications);
    const allJobs = await db.select().from(jobs);
    const allInquiries = await db.select().from(companyInquiries);

    return res.json({
      totalApplications: allApps.length,
      totalJobs: allJobs.length,
      totalInquiries: allInquiries.length,
      inReview: allApps.filter((a) => a.status === "en_revision" || a.status === "entrevista").length,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 1. Postulaciones (Applications)
router.get("/applications", async (_req, res) => {
  try {
    const result = await db
      .select({
        id: applications.id,
        applicantId: applications.applicantId,
        firstName: applicants.firstName,
        lastName: applicants.lastName,
        email: applicants.email,
        pictureUrl: applicants.pictureUrl,
        linkedinId: applicants.linkedinId,
        jobId: applications.jobId,
        jobTitle: jobs.title,
        roleApplied: applications.roleApplied,
        resumeUrl: applications.resumeUrl,
        coverLetter: applications.coverLetter,
        status: applications.status,
        createdAt: applications.createdAt,
        updatedAt: applications.updatedAt,
      })
      .from(applications)
      .leftJoin(applicants, eq(applications.applicantId, applicants.id))
      .leftJoin(jobs, eq(applications.jobId, jobs.id))
      .orderBy(desc(applications.createdAt));

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, roleApplied, coverLetter, applicantId, firstName, lastName, email } = req.body;

    const [updated] = await db
      .update(applications)
      .set({
        ...(status && { status }),
        ...(roleApplied !== undefined && { roleApplied }),
        ...(coverLetter !== undefined && { coverLetter }),
        updatedAt: new Date(),
      })
      .where(eq(applications.id, id))
      .returning();

    // Si también se modificaron datos del candidato, actualizarlos en la tabla applicants
    if (applicantId && (firstName !== undefined || lastName !== undefined || email !== undefined)) {
      await db
        .update(applicants)
        .set({
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(email !== undefined && { email }),
          updatedAt: new Date(),
        })
        .where(eq(applicants.id, applicantId));
    }

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/applications/:id", async (req, res) => {
  try {
    await db.delete(applications).where(eq(applications.id, req.params.id));
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 2. Candidatos (Applicants)
router.get("/applicants", async (_req, res) => {
  try {
    const list = await db.select().from(applicants).orderBy(desc(applicants.createdAt));
    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/applicants/:id", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const [updated] = await db
      .update(applicants)
      .set({
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
        updatedAt: new Date(),
      })
      .where(eq(applicants.id, req.params.id))
      .returning();

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/applicants/:id", async (req, res) => {
  try {
    await db.delete(applicants).where(eq(applicants.id, req.params.id));
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 3. Vacantes / Puestos (Jobs)
router.get("/jobs", async (_req, res) => {
  try {
    const list = await db.select().from(jobs).orderBy(desc(jobs.createdAt));
    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/jobs", async (req, res) => {
  try {
    const { title, department, location, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio." });
    }
    const [newJob] = await db
      .insert(jobs)
      .values({ title, department, location, description })
      .returning();
    return res.status(201).json(newJob);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/jobs/:id", async (req, res) => {
  try {
    const { title, department, location, description } = req.body;
    const [updated] = await db
      .update(jobs)
      .set({
        ...(title !== undefined && { title }),
        ...(department !== undefined && { department }),
        ...(location !== undefined && { location }),
        ...(description !== undefined && { description }),
      })
      .where(eq(jobs.id, req.params.id))
      .returning();
    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/jobs/:id", async (req, res) => {
  try {
    await db.delete(jobs).where(eq(jobs.id, req.params.id));
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 4. Consultas B2B / Leads Comerciales
router.get("/inquiries", async (_req, res) => {
  try {
    const list = await db.select().from(companyInquiries).orderBy(desc(companyInquiries.createdAt));
    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/inquiries/:id", async (req, res) => {
  try {
    const { company, contact, email, service, vacancies, status, notes } = req.body;
    const [updated] = await db
      .update(companyInquiries)
      .set({
        ...(company !== undefined && { company }),
        ...(contact !== undefined && { contact }),
        ...(email !== undefined && { email }),
        ...(service !== undefined && { service }),
        ...(vacancies !== undefined && { vacancies: Number(vacancies) || 1 }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date(),
      })
      .where(eq(companyInquiries.id, req.params.id))
      .returning();

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/inquiries/:id", async (req, res) => {
  try {
    await db.delete(companyInquiries).where(eq(companyInquiries.id, req.params.id));
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;