'use client';

import { useEffect, useMemo, useState } from 'react';
import { ClassService } from '@/services/classService';
import {  ClassItem, StudentCreate, StudentItem, StudentUpdate } from '@/types';
import useStudents from '@/hook/useStudents';
import { StudentService } from '@/services/studentService';
import { formatDate } from './common';

type ModalMode = 'create' | 'edit';
export default function StudentListPage() {

  const [query, setQuery] = useState('');
  const { data, error, isLoading, mutate } = useStudents();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentCreate>({ name: '',studentCode: '',description: '',birthDay: new Date(),classRoomId: null});
  const list = data ?? [];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((d) =>
      [d.id + '', d.name?? '',d.studentCode??''].some((v) => v.toLowerCase().includes(q))
    );
  }, [list, query]);

  // Open modal helpers
  function openCreate() {
    setMode('create');
    setEditingId(null);
    setForm({ name: '',studentCode: '',description: '',birthDay: new Date(),classRoomId: 0});
    setIsOpen(true);
  }

  function openEdit(item: StudentItem) {
    setMode('edit');
    setEditingId(item.id);
    setForm({ 
      name: item.name, 
      studentCode: item.studentCode,
      birthDay: item.birthDay, 
      description: item.description,
      classRoomId: item.classRoomId ?? null
    });
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // SUBMIT — gọi API thật + cập nhật SWR (optimistic UI, không revalidate)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'create') {
      await mutate(async (current) => {
        const created = await StudentService.create({
          name: form.name,
          classRoomId: form.classRoomId,
          birthDay: form.birthDay,
          description: form.description,
          studentCode: form.studentCode
        });
        return [created, ...((current as StudentItem[]) ?? [])];
      }, { revalidate: false, rollbackOnError: true });
    } else if (mode === 'edit' && editingId != null) {
      await mutate(async (current) => {
        await StudentService.update(editingId!, {
          name: form.name,
          classRoomId: form.classRoomId,
          birthDay: form.birthDay,
          description: form.description,
          studentCode: form.studentCode
        });
        return (current ?? []).map(c =>
          c.id === editingId ? { ...c, ...form } : c
        );
      }, { revalidate: true, rollbackOnError: true });
    }
    closeModal();
  }

  async function handleDelete(id: string) {
    if(!confirm("Bạn có đồng ý xóa sinh viên này không ?")) return;
    await mutate(async (current) => {
      await StudentService.delete(id);
      return ((current as StudentItem[]) ?? []).filter((c) => c.id !== id);
    }, { revalidate: false, rollbackOnError: true });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeModal();
    }
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);



  const [classList, setClassList] = useState<ClassItem[]>([]);
  useEffect(() => {
    async function fetchClass(){
        const dataClass = await ClassService.getAll();
        setClassList(dataClass);
    }
    fetchClass();
  },[])



  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-2xl border border-gray-200 dark:border-gray-800">
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
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={openCreate}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Thêm lớp
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800/60 text-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Tên học sinh</th>
            <th scope="col" className="px-6 py-3">mã học sinh</th>
            <th scope="col" className="px-6 py-3">Ngày sinh</th>
            <th scope="col" className="px-6 py-3">Ngày nhập học</th>
            <th scope="col" className="px-6 py-3">Lớp đang học</th>
            <th scope="col" className="px-6 py-3">Mô tả</th>
            <th scope="col" className="px-6 py-3">Ghi chú </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80">
              <td className="px-6 py-4 ">{r.name}</td>
              <td className="px-6 py-4">{r.studentCode}</td>
              <td className="px-6 py-4">{formatDate(r.birthDay)}</td>
              <td className="px-6 py-4">{formatDate(r.createAt)}</td>
              <td className="px-6 py-4">{r.classRoomName}</td>
              <td className="px-6 py-4">{r.description}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs"
                    onClick={() => openEdit(r)}
                  >
                    Sửa
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs"
                    onClick={() => handleDelete(r.id)}
                  >
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
        <p className="text-xs text-gray-500">Hiển thị {filtered.length ? `1–${filtered.length}` : '0'} của {(data?.length ?? 0)} lớp</p>
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <button className="px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">Trước</button>
          <button className="px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-800">Sau</button>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      <Modal open={isOpen} onClose={closeModal} title={mode === 'create' ? 'Thêm lớp' : 'Cập nhật lớp'}>
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
              autoFocus
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
            value={form.classRoomId != null ? form.classRoomId:""} 
            onChange={e =>
                setForm(s => ({
                ...s,
                classRoomId: e.target.value ? Number(e.target.value) : null
                }))
            }
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <option value="">Chưa có lớp</option>
            {classList?.map(item => (
                <option key={item.id} value={item.id}>
                {item.className}
                </option>
            ))}
            </select>

            </div>
          </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày sinh</label>
              <input
                type="date"
                value={form.birthDay  ? new Date(form.birthDay).toISOString().substring(0, 10) : ''}
                onChange={(e) => setForm((s) => ({ ...s, birthDay: new Date(e.target.value) }))}
                required
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="rounded-xl px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
            >
              {mode === 'create' ? 'Thêm' : 'Lưu'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
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
        <div className="flex items-start justify-between gap-4">
          <h3 id="modal-title" className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Đóng"
            title="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}


