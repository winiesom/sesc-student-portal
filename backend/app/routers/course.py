from fastapi import status, Response, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import models, schemas, oauth2
from ..database import get_db

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
    )

# end points without authentication 
# to populate database with courses, 
# get courses, 
# update courses and delete courses

@router.get("/main", response_model=List[schemas.Course])
def get_courses_main(db: Session = Depends(get_db)):
    
    courses = db.query(models.Course).all()
    return courses

@router.post("/main", status_code=status.HTTP_201_CREATED, response_model=schemas.Course)
async def add_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):

    # check if course exists using tile and raise a 406 status with message already exists
    find_title = db.query(models.Course).filter(models.Course.title == course.title).first()

    if find_title:
                raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail=f"Course Already Exists")
    
    new_course = models.Course(**course.dict())

    # add new course to course table
    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return new_course


@router.get("/main/{id}", response_model=schemas.Course)
async def get_course(id: int, db: Session = Depends(get_db)):
    
    # filter course on course table whose id matched the id sent in the request
    course = db.query(models.Course).filter(models.Course.id == id).first()

    # if no course is found to match, return a not found status
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"course with id: {id} was not found")

    # if course is found, return the course using the response model provided
    return course


@router.delete("/main/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(id: int, db: Session = Depends(get_db)):

    # filter course on course table whose id matched the id sent in the request
    course = db.query(models.Course).filter(models.Course.id == id)

    # if no course is found to match, return a not found status
    if course.first() == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"course with id: {id} does not exist")

    # if course is found, return the course using the response model provided
    course.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.put("/main/{id}", response_model=schemas.Course)
async def update_course(id: int, updated_course: schemas.CourseCreate, db: Session = Depends(get_db)):

    # filter course on course table whose id matched the id sent in the request
    course_query = db.query(models.Course).filter(models.Course.id == id)
    course = course_query.first()

    # if no course is found to match, return a not found status
    if course == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"course with id: {id} does not exist")

    # if course is found, make an updte to the course record
    course_query.update(updated_course.dict(), synchronize_session=False)
    db.commit()
    
    return course_query.first()


# endpoint with authentication
# requires student to login before serving all courses

@router.get("/", response_model=schemas.CourseList)
def get_courses(
    db: Session = Depends(get_db), 
    current_student: int = Depends(oauth2.get_current_user), 
    pagesize: int = 10, 
    page: int = 0, 
    search: Optional[str] = ""
    ):


    offset = page * pagesize
    if offset < 0:
        offset = 0

    # query course table to return all courses
    # carry out search using the ilike clause 
    # pagination functionality using the limit clause to passin the pagesize(10)
    # using offset clause to determing which page

    courses = db.query(models.Course).filter(models.Course.title.ilike(f'%{search.lower()}%')).limit(pagesize).offset(offset).all()
    total_count = db.query(models.Course).count()
    currentPage = page

    # return all course, total count and current page
    return {"courses": courses, "total_count": total_count, "page": currentPage}





