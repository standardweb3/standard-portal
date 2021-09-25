import { ReactNode } from 'react';

export const PageContent = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="px-8 flex flex-col items-center justify-start w-full mb-[10%]">
      {children}
    </div>
  );
};
