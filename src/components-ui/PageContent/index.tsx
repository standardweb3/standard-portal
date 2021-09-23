import { ReactNode } from 'react';

export const PageContent = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="px-8 flex flex-col items-center justify-start h-full w-full z-[1] overflow-auto pb-[10%]">
      {children}
    </div>
  );
};
