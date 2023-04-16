from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session

from .. import models, schemas, utils, oauth2
from ..database import get_db


router = APIRouter(
    prefix="/students",
    tags=["Students"]
    )


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.StudentOut)
async def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):

    # hash password - student.password
    hashed_password = utils.hash_password(student.password)
    student.password = hashed_password


    find_username = db.query(models.Student).filter(models.Student.username == student.username).first()
    find_email = db.query(models.Student).filter(models.Student.email == student.email).first()

    if find_username:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"Username Already Exists")
    if find_email:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"Email Already Exists")
    if not student.first_name or not student.last_name or not student.username or not student.email or not student.password:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="fields cannot be empty")
  

    new_student = models.Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


# @router.get("/{id}", response_model=schemas.StudentOut)
# async def get_student(id: int, db: Session = Depends(get_db)):
#     student = db.query(models.Student).filter(models.Student.id == id).first()

#     if not student:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with id: {id} does not exist")

#     return student


# endpoint with authentication
# requires student to login before updating their profile

@router.put("/{id}", response_model=schemas.StudentOut)
async def update_student(id: int, updated_student: schemas.StudentUpdate, db: Session = Depends(get_db), current_student: int = Depends(oauth2.get_current_user)):

    student_query = db.query(models.Student).filter(models.Student.id == current_student.id)
    student = student_query.first()

    if student == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"student with id: {id} does not exist")
    if not updated_student.first_name or not updated_student.last_name or not updated_student.username or not updated_student.email:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="fields cannot be empty")


    student_query.update(updated_student.dict(), synchronize_session=False)
    db.commit()
    
    return student_query.first()