import React from 'react';
import useSWR, { SWRResponse } from 'swr';

export function Gas({ className }: { className?: string }) {
  const {
    data,
    error,
  }: SWRResponse<
    { average: number },
    Error
  > = useSWR('https://ethgasstation.info/api/ethgasAPI.json?', (url) =>
    fetch(url).then((r) => r.json()),
  );

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return <div className={className}>{data.average / 10}</div>;
}
