import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;
    let { email } = body;

    // Use environment variables if set, otherwise fallback to request data
    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    // Priority 1: Check environment variables for simple login
    if (envEmail && envPassword) {
      if (password === envPassword) {
        // Find existing admin or use a static one
        const admin = await prisma.admin.findUnique({
          where: { email: envEmail },
        });

        const adminData = admin 
          ? { id: admin.id, name: admin.name, email: admin.email }
          : { id: 'admin-env', name: 'Admin', email: envEmail };

        const token = jwt.sign(
          { id: adminData.id, email: adminData.email },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '7d' }
        );

        return NextResponse.json({ admin: adminData, token });
      }
    }

    // Priority 2: Fallback to database check (existing logic)
    if (!email || !password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      admin: { id: admin.id, name: admin.name, email: admin.email },
      token,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
