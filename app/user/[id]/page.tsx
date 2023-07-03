import FollowButton from '@/components/FollowButton/FollowButton';
import {getApiPath} from '@/lib/getApiPath';
import {User} from '@prisma/client';

import {Metadata} from 'next';

interface Props {
  params: {
    id: string;
  };
}
const getUserById = async (id: string) => {
  const user: User = await fetch(getApiPath('/api/user', {id})).then((res) =>
    res.json(),
  );
  return user;
};
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const user = await getUserById(params.id);
  return {title: `User profile of ${user?.name}`};
}

export default async function UserProfile({params}: Props) {
  const user = await getUserById(params.id);
  const {name, bio, image} = user ?? {};

  return (
    <div>
      <h1>{name}</h1>

      <img
        width={300}
        src={image ?? '/mememan.webp'}
        alt={`${name}'s profile`}
      />

      <h3>Bio</h3>
      <p>{bio}</p>

      <FollowButton targetUserId={params.id} />
    </div>
  );
}
