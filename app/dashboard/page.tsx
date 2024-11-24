import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();
  console.log(session);
  if (!session?.user) {
    return redirect('/test');
  } else {
    redirect('/dashboard/overview');
  }
}
