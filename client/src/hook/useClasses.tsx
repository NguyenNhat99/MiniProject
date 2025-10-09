'use client';
import useSWR from 'swr';
import { ClassItem } from '@/types';
import { ClassService } from '@/services/classService';

export default function useClasses() {
  const { data, error, isLoading, mutate } = useSWR<ClassItem[]>(
    // key nên khớp chính xác URL gọi
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/,'')}/api/class`
      : '/api/class',
    () => ClassService.getAll()
  );
  return { data, error, isLoading, mutate };
}
