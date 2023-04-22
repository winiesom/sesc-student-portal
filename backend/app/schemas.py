from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


class CourseBase(BaseModel):
    title: str
    description: str
    fee: float

class CourseCreate(CourseBase):
    pass


class Course(CourseBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class CourseList(BaseModel):
    courses: List[Course]
    total_count: int
    page: int


class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    password: str
    student_id: str

class StudentUpdate(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr

class StudentOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    student_id: str
    created_at: datetime

    class Config:
        orm_mode = True


class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    first_name: str
    last_name: str

class TokenData(BaseModel):
    id: Optional[str] = None



class EnrolmentBase(BaseModel):
    student_id: int
    course_id: int

class EnrolmentCreate(EnrolmentBase):
    pass


class Enrolment(EnrolmentBase):
    id: int
    created_at: datetime
    student_id: int
    course: Course

    class Config:
        orm_mode = True