# Cutup Poem App

This app allows you to enter blobs of text to be cut up and used for refrigerator magnet type poems. So you can rearrange the words to create new poems. These poems persist via the `backend/database.db` file.

This is currently a single user application, and auth is not implemented.

## Technologies

### Backend

The backend is python REST API. It's built on [FastAPI](https://fastapi.tiangolo.com/). The database is currently SQLLite. We use SQLModel and SQLAlchemy to manage it.

### Frontend

The frontend is written in React and uses Axios to make requests to the backend.

## Instalation

```
$ cd backend
$ python3 -m venv .venv
$ source .venv/bin/activate
$ pip install -r requirements.txt

$ cd ../frontend
$ npm install
```

## Running

For the backend

```
$ cd backend
$ fastapi dev main.py
```

For the frontend

```
$ cd frontend
$ npm run dev
```

## Testing

For the frontend

```
$ cd frontend
$ npx vitest
```
