/**
 * /staff — root redirect to /staff/dashboard
 */
import { redirect } from 'next/navigation';

export default function StaffRoot() {
  redirect('/staff/dashboard');
}
