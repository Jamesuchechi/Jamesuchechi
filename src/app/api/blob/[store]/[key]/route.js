import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  // This route was previously used for Netlify Blobs.
  // We are now hosting on Vercel and should use Vercel Blob or other storage.
  return NextResponse.json({ error: 'Blob storage not configured for this environment' }, { status: 501 });
}
