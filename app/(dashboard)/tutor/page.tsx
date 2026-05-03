/**
 * /tutor — root redirect to /tutor/dashboard
 */
import { redirect } from 'next/navigation';

export default function TutorRoot() {
  redirect('/tutor/dashboard');
}