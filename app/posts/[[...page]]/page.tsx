import Pagination from '@/components/Pagination/Pagination';
import {getApiPath} from '@/lib/getApiPath';
import {prisma} from '@/lib/prisma';
import {type Post} from '@prisma/client';
import Link from 'next/link';
type PostWithAuthor = Post & {author: {name: string}};

type Props = {
  params: {page: string};
};

export default async function Posts({params}: Props) {
  const page = parseInt(params.page, 10) || 1;
  const take = 100;
  const skip = (page - 1) * take;
  const posts = await prisma.post.findMany({
    take,
    skip,
    include: {
      author: true,
    },
  });
  const count = await prisma.post.count();
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
