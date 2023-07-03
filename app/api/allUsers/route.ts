import {prisma} from '@/lib/prisma';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const count = await prisma.user.count();
  const users = await prisma.user.findMany({
    skip: parseInt(params.get('skip') ?? '0'),
    take: parseInt(params.get('take') ?? '10'),
  });
  return NextResponse.json({users, count});
}
