import Pagination from '@/components/Pagination/Pagination';
import {prisma} from '@/lib/prisma';
import Link from 'next/link';
import {cache} from 'react';

type Props = {
  params: {page: string};
};

export default async function Posts({params}: Props) {
  const page = parseInt(params.page, 10) || 1;
  const take = 10;
  const skip = (page - 1) * take;
  const getPosts = cache(async (take: number, skip: number) => {
    const [posts, count] = await Promise.all([
      prisma.post.findMany({
        take,
        skip,
        include: {
          author: true,
        },
      }),
      prisma.post.count(),
    ]);
    return {posts, count};
  });
  const {count, posts} = await getPosts(take, skip);
  const totalPages = Math.ceil(count / take);
  return (
    <div>
      <h1>Posts</h1>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        linkPrefix="/posts"
      />
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/post/${post.slug}`}>{post.title}</Link>
            {' - '}
            by {post.author.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
