import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getConnectionById } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');
  const connectionId = searchParams.get('connectionId');
  if (!secret || !path || !connectionId) return new Response('Missing parameters', { status: 400 });
  const connection = await getConnectionById(connectionId);
  if (!connection) return new Response('Invalid Connection ID', { status: 401 });
  if (secret !== connection.previewSecret) return new Response('Invalid Secret', { status: 401 });
  draftMode().enable();
  redirect(path);
}