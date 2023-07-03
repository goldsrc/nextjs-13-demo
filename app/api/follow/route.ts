import {NextRequest, NextResponse} from 'next/server';
import {getServerSession} from 'next-auth';
import {prisma} from '@/lib/prisma';
import {authOptions} from '../auth/[...nextauth]/route';
import {revalidateTag} from 'next/cache';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;
  const targetUserId = req.nextUrl.searchParams.get('targetUserId');
  if (!currentUserEmail) {
    return NextResponse.json({follows: false});
  }
  const currentUserId = await prisma.user
    .findUnique({where: {email: currentUserEmail}})
    .then((user) => user?.id!);

  const record = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId!,
      },
    },
  });

  return NextResponse.json({follows: Boolean(record)});
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email;

  if (!currentUserEmail)
    return NextResponse.json({error: 'Session Missing'}, {status: 401});

  const response = await req.json();

  const targetUserId: string | undefined = response.targetUserId;

  if (!targetUserId)
    return NextResponse.json({error: 'Missing targetUserId'}, {status: 400});

  const currentUserId = await prisma.user
    .findUnique({where: {email: currentUserEmail}})
    .then((user) => user?.id);

  if (!currentUserId)
    return NextResponse.json({error: 'Auth Error'}, {status: 403});

  const record = await prisma.follows.create({
    data: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  revalidateTag(`follows:${targetUserId}`);

  return NextResponse.json(record);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email!;
  const targetUserId = req.nextUrl.searchParams.get('targetUserId');

  const currentUserId = await prisma.user
    .findUnique({where: {email: currentUserEmail}})
    .then((user) => user?.id!);

  const record = await prisma.follows.delete({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId!,
      },
    },
  });

  return NextResponse.json(record);
}
