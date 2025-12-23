import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebaseAdmin';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `uploads/${timestamp}-${file.name}`;

    const useLocalUploads = process.env.USE_LOCAL_UPLOADS === 'true';
    const useNetlifyBlobs =
      process.env.NETLIFY === 'true' || process.env.USE_NETLIFY_BLOBS === 'true';
    const bucketName = (
      process.env.STORAGEBUCKET ||
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_STORAGEBUCKET ||
      ''
    ).trim();

    if (useNetlifyBlobs) {
      const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID;
      const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_TOKEN;
      if (!process.env.NETLIFY && (!siteID || !token)) {
        return NextResponse.json(
          {
            error:
              'Netlify Blobs is not configured. Set NETLIFY_BLOBS_SITE_ID and NETLIFY_BLOBS_TOKEN, or disable USE_NETLIFY_BLOBS.',
          },
          { status: 500 }
        );
      }
      const { getStore } = await import('@netlify/blobs');
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storeName = process.env.NETLIFY_BLOBS_STORE || 'uploads';
      const key = `${timestamp}-${safeName}`;
      const store =
        siteID && token ? getStore(storeName, { siteID, token }) : getStore(storeName);
      await store.set(key, buffer, {
        contentType: file.type || 'application/octet-stream',
      });
      const url = `/.netlify/blobs/${storeName}/${key}`;
      return NextResponse.json({ url, netlify: true });
    }

    if (useLocalUploads || !bucketName) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const localPath = path.join(uploadDir, `${timestamp}-${safeName}`);
      await writeFile(localPath, buffer);
      const url = `/uploads/${timestamp}-${safeName}`;
      return NextResponse.json({ url, local: true });
    }

    const bucket = adminStorage.bucket(bucketName);
    const fileRef = bucket.file(filename);

    await fileRef.save(buffer, {
      contentType: file.type || 'application/octet-stream',
      resumable: false,
    });

    const [url] = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    const details = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: 'Upload failed', details }, { status: 500 });
  }
}
