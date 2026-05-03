/**
 * /student — root redirect to /student/dashboard
 */
import { redirect } from 'next/navigation';

export default function StudentRoot() {
  redirect('/student/dashboard');
}
