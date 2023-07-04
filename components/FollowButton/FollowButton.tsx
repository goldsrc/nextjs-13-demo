'use client';
import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';

interface Props {
  targetUserId: string;
}

export default function FollowButton({targetUserId}: Props) {
  const [isFollowing, setIsFollowing] = useState<boolean>();
  const {status} = useSession();
  const [isFetching, setIsFetching] = useState(false);
  const isMutating = isFetching;

  useEffect(() => {
    const abortController = new AbortController();
    async function fetchFollows() {
      setIsFetching(true);
      const {follows} = await fetch(
        `/api/follow?targetUserId=${targetUserId}`,
        {
          signal: abortController.signal,
        },
      ).then((res) => res.json());
      setIsFollowing(follows);
      setIsFetching(false);
    }
    fetchFollows();
    return () => {
      abortController.abort();
    };
  }, [targetUserId]);

  const follow = async () => {
    setIsFetching(true);

    await fetch('/api/follow', {
      method: 'POST',
      body: JSON.stringify({targetUserId}),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    setIsFollowing(true);

    setIsFetching(false);
  };

  const unfollow = async () => {
    setIsFetching(true);

    await fetch(`/api/follow?targetUserId=${targetUserId}`, {
      method: 'DELETE',
    });

    setIsFollowing(false);

    setIsFetching(false);
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
