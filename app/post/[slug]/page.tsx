import {type Post} from '@prisma/client';
import {getApiPath} from '@/lib/getApiPath';
export const revalidate = 1200; // not necessary, just for ISR demonstration

export async function generateStaticParams() {
  const {posts}: {posts: Post[]} = await fetch(getApiPath('/api/content'), {
    next: {
      tags: ['posts'],
    },
  }).then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface Props {
  params: {slug: string};
}

export default async function PostPage({params}: Props) {
  const {
    posts: [post],
  }: {posts: Post[]} = await fetch(
    getApiPath('/api/content', {slug: params.slug}),
    {
      next: {
        tags: [`post:${params.slug}`],
      },
    },
  ).then((res) => res.json());

  if (!post) {
    return <div>Post Not Found</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
