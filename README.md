## Things to Check before deploying on Render:

- Change the NODE_ENV variable in the server directory to `production` in the `.env` file.
- In the server directory, change the `allowedOrigin` variable in the `server.js` file to the URL of your client application. For example, if your client is deployed at `https://my-client-site.onrender.com`, then change it to:

```js
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://my-client-site.onrender.com"
    : "http://localhost:5173";
```

- This is added to server.js file so that rate limiter works well.

```js
app.set("trust proxy", 1);
```

## Live deployment

The client(as a static site) and server(as a web service) are deployed on Render. Note that after 15 minutes of inactivity(as I am using a free account in Render), the server will go to sleep and it will take upto 30 seconds to wake up. The client is a static site and will not go to sleep.

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

- Basic navigation bar with links to Home, Profile, Tasks, Admin dashboard and Login/Logout
- User authentication
- Create, read, edit, and delete tasks
- Tasks can also be marked as `Done`, `Pending` and `Paused`
- All tasks can be deleted at once
- Basic profile page management
- Password change functionality
- Users can register on their own and delete their own accounts
- When a user registers they will get a welcome email from my personal gmail id
- The task table is sortable by task name, status or date created
- Multiple tasks can be selected and their status can be changed with one click
- Multiple fields of description and/or status can be edited manually and updated to the database with one click
- Admin User:
  - A user can be manually made as an admin by an exisiting admin
  - Admin can read the current list of users and their profile information except user passwords
  - Admin can update any user information, or delete user accounts
  - Admin can create multiple user accounts from his admin dashboard
  - Admin can delete all exisiting users in the platform with one click

## Technical information

- The server is built with `Node.js` and `Express.js`
- The client is built with `React.js`
- The database is `MongoDB` and `Mongoose` is used to interact with the database
- The client uses `React Router` for routing
- Authentication is done using `JWT`(JSON Web Tokens)
- Role based access control(RBAC) was manually implemented for admin and regular user.
- On the backend, basic validation is done using `Joi`
- On the frontend, basic validation is done using `Zod`
- CSS was done using `Tailwind CSS`

## What is next?

- Wouldn't it be cool for users to assign tasks to other users given the assignee has given permission for it?
  - A `manager` role user(just within this sub context) can create a `tag`.
  - Depending on the setting of the tag, manager can either add other users AND/OR other users can subscribe to the `tag` by themselves
  - Now based on the setting choosen, in two way tasks can be assigned:
    - All subscribers can assign tasks to each other
    - Only manager can assign tasks
    - The assignee needs to approve the task which is assigned to him/her. Until then, it will remain under 'Waiting to be approved' list.
  - For the regular user, the task table will have multiple sections, each section allocated for a particular `tag`
