import UserCard from '@/components/UserCard/UserCard';
import styles from './page.module.css';
import {type User} from '@prisma/client';
import Pagination from '@/components/Pagination/Pagination';
import {getApiPath} from '@/lib/getApiPath';
type Props = {
  params: {page: string};
};
export default async function Users({params}: Props) {
  const page = parseInt(params.page, 10) || 1;
  const take = 8;
  const skip = (page - 1) * take;
  const {users, count}: {users: User[]; count: number} = await fetch(
    getApiPath('/api/allUsers', {take, skip}),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        tags: ['users'],
      },
    },
  ).then((res) => res.json());
  const totalPages = Math.ceil(count / take);

  return (
    <>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        linkPrefix="/users"
      />
      <div className={styles.grid}>
        {users.map((user) => (
          <UserCard key={user.id} {...user} />
        ))}
      </div>
    </>
  );
}
