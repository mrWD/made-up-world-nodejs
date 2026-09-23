# Made Up World (Node.js backend)

The API behind Made Up World, a small platform for writing and reading gamebooks: stories where every page ends with a choice and each choice leads to another page. This repo is the backend. The front ends live in sibling repos:

- [made-up-world-vuejs](https://github.com/mrWD/made-up-world-vuejs)
- [made-up-world-reactjs](https://github.com/mrWD/made-up-world-reactjs)
- [made-up-world-angular](https://github.com/mrWD/made-up-world-angular)

Built in 2020 and 2021 as a learning project. It used to run on Heroku with Travis CI deploying on push to master. Both are gone, so there is no live demo any more. Not maintained.

## What it does

- Sign up / sign in with bcrypt password hashing and JWT tokens, session stored in MongoDB
- Story editing: pages with a title, a body, a list of options and `nextPages` links, plus a first page per story; publish, unpublish, remove
- Reading: paginated list of published stories with search by title and author, and page-by-page reading
- Users: profile, search, follow / unfollow
- Chats: one-to-one chats with a message history, delivered live over WebSocket
- Web push: VAPID keys and subscribe / unsubscribe routes (the push router is currently commented out in `src/server.ts`)
- Image upload with Multer (png/jpg, 2 MB max), stored on disk in date folders; a sharp resize step is present but commented out

## Stack

TypeScript, Node.js 12, Express 4, MongoDB with Mongoose 5, `websocket`, `web-push`, `jsonwebtoken`, `multer` + `sharp`, Mocha + Chai. The only test is a placeholder that kept the CI pipeline green.

## Running locally

You need Node 12+ and a MongoDB instance.

```sh
cp .env.example .env   # set MONGO_URL, SECRET_KEY, SESSION_SECRET
yarn                   # postinstall compiles TypeScript into dist/
yarn dev               # nodemon on src/server.ts
```

The API is served under `/api/*` (`auth`, `users`, `editing`, `reading`, `upload`, `chats`). `GET /` shows a small landing page from `views/`.

## License

MIT
