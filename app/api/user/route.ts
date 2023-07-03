import {NextResponse, NextRequest} from 'next/server';
import {getServerSession} from 'next-auth';
import {prisma} from '@/lib/prisma';
import {authOptions} from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const reqId = req.nextUrl.searchParams.get('id');
  const reqEmail = req.nextUrl.searchParams.get('email');
  const session = await getServerSession(authOptions);
  const currentUserEmail = reqEmail || session?.user?.email!;
  const user = await prisma.user.findUnique({
    where: {
      id: reqId || undefined,
      email: currentUserEmail,
    },
  });
  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;

  const data = await req.json();
  data.age = Number(data.age);

  const user = await prisma.user.update({
    where: {
      email: currentUserEmail,
    },
    data,
  });

  return NextResponse.json(user);
}
