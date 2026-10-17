import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Asegurar carga de .env independientemente del orden de importación de módulos
const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "../../.env"),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    try {
      process.loadEnvFile(envPath);
    } catch {}
  }
}

export function getS3Client() {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY?.trim();
  const region = process.env.S3_REGION?.trim() || "us-east-1";

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "S3_ACCESS_KEY_ID o S3_SECRET_ACCESS_KEY no están definidos en las variables de entorno de api-server."
    );
  }

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true, // Imprescindible para Supabase S3
  });
}

export async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const s3 = getS3Client();
  const bucketName = process.env.S3_BUCKET_NAME?.trim() || "fortuna-cvs";

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  // URL pública directa de Supabase Storage
  if (process.env.S3_PUBLIC_URL) {
    return `${process.env.S3_PUBLIC_URL}/${fileName}`;
  }

  const endpoint = process.env.S3_ENDPOINT || "";
  return `${endpoint}/${bucketName}/${fileName}`;
}