import { StudentCreate, StudentItem, StudentUpdate } from "@/types";

import { apiUrl, fetchJson } from "@/lib/fetcher";

const baseApiStudent = apiUrl('/api/student');

export const StudentService = {
    getAll: () => fetchJson<StudentItem[]>(apiUrl(baseApiStudent)),
    getById: (id : string) => fetchJson<StudentItem>(`${baseApiStudent}/${id}`),
    delete: (id:string) => fetchJson<void>(`${baseApiStudent}/${id}`,{method:'DELETE'}),
    create: (body : StudentCreate) => fetchJson<StudentItem>(`${baseApiStudent}`,{
        method:'POST',
        body:JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    }),
    update: (id: string,body: StudentUpdate) => fetchJson<void>(`${baseApiStudent}/${id}`,{
        method: 'PUT',
        body: JSON.stringify(body),
        headers:{
            "content-Type": "application/json"
        }
    })

}