'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { ClassService } from '@/services/classService';
import { ClassItem, StudentCreate, StudentItem } from '@/types';
import useStudents from '@/hook/useStudents';
import { StudentService } from '@/services/studentService';
import { formatDate } from './common';

function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
    </svg>
  );
}

function TopProgress({ show }: { show: boolean }) {
  return (
    <div
      className={`absolute left-0 right-0 top-0 h-0.5 overflow-hidden ${show ? 'block' : 'hidden'}`}
      aria-hidden={!show}
    >
      <div className="h-full w-1/2 animate-[progress_1.2s_ease-in-out_infinite] bg-blue-600 origin-left" />
      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%) scaleX(0.2);
          }
          50% {
            transform: translateX(50%) scaleX(0.7);
          }
          100% {
            transform: translateX(200%) scaleX(0.2);
          }
        }
      `}</style>
    </div>
  );
}

type ModalMode = 'create' | 'edit';

export default function StudentListPage() {
  const [query, setQuery] = useState('');
  const { data, error, isLoading, mutate } = useStudents();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<StudentCreate>({
    name: '',
    studentCode: '',
    description: '',
    birthDay: new Date(),
    classRoomId: null,
  });

  const list = data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((d) =>
      [String(d.id), d.name ?? '', d.studentCode ?? ''].some((v) => v.toLowerCase().includes(q))
    );
  }, [list, query]);

  // Open modal helpers
  function openCreate() {
    setMode('create');
    setEditingId(null);
    setForm({
      name: '',
      studentCode: '',
      description: '',
      birthDay: new Date(),
      classRoomId: null,
    });
    setIsOpen(true);
  }

  function openEdit(item: StudentItem) {
    setMode('edit');
    setEditingId(item.id);
    setForm({
      name: item.name,
      studentCode: item.studentCode,
      birthDay: new Date(item.birthDay),
      description: item.description,
      classRoomId: item.classRoomId ?? null,
    });
    setIsOpen(true);
  }

  function closeModal() {
    if (isSubmitting) return; // tránh đóng khi đang submit
    setIsOpen(false);
  }

  // SUBMIT — gọi API thật + cập nhật SWR
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (mode === 'create') {
        await mutate(
          async (current) => {
            const created = await StudentService.create({
              name: form.name,
              classRoomId: form.classRoomId,
              birthDay: form.birthDay,
              description: form.description,
              studentCode: form.studentCode,
            });
            return [created, ...((current as StudentItem[]) ?? [])];
          },
          { revalidate: false, rollbackOnError: true }
        );
      } else if (mode === 'edit' && editingId != null) {
        await mutate(
          async (current) => {
            await StudentService.update(editingId!, {
              name: form.name,
              classRoomId: form.classRoomId,
              birthDay: form.birthDay,
              description: form.description,
              studentCode: form.studentCode,
            });
            return (current ?? []).map((c) =>
              c.id === editingId ? { ...c, ...form } : c
            );
          },
          { revalidate: true, rollbackOnError: true }
        );
      }
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn có đồng ý xóa sinh viên này không ?')) return;
    setDeletingId(id);
    try {
      await mutate(
        async (current) => {
          await StudentService.delete(id);
          return ((current as StudentItem[]) ?? []).filter((c) => c.id !== id);
        },
        { revalidate: false, rollbackOnError: true }
      );
      // revalidate nhẹ sau khi xoá để đồng bộ server
      startTransition(() => {
        void mutate();
      });
    } finally {
      setDeletingId(null);
    }
  }

  // ESC để đóng modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal();
    }
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isSubmitting]);

  const [classList, setClassList] = useState<ClassItem[]>([]);
  const [loadingClass, setLoadingClass] = useState(false);
  const [classError, setClassError] = useState<string | null>(null);

  useEffect(() => {
  let mounted = true;

  async function fetchClass() {
    try {
      if (mounted) setLoadingClass(true);
      const dataClass = await ClassService.getAll();
      if (mounted) setClassList(dataClass);
    } catch (err: unknown) {
      if (mounted) setClassError((err as Error)?.message ?? 'Không tải được danh sách lớp');
    } finally {
      if (mounted) setLoadingClass(false);
    }
  }

  fetchClass();
  return () => { mounted = false; };
}, []);


  const showTopBar = isLoading  || isPending;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-2xl border border-gray-200 dark:border-gray-800">
      <TopProgress show={showTopBar} />

      <div className="px-4 sm:px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              id="table-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm học sinh..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            onClick={openCreate}
            disabled={isSubmitting}
          >
            {isSubmitting && mode === 'create' ? <Spinner /> : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            )}
            Thêm học sinh
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && !isLoading && (
        <div className="p-6 text-sm text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20">
          Không tải được dữ liệu học sinh. Vui lòng thử lại.
        </div>
      )}

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Tên học sinh</th>
            <th scope="col" className="px-6 py-3">Mã học sinh</th>
            <th scope="col" className="px-6 py-3">Ngày sinh</th>
            <th scope="col" className="px-6 py-3">Ngày nhập học</th>
            <th scope="col" className="px-6 py-3">Lớp đang học</th>
            <th scope="col" className="px-6 py-3">Mô tả</th>
            <th scope="col" className="px-6 py-3">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 w-full max-w-[180px] rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                Không có dữ liệu hiển thị.
              </td>
            </tr>
          )}

          {!isLoading &&
            filtered.map((r) => (
              <tr
                key={r.id}
                className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80"
              >
                <td className="px-6 py-4">{r.name}</td>
                <td className="px-6 py-4">{r.studentCode}</td>
                <td className="px-6 py-4">{formatDate(r.birthDay)}</td>
                <td className="px-6 py-4">{formatDate(r.createAt)}</td>
                <td className="px-6 py-4">{r.classRoomName}</td>
                <td className="px-6 py-4">{r.description}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs disabled:opacity-60"
                      onClick={() => openEdit(r)}
                      disabled={isSubmitting || deletingId === r.id}
                    >
                      Sửa
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs inline-flex items-center gap-2 disabled:opacity-60"
                      onClick={() => handleDelete(r.id)}
                      disabled={isSubmitting || deletingId === r.id}
                    >
                      {deletingId === r.id ? <Spinner className="w-3.5 h-3.5" /> : null}
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500">
          Hiển thị {filtered.length ? `1–${filtered.length}` : '0'} của {(data?.length ?? 0)} học sinh
        </p>
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <button className="px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">Trước</button>
          <button className="px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">Sau</button>
        </div>
      </div>

      <Modal
        open={isOpen}
        onClose={closeModal}
        title={mode === 'create' ? 'Thêm học sinh' : 'Cập nhật học sinh'}
        busy={isSubmitting}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên học sinh</label>
            <input
              autoFocus
              type="text"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              required
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mã học sinh</label>
              <input
                type="text"
                value={form.studentCode}
                onChange={(e) => setForm((s) => ({ ...s, studentCode: e.target.value }))}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lớp đang học</label>
              <select
                value={form.classRoomId != null ? form.classRoomId : ''}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    classRoomId: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {loadingClass ? 'Đang tải lớp...' : classError ? 'Lỗi tải lớp' : 'Chưa có lớp'}
                </option>
                {classList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input
              type="date"
              value={form.birthDay ? new Date(form.birthDay).toISOString().substring(0, 10) : ''}
              onChange={(e) => setForm((s) => ({ ...s, birthDay: new Date(e.target.value) }))}
              required
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
              disabled={isSubmitting}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-xl px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2 disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : null}
              {mode === 'create' ? 'Thêm' : 'Lưu'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  busy?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        {/* Overlay mờ + spinner khi busy */}
        {busy && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/60 dark:bg-gray-900/60 rounded-2xl">
            <Spinner className="w-6 h-6" />
          </div>
        )}

        <div className="flex items-start justify-between gap-4">
          <h3 id="modal-title" className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-60"
            aria-label="Đóng"
            title="Đóng"
            disabled={busy}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4 relative">{children}</div>
      </div>
    </div>
  );
}
