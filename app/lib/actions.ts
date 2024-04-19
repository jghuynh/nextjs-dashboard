'use server'; // mark all the exported functions within the file as server functions.
import { z } from 'zod';
import { sql } from '@vercel/postgres'; // to insert my new invoice values into database
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Validate the formData before saving it to database
 */
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // coerce the amount to a number, and then validate
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // Test it out:
  //   console.log(rawFormData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format creation date

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
  // insert invoices data into database. Update database

  // Since you're updating the data displayed in the invoices route,
  // you want to clear this cache and trigger a new request to the server
  revalidatePath('/dashboard/invoices');

  // redirect user back to dashboard/invoices after creating invoice. Makes sense
  redirect("/dashboard/invoices")
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
} catch (error) {
  return {
    message: "Database Error: Failed to update invoice"
  }
}

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return {
      message: "Database Error: Failed to delete invoice"
    }
  }


}