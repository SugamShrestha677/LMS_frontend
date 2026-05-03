/**
 * /admin — root redirect to /admin/dashboard
 * Next.js server component redirect (no client JS needed)
 */
import { redirect } from 'next/navigation';

export default function AdminRoot() {
  redirect('/admin/dashboard');
}
