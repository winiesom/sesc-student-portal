from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine
from .routers import course, student, auth, enrolment
from .config import settings



models.Base.metadata.create_all(bind=engine)

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(course.router)
app.include_router(student.router)
app.include_router(auth.router)
app.include_router(enrolment.router)



@app.get("/")
async def root():
    return {"message": "Hello World yo"}