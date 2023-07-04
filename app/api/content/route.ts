import {prisma} from '@/lib/prisma';
import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  if (params.has('slug')) {
    const post = await prisma.post.findUnique({
      where: {
        slug: params.get('slug')!,
      },
      include: {
        author: true,
      },
    });
    const posts = post ? [post] : [];

    return NextResponse.json({posts, count: posts.length + 1});
  }
  const count = await prisma.post.count();
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    skip: parseInt(params.get('skip') ?? '0'),
    take: parseInt(params.get('take') ?? '') || undefined,
  });
  return NextResponse.json({posts, count});
}
