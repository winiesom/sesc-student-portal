from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..import database, schemas, models, utils, oauth2

router = APIRouter(tags=["Authentication"])

@router.post("/login")
def login(student_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):

    student = db.query(models.Student).filter(models.Student.email == student_credentials.username).first()

    if not student:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    if not utils.verify_password(student_credentials.password, student.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    # create token, return token
    access_token = oauth2.create_access_token(data = {"student_id": student.id})
    return {"access_token": access_token, "token_type": "bearer"}
    