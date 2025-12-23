import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Save to database
    const contactData = {
      name: body.name,
      email: body.email,
      message: body.message,
      createdAt: new Date().toISOString(),
    };
    const docRef = await adminDb.collection('contacts').add(contactData);
    const contact = { id: docRef.id, ...contactData };

    // Send email notifications (if configured)
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.ADMIN_EMAIL) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Email to admin
        const adminMailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `New Contact Form Submission from ${body.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
              <div style="background-color: #000; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: #fff; margin: 0;">New Contact Message</h2>
              </div>
              <div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">You have received a new message from your portfolio contact form:</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: bold;">FROM:</p>
                  <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px;">${body.name}</p>
                  
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: bold;">EMAIL:</p>
                  <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px;">${body.email}</p>
                  
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: bold;">MESSAGE:</p>
                  <p style="margin: 0; color: #111827; font-size: 16px; line-height: 1.6;">${body.message}</p>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
                  You can reply directly to <a href="mailto:${body.email}" style="color: #000; text-decoration: none; font-weight: bold;">${body.email}</a>
                </p>
              </div>
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p>This email was sent from your portfolio contact form</p>
              </div>
            </div>
          `,
        };

        // Auto-reply to sender
        const senderMailOptions = {
          from: process.env.EMAIL_USER,
          to: body.email,
          subject: `Thank you for contacting ${process.env.ADMIN_NAME || 'me'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
              <div style="background-color: #000; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: #fff; margin: 0;">Thank You for Getting in Touch!</h2>
              </div>
              <div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px;">
                <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Hi ${body.name},</p>
                
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 20px;">
                  Thank you for reaching out! I've received your message and will get back to you as soon as possible.
                </p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; font-weight: bold;">YOUR MESSAGE:</p>
                  <p style="margin: 0; color: #111827; font-size: 14px; line-height: 1.6;">${body.message}</p>
                </div>
                
                <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 20px;">
                  I typically respond within 24-48 hours. If your inquiry is urgent, feel free to reach out through other channels.
                </p>
                
                <p style="font-size: 16px; color: #374151; margin-top: 30px;">
                  Best regards,<br>
                  <strong>${process.env.ADMIN_NAME || 'James Uchechi'}</strong>
                </p>
              </div>
              <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
                <p>This is an automated response. Please do not reply to this email.</p>
              </div>
            </div>
          `,
        };

        // Send both emails
        await Promise.all([
          transporter.sendMail(adminMailOptions),
          transporter.sendMail(senderMailOptions),
        ]);

        console.log('✅ Emails sent successfully');
      } else {
        console.log('⚠️ Email configuration not set. Skipping email notifications.');
      }
    } catch (emailError) {
      console.error('❌ Error sending emails:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      message: 'Contact form submitted successfully', 
      contact 
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}

// GET all contact submissions (for admin)
export async function GET() {
  try {
    const snapshot = await adminDb.collection('contacts').get();
    const contacts = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    contacts.sort((a, b) => {
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
