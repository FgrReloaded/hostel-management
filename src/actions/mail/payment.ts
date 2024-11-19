"use server"

import { Payment, Student } from '@prisma/client';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface StudentWithPayments extends Student {
  status: string;
  amount: number;
  payments: Payment[];
}

const generateTemplate = (student: StudentWithPayments) => {
  const lastDateOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  return `
Dear ${student.name},

This is a reminder that your monthly mess fee payment is due. Below are the details:

  Due Date: ${lastDateOfMonth.toDateString()}
  Amount to be Paid: ₹ ${student.amountToPay}

Please make the payment at the earliest to avoid any inconvenience.

For any questions or assistance, kindly contact the hostel warden's office.

Note: This is an automated email from SBPB Administration. Please do not reply to this email.

Thank you,
SBPB Administration
        `
}


export async function sendReminderEmail(student: StudentWithPayments) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Support <support@savitribaiphulebhawan.in>',
      to: student.email,
      subject: 'Your Student Portal Credentials',
      text: generateTemplate(student),
    });

    if (error) {
      return { error, msg: 'Failed to send email' };
    }
    return { data, msg: 'Email sent successfully' };
  } catch (error) {
    return { error, msg: 'Failed to send email' };
  }
}
