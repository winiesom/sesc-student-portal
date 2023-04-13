from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


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


class StudentCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class StudentOut(BaseModel):
    id: int
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

class TokenData(BaseModel):
    id: Optional[str] = None
