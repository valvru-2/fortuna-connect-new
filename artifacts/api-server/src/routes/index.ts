import { Router, type IRouter } from "express";
import healthRouter from "./health";
import applicationsRouter from "./applications";
import linkedinRouter from "./linkedin";
import inquiriesRouter from "./inquiries"; // <-- Importar
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/applications", applicationsRouter);
router.use("/inquiries", inquiriesRouter); // <-- Montar /api/inquiries
router.use("/admin", adminRouter);
router.use(linkedinRouter);

export default router;