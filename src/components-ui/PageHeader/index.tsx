import { ChevronLeftIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { StndAdder } from '../TokenAdder/StndAdder';

export type PageHeaderProps = {
  title: string;
  back?: boolean;
  href?: string;
};

export const PageHeader = ({ title, back, href }: PageHeaderProps) => {
  const router = useRouter();
  const handleClick = useCallback(() => {
    if (href) router.push(href);
    else router.back();
  }, [router, href]);
  return (
    <div
      className={`
      flex p-8 
      text-2xl font-semibold capitalize
      justify-between
      text-text
      z-[1]
    `}
    >
      <div className="flex items-center space-x-2">
        {back && (
          <button onClick={handleClick}>
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        )}
        <h1>{title}</h1>
      </div>
      <StndAdder />
    </div>
  );
};
