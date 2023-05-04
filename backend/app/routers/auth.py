from fastapi import APIRouter, Depends, status, HTTPException, Response
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..import database, schemas, models, utils, oauth2

router = APIRouter(tags=["Authentication"])


# check if email exists in student table
# if it doesnt exist, return 403 status code with message of invalid credentials
# if it exists, verify password matches with password in db

# if credentials match, create token and return response with token included

@router.post("/login")
async def login(student_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):

    student = db.query(models.Student).filter(models.Student.email == student_credentials.username).first()

    if not student:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    if not utils.verify_password(student_credentials.password, student.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    # create token, return token
    access_token = oauth2.create_access_token(data = {"student_id": student.id})
    return {"access_token": access_token, "token_type": "bearer", "user_id": student.id, "first_name": student.first_name, "last_name": student.last_name, "student_id": student.student_id}
    

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}
