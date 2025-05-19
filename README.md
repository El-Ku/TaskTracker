## Things to Check before deploying on Render:

- Use the following cors settings on server.js file:

```js
app.use(
  cors({
    origin: "https://tasktracker-client-yuyo.onrender.com",
    credentials: true,
  })
);
```

## Live deployment

The client(as a static site) and server(as a web service) are deployed on Render.

- Server is running at [https://tasktracker-ufr9.onrender.com](https://tasktracker-ufr9.onrender.com)
- Client is running at [https://tasktracker-client-yuyo.onrender.com](https://tasktracker-client-yuyo.onrender.com)

### Render settings for the server:

- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm run dev`
- Environment variable: Paste the contents of `.env` file from server directory.

### Render settings for the client:

- Root Directory: `client`
- Build Command: `npm install; npm run build`
- Publish Directory: `dist`
- Environment variable: `VITE_BASE_URL=https://tasktracker-ufr9.onrender.com`

### MongoDB Atlas settings:

Once server is deployed, copy the static IP addresses of the server(from Render dashboard) and paste it in the `Network Access` tab of your MongoDB Atlas account. This is required to allow the server to connect to the database.

## What is this project?

This is a simple task tracker application built with MERN stack(MongoDB, Express, React JS and Node JS). It allows users to create, read, update, and delete tasks.

## Features

- Basic navigation bar with links to Home, Profile, Tasks, and Login/Logout
- User authentication
- Create, read, edit, and delete tasks. Tasks can also be marked as `Done`, `Pending` and `Todo`.
- All tasks can be deleted at once
- Basic profile page management
- Password change functionality
- Users can register on their own and delete their own accounts

## Technical information

- The server is built with `Node.js` and `Express.js`.
- The client is built with `React.js`.
- The database is `MongoDB` and `Mongoose` is used to interact with the database.
- The client uses `React Router` for routing.
- Authentication is done using `JWT`(JSON Web Tokens).
- On the backend, basic validation is done using `Joi`.
- `express-rate-limit` is used to limit the number of requests to the server.
