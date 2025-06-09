This service is running at https://www.elku.xyz/tasktracker/

See the detailed deployment steps in this file: lightsail_install_steps.md

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
