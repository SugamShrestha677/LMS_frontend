/**
 * /company — root redirect to /company/dashboard
 */
import { redirect } from 'next/navigation';

export default function CompanyRoot() {
  redirect('/company/dashboard');
}
