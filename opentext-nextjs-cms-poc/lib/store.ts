import fs from 'fs/promises';
import path from 'path';
import { Connection } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'connections.json');

async function ensureDir() {
  try { await fs.mkdir(path.dirname(DATA_FILE), { recursive: true }); } catch (e) {}
}

export async function getConnections(): Promise<Connection[]> {
  try {
    await ensureDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) { return []; }
}

export async function saveConnection(conn: Connection): Promise<void> {
  const all = await getConnections();
  const index = all.findIndex((c) => c.id === conn.id);
  if (index >= 0) all[index] = conn;
  else all.push(conn);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2));
}

export async function deleteConnection(id: string): Promise<void> {
  const all = await getConnections();
  const filtered = all.filter((c) => c.id !== id);
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));
}

export async function getConnectionById(id: string): Promise<Connection | undefined> {
  const all = await getConnections();
  return all.find((c) => c.id === id);
}