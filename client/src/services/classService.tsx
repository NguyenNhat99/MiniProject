import { ClassCreate, ClassItem, ClassUpdate } from "@/types";

import { apiUrl, fetchJson } from "@/lib/fetcher";

const baseApiClass = apiUrl('/api/classroom');

export const ClassService = {
    getAll: () => fetchJson<ClassItem[]>(apiUrl(baseApiClass)),
    getById: (id : number) => fetchJson<ClassItem>(`${baseApiClass}/${id}`),
    delete: (id:number) => fetchJson<void>(`${baseApiClass}/${id}`,{method:'DELETE'}),
    create: (body : ClassCreate) => fetchJson<ClassItem>(`${baseApiClass}`,{
        method:'POST',
        body:JSON.stringify(body),
        headers: { "Content-Type": "application/json" }
    }),
    update: (id: number,body: ClassUpdate) => fetchJson<void>(`${baseApiClass}/${id}`,{
        method: 'PUT',
        body: JSON.stringify(body),
        headers:{
            "content-Type": "application/json"
        }
    })

}