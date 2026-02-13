import { NextResponse } from 'next/server';
import { getConnectionById } from '@/lib/store';
import { executeCmsRequest } from '@/lib/cms-client';
import { FetchRequest } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body: FetchRequest = await req.json();
    const connection = await getConnectionById(body.connectionId);
    if (!connection) return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    const result = await executeCmsRequest(connection, body.mode, body.lookupType, body.value);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}