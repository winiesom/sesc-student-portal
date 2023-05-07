# Student Portal
A microservices-based web application for a university's student portal.
The application is written in Python and FastAPI.

![component diagram](/backend/studentUML.png "Component Diagram")



## Student portal Features
1. Create Account - Create a student account by filling the form fields, this also calls the APIs to create accounts in the library and finance portal .
2. Login - secure password-verified login.
3. Courses - return all courses in the DB.
4. Search Invoice - search and return a single course.
5. Enrolments - Return all enrolments for logged in student.
6. Enrol - enrol student (call finance api to create invoice)
7. Profile - return details of logged in student
8. Update profile - edit profile information and update record in DB
9. Eligibility to graduate - call get account api on finance service `http://localhost:8083/accounts/${account_id}` to find if outstanding is true or false


### Tools - tools to be installed and setup
    1. Docker desktop app - (https://www.docker.com/products/docker-desktop/)
    2. Python3 and above
    3. Pip3 or pip


### Note: 
    * Use postman `http://localhost:8000/courses/main` to populate the course table in the database providing the following fields: {"title": "Course1", "description": "course1 desc", "fee": 30.00}.


### Note: 
    * Make sure the finance and library services are up and running because the student portal calls APIs from them.


### Integrations
### 1. Database
    The application integrates with a postgres database,
    Scripts to create the database schema can be found in the migrations folder and are run automatically by docker-compose.

### 2. Finance Microservice
    * The application integrates with the [Finance microservice](https://github.com/winiesom/sesc-finance-portal) via REST.
    * When an account is created from the student service, a request is sent to this application to create an account.
    * The credentials to login are the same credentials used in the student portal (c77777777, password).
    * When a student enrols for course, a request is sent to this application to create an invoice.
    * When a student checks their eligibility to graduate, a request is sent to this application to see if outstanding is true or false.
    * In the library portal, when a borrowed book is overdue and is returned late, a request is sent to this application to generate an invoice.


### 3. Library Microservice
    * The application integrates with the [Library microservice](https://github.com/winiesom/sesc-library-portal) via REST.
    * When an account is created from the student service, a request is sent to this application to create an account.


## Demos
[![Watch the demo.](http://img.youtube.com/vi/6Z2XXVkB3gk/hqdefault.jpg)](https://youtu.be/6Z2XXVkB3gk)

## Running the application
    1. Ensure the Finance and Library portals are setup and running.
    2. Rename the `.env.example` file in the server root directory to `.env`
    3. Edit the credentials in the `.env` file as needed. docker-compose.yml file relies on these credentials.
    4. Open the terminal and navigate to the backend directory `cd backend`
    5. Run the command: `pip3 install -r requirements.txt` or `pip install -r requirements.txt`
    6. Run the app and db service using the command: `docker-compose up`

## Note: You can access PGADMIN on the browser via: http://localhost:5050/browser/
    provide PGADMIN_EMAIL and PGADMIN_PASSWORD with the details stored in `.env` file
    Create server on PGADMIN





## Student portal client

## Running the application:
## This application runs on port 3000
    1. `cd frontend`
    2. `npm install`
    3. `npm start`
