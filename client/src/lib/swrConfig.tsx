'use client';
import { SWRConfig } from 'swr';
import { fetchJson } from './fetcher';

export default function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ fetcher: (url) => fetchJson(url as string), shouldRetryOnError: false }}>
      {children}
    </SWRConfig>
  );
}
 