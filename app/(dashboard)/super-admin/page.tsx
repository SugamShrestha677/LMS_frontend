/**
 * /super-admin — root redirect to /super-admin/dashboard
 */
import { redirect } from 'next/navigation';

export default function SuperAdminRoot() {
  redirect('/super-admin/dashboard');
}