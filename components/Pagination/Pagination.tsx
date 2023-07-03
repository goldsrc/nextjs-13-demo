import Link from 'next/link';
import style from './Pagination.module.css';
type Props = {
  currentPage: number;
  totalPages: number;
  linkPrefix: string;
};
const Pagination = ({currentPage, totalPages, linkPrefix}: Props) => {
  return (
    <div className={style.pagination}>
      {currentPage > 1 && (
        <Link href={`${linkPrefix}/${currentPage - 1}`}>Previous</Link>
      )}
      <span>{currentPage}</span>
      {currentPage < totalPages && (
        <Link href={`${linkPrefix}/${currentPage + 1}`}>Next</Link>
      )}
    </div>
  );
};

export default Pagination;
