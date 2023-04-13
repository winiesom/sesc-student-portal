FROM python:3.8-alpine

ENV PYTHONUNBUFFERED=1

WORKDIR /home

COPY requirements.txt requirements.txt

RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt 

COPY . /home

EXPOSE 8000