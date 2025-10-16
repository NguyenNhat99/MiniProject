'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import useClasses from '@/hook/useClasses';
import { ClassService } from '@/services/classService';
import type { ClassCreate, ClassItem } from '@/types';

// ===== Helpers an toàn không dùng `any`
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return 'Đã xảy ra lỗi không xác định';
  }
}

// ===== UI nhỏ gọn tái dùng
function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
    </svg>
  );
}

function TopProgress({ show }: { show: boolean }) {
  return (
    <div className={`absolute left-0 right-0 top-0 h-0.5 overflow-hidden ${show ? 'block' : 'hidden'}`}>
      <div className="h-full w-1/2 animate-[progress_1.2s_ease-in-out_infinite] bg-blue-600 origin-left" />
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(50%) scaleX(0.7); }
          100%{ transform: translateX(200%) scaleX(0.2); }
        }
      `}</style>
    </div>
  );
}

type ModalMode = 'create' | 'edit';

export default function DanhSachLopPage() {
  const [query, setQuery] = useState('');
  const { data, error, isLoading, mutate } = useClasses(); // giả định mutate<Data = ClassItem[]>

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const [form, setForm] = useState<ClassCreate>({
    className: '',
    fullNameTeacher: '',
    description: '',
  });

  const list: ClassItem[] = data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((d) =>
      [String(d.id), d.className, d.fullNameTeacher, d.description ?? '']
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [list, query]);

  // Open modal helpers
  function openCreate() {
    setMode('create');
    setEditingId(null);
    setForm({ className: '', fullNameTeacher: '', description: '' });
    setIsOpen(true);
  }

  function openEdit(item: ClassItem) {
    setMode('edit');
    setEditingId(item.id);
    setForm({
      className: item.className,
      fullNameTeacher: item.fullNameTeacher,
      description: item.description ?? '',
    });
    setIsOpen(true);
  }

  function closeModal() {
    if (isSubmitting) return; // tránh đóng khi đang submit
    setIsOpen(false);
  }

  // SUBMIT — gọi API + cập nhật SWR (kiểu hoá prevData)
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setActionError(null);
    try {
      setIsSubmitting(true);

      if (mode === 'create') {
        await mutate<ClassItem[] | undefined>(
          async (current) => {
            const created = await ClassService.create({
              className: form.className,
              fullNameTeacher: form.fullNameTeacher,
              description: form.description,
            });
            const prev = current ?? [];
            return [created, ...prev];
          },
          { revalidate: false, rollbackOnError: true }
        );
      } else if (mode === 'edit' && editingId != null) {
        await mutate<ClassItem[] | undefined>(
          async (current) => {
            await ClassService.update(editingId, {
              className: form.className,
              fullNameTeacher: form.fullNameTeacher,
              description: form.description,
            });
            const prev = current ?? [];
            return prev.map((c) => (c.id === editingId ? { ...c, ...form } : c));
          },
          { revalidate: true, rollbackOnError: true }
        );
      }

      setIsOpen(false);
    } catch (err: unknown) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Bạn có đồng ý xóa lớp này không ?')) return;
    setActionError(null);
    setDeletingId(id);
    try {
      await mutate<ClassItem[] | undefined>(
        async (current) => {
          await ClassService.delete(id);
          const prev = current ?? [];
          return prev.filter((c) => c.id !== id);
        },
        { revalidate: false, rollbackOnError: true }
      );

      // revalidate nhẹ để đồng bộ server
      startTransition(() => {
        void mutate();
      });
    } catch (err: unknown) {
      setActionError(getErrorMessage(err));
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

  const showTopBar = isLoading || isPending;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-2xl border border-gray-200 dark:border-gray-800">
      {/* Thanh progress mảnh khi đang tải */}
      <TopProgress show={showTopBar} />

      {/* Top bar: Search + Add */}
      <div className="px-4 sm:px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M19 19l-4-4m0-7a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              id="table-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm lớp..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Add button */}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            onClick={openCreate}
            disabled={isSubmitting}
          >
            {isSubmitting && mode === 'create' ? <Spinner /> : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            )}
            Thêm lớp
          </button>
        </div>
      </div>

      {/* Error tổng */}
      {error && !isLoading && (
        <div className="p-6 text-sm text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20">
          Không tải được danh sách lớp. Vui lòng thử lại.
        </div>
      )}
      {actionError && (
        <div className="mx-4 my-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200">
          {actionError}
        </div>
      )}

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Tên lớp</th>
            <th scope="col" className="px-6 py-3">Giáo viên phụ trách</th>
            <th scope="col" className="px-6 py-3">Mô tả</th>
            <th scope="col" className="px-6 py-3">Số lượng sinh viên đang học</th>
            <th scope="col" className="px-6 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {/* Skeleton khi tải lần đầu */}
          {isLoading && (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={`sk-${i}`} className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
                  {Array.from({ length: 6 }).map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 w-full max-w-[180px] rounded-md bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}

          {/* Empty state */}
          {!isLoading && !error && filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                Không có dữ liệu hiển thị.
              </td>
            </tr>
          )}

          {/* Data rows */}
          {!isLoading && filtered.map((r) => (
            <tr key={r.id} className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80">
              <td className="px-6 py-4 ">{r.id}</td>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{r.className}</th>
              <td className="px-6 py-4">{r.fullNameTeacher}</td>
              <td className="px-6 py-4">{r.description}</td>
              <td className="px-6 py-4">{r.numberOfStudent}</td>
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

      {/* Footer */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs text-gray-500">
          Hiển thị {filtered.length ? `1–${filtered.length}` : '0'} của {(data?.length ?? 0)} lớp
        </p>
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <button className="px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">Trước</button>
          <button className="px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">Sau</button>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      <Modal open={isOpen} onClose={closeModal} title={mode === 'create' ? 'Thêm lớp' : 'Cập nhật lớp'} busy={isSubmitting}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên lớp</label>
            <input
              autoFocus
              type="text"
              value={form.className}
              onChange={(e) => setForm((s) => ({ ...s, className: e.target.value }))}
              required
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Giáo viên phụ trách</label>
              <input
                type="text"
                value={form.fullNameTeacher}
                onChange={(e) => setForm((s) => ({ ...s, fullNameTeacher: e.target.value }))}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả (tuỳ chọn)</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

// ===== Modal thuần Tailwind
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        {/* Busy overlay */}
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
