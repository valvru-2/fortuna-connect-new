import { pgTable, text, timestamp, varchar, uuid, integer, pgEnum } from "drizzle-orm/pg-core";

// 1. Enums de estados
export const applicationStatusEnum = pgEnum("application_status", [
  "recibido",
  "en_revision",
  "entrevista",
  "oferta",
  "descartado",
]);

// 2. Tabla de Postulantes (DEBE definirse antes de las relaciones)
export const applicants = pgTable("applicants", {
  id: uuid("id").defaultRandom().primaryKey(),
  linkedinId: varchar("linkedin_id", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  pictureUrl: text("picture_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Tabla de Vacantes / Puestos
export const jobs = pgTable("jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  isActive: timestamp("is_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Tabla de Postulaciones (hace referencia a applicants y jobs)
export const applications = pgTable("applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicantId: uuid("applicant_id")
    .references(() => applicants.id, { onDelete: "cascade" })
    .notNull(),
  jobId: uuid("job_id")
    .references(() => jobs.id, { onDelete: "set null" }),
  roleApplied: varchar("role_applied", { length: 255 }),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  status: applicationStatusEnum("status").default("recibido").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Estados de seguimiento comercial para B2B
export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "nueva",
  "contactado",
  "en_reunion",
  "cerrado",
  "descartado",
]);

// Tabla de Consultas Corporativas (B2B Leads)
export const companyInquiries = pgTable("company_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  company: varchar("company", { length: 255 }).notNull(),
  contact: varchar("contact", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }), // opcional o extraído de contact
  service: varchar("service", { length: 255 }).notNull(),
  vacancies: integer("vacancies").default(1).notNull(),
  status: inquiryStatusEnum("status").default("nueva").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Exportación de tipos inferidos
export type Applicant = typeof applicants.$inferSelect;
export type NewApplicant = typeof applicants.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type CompanyInquiry = typeof companyInquiries.$inferSelect;
export type NewCompanyInquiry = typeof companyInquiries.$inferInsert;