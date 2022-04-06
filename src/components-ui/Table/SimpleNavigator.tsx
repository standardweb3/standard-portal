import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { classNames } from '../../functions';

export function SimpleNavigator({
  currentPage,
  handlePrevPage,
  handleNextPage,
  lastPage,
  pageSize,
  toPage,
}) {
  const [navigatorPage, setNavigatorPage] = useState(currentPage + 1 ?? 1);

  useEffect(() => {
    setNavigatorPage(currentPage + 1);
  }, [currentPage]);

  const handleNavigatorPageChange = (e) => {
    if (Number(e.target.value) > lastPage + 1) {
      setNavigatorPage(lastPage + 1);
    } else setNavigatorPage(e.target.value);
  };

  const handleKeyPress = (e) => {
    const kc = e.keyCode || e.which;

    if (e.key === '.') {
      e.preventDefault();
    } else if (kc === 13) {
      toPage(Number(e.target.value) - 1);
    }
  };

  return (
    <div className="flex justify-end items-center space-x-8 text-sm mt-8">
      <div className="flex items-center space-x-4">
        <div>Rows per page: {pageSize}</div>
      </div>

      <span>
        Page{' '}
        <input
          onKeyPress={handleKeyPress}
          type="number"
          value={navigatorPage}
          onChange={handleNavigatorPageChange}
          className="bg-opaque rounded-20 px-2 py-1 text-center"
          min={0}
          max={lastPage}
        />
        <span> of {lastPage + 1}</span>{' '}
      </span>

      <div className="flex items-center space-x-4">
        {/* <button onClick={handleFirstPage} disabled={!canPreviousPage}>
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            </button>{' '} */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 0}
          className={classNames(currentPage === 0 && 'text-grey')}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>{' '}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= lastPage}
          className={classNames(currentPage === lastPage && 'text-grey')}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>{' '}
        {/* <button onClick={handleLastPage} disabled={!canNextPage}>
              <ChevronDoubleRightIcon className="w-5 h-5" />
            </button>{' '} */}
      </div>
      {/* <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '} */}
    </div>
  );
}
