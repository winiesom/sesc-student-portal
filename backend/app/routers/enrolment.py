from fastapi import status, Response, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session, joinedload
from typing import List

from .. import models, schemas, oauth2
from ..database import get_db

router = APIRouter(
    prefix="/enrolments",
    tags=["Enrolments"]
    )


@router.get("/", response_model=List[schemas.Enrolment])
def get_enrolments(db: Session = Depends(get_db), current_student: int = Depends(oauth2.get_current_user)):

    # filter all enrolments where the student_id field matches the current logged in student id
    enrolments = db.query(models.Enrolment).filter(models.Enrolment.student_id == current_student.id ).all()

    return enrolments

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Enrolment)
async def add_enrolment(enrolment: schemas.EnrolmentCreate, db: Session = Depends(get_db), current_student: int = Depends(oauth2.get_current_user)):

    # check if there is a course with id that matches the course_id being sent from enrolment
    course = db.query(models.Course).filter(models.Course.id == enrolment.course_id).first()

    # if there is no course that matches, a not found exception is raised
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Course Not Found")

    # if a course exists, check if it already exists in enrolment table
    # to prevent a particular student from enrolling to one course multiple times
    find_enrolment = db.query(models.Enrolment).filter(models.Enrolment.student_id == current_student.id, models.Enrolment.course_id == enrolment.course_id).first()

    # if that enrolment exists, a not acceptable exception is raised
    if find_enrolment:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"You Have Already Enrolled For This Course")
    
    new_enrolment = models.Enrolment(**enrolment.dict())
    
    # add new_enrolment
    db.add(new_enrolment)
    db.commit()
    db.refresh(new_enrolment)

    return new_enrolment



