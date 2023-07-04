import {getApiPath} from '@/lib/getApiPath';
import FollowClient from './FollowClient';

interface Props {
  targetUserId: string;
}

export default async function FollowButton({targetUserId}: Props) {
  const {follows}: {follows: boolean} = await fetch(
    getApiPath('/api/follow', {targetUserId}),
    {
      next: {
        tags: [`follows:${targetUserId}`],
      },
    },
  ).then((res) => res.json());

  return <FollowClient targetUserId={targetUserId} isFollowing={!!follows} />;
}
