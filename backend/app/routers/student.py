from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session

from .. import models, schemas, utils
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


    new_student = models.Student(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


@router.get("/{id}", response_model=schemas.StudentOut)
async def get_student(id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == id).first()

    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Student with id: {id} does not exist")

    return student