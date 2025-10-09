export type ClassItem = {
  id: number,
  className: string,
  fullNameTeacher: string,
  description?: string,
  numberOfStudent: number
};
export type ClassCreate = {
    className: string,
    fullNameTeacher: string,
    description?: string
};
export type ClassUpdate = {
    className: string,
    fullNameTeacher: string,
    description?: string,
};

export type StudentItem = {
  id: string,
  name: string,
  studentCode: string,
  birthDay: Date,
  createAt: Date,
  description: string,
    classRoomId:number | null,
  classRoomName:string
};
export type StudentCreate = {
  name: string,
  studentCode: string,
  birthDay: Date,
  description: string,
  classRoomId:number | null,
}
export type StudentUpdate = {
  name: string,
  studentCode: string,
  birthDay: Date,
  description: string,
   classRoomId:number | null,
};