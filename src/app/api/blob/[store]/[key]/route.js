import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { store: storeName, key } = params || {};

  if (!storeName || !key) {
    return NextResponse.json({ error: 'Missing store or key' }, { status: 400 });
  }

  try {
    const { getStore } = await import('@netlify/blobs');
    const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID;
    const token =
      process.env.NETLIFY_BLOBS_TOKEN ||
      process.env.NETLIFY_AUTH_TOKEN ||
      process.env.NETLIFY_TOKEN;
    const store = siteID && token ? getStore(storeName, { siteID, token }) : getStore(storeName);
    const result = await store.getWithMetadata(key, { type: 'arrayBuffer' });

    if (!result || !result.data) {
      return NextResponse.json({ error: 'Blob not found' }, { status: 404 });
    }

    const contentType = result.metadata?.contentType || 'application/octet-stream';

    return new NextResponse(Buffer.from(result.data), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Blob fetch error:', error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Failed to fetch blob', details }, { status: 500 });
  }
}
