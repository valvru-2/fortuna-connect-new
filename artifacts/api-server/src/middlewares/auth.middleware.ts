import { Request, Response, NextFunction } from "express";

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-admin-token"];
  const expectedToken = process.env.ADMIN_SECRET_KEY;

  if (!expectedToken) {
    return res.status(500).json({ error: "ADMIN_SECRET_KEY no está configurada en el servidor" });
  }

  if (!token || token !== expectedToken) {
    return res.status(401).json({ error: "Acceso no autorizado" });
  }

  next();
}