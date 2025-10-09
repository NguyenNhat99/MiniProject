'use client';
import useSWR from 'swr';
import {  StudentItem } from '@/types';
import { StudentService } from '@/services/studentService';

export default function useStudents() {
  const { data, error, isLoading, mutate } = useSWR<StudentItem[]>(
    // key nên khớp chính xác URL gọi
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/+$/,'')}/api/student`
      : '/api/student',
    () => StudentService.getAll()
  );
  return { data, error, isLoading, mutate };
}
