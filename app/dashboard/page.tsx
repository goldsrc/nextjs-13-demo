import {getServerSession} from 'next-auth';
import {ProfileForm} from './ProfileForm';
import {redirect} from 'next/navigation';
import {SignOutButton} from '@/components/buttons';
import {authOptions} from '../api/auth/[...nextauth]/route';
import type {User} from '@prisma/client';
import {getApiPath} from '@/lib/getApiPath';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  const currentUserEmail = session?.user?.email!;
  const url = new URL(getApiPath('/api/user'));
  url.searchParams.append('email', currentUserEmail);
  const user: User = await fetch(url, {
    next: {
      tags: [`user_${currentUserEmail}`],
    },
  }).then((res) => res.json());

  if (!session || !user) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <h1>Dashboard</h1>
      <SignOutButton />
      <ProfileForm user={user} />
    </>
  );
}
