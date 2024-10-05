import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export async function handleFileUpload(file) {
  const ext = path.extname(file.name);
  const fileName = `${uuidv4()}${ext}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
  await fs.promises.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  return `/uploads/${fileName}`;
}

export async function deleteFile(filePath) {
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
}
