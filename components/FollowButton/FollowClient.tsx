'use client';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import {useState, useTransition} from 'react';

interface Props {
  targetUserId: string;
  isFollowing: boolean;
}

export default function FollowClient({targetUserId, isFollowing}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {status} = useSession();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching || isPending;

  const follow = async () => {
    setIsFetching(true);

    await fetch('/api/follow', {
      method: 'POST',
      body: JSON.stringify({targetUserId}),
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        tags: [`follows:${targetUserId}`],
      },
    });

    setIsFetching(false);

    startTransition(() => {
      // Refresh the current route:
      // - Makes a new request to the server for the route
      // - Re-fetches data requests and re-renders Server Components
      // - Sends the updated React Server Component payload to the client
      // - The client merges the payload without losing unaffected
      //   client-side React state or browser state
      router.refresh();
    });
  };

  const unfollow = async () => {
    setIsFetching(true);

    await fetch(`/api/follow?targetUserId=${targetUserId}`, {
      method: 'DELETE',
    });

    setIsFetching(false);
    startTransition(() => router.refresh());
  };
  if (status !== 'authenticated') {
    return null;
  }
  if (isFollowing) {
    return (
      <button onClick={unfollow}>{!isMutating ? 'Unfollow' : '...'}</button>
    );
  }
  return <button onClick={follow}>{!isMutating ? 'Follow' : '...'}</button>;
}
