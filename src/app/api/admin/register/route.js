import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST() {
  return NextResponse.json(
    { error: 'Registration is disabled for this portfolio.' },
    { status: 403 }
  );
}
