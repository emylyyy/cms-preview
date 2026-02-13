import { NextResponse } from 'next/server';
import { getConnections, saveConnection, deleteConnection } from '@/lib/store';
import { Connection } from '@/lib/types';

export async function GET() {
  const cons = await getConnections();
  const masked = cons.map(c => ({
    ...c,
    authoringPassword: c.authoringPassword ? '********' : '',
    authoringToken: c.authoringToken ? '********' : '',
    deliveryPassword: c.deliveryPassword ? '********' : '',
    deliveryToken: c.deliveryToken ? '********' : '',
    deliveryApiKeyValue: c.deliveryApiKeyValue ? '********' : '',
    previewSecret: c.previewSecret ? '********' : '',
  }));
  return NextResponse.json(masked);
}

export async function POST(req: Request) {
  const body = await req.json();
  const existing = await getConnections();
  if (body.id) {
    const old = existing.find(c => c.id === body.id);
    if (old) {
       if (body.previewSecret === '********') body.previewSecret = old.previewSecret;
       if (body.authoringPassword === '********') body.authoringPassword = old.authoringPassword;
       if (body.authoringToken === '********') body.authoringToken = old.authoringToken;
       if (body.deliveryPassword === '********') body.deliveryPassword = old.deliveryPassword;
       if (body.deliveryToken === '********') body.deliveryToken = old.deliveryToken;
       if (body.deliveryApiKeyValue === '********') body.deliveryApiKeyValue = old.deliveryApiKeyValue;
    }
  } else { body.id = crypto.randomUUID(); }
  await saveConnection(body as Connection);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (id) await deleteConnection(id);
  return NextResponse.json({ success: true });
}