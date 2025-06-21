This service is running at https://www.elku.xyz/tasktracker/

See the detailed deployment steps in this file: [lightsail_install_steps.md](https://github.com/El-Ku/TaskTracker/blob/main/lightsail_install_steps.md)

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

  ### Details on how it would work?

  - Each tag will have a `superManager`, zero or more `managers`, and several `members`.
  - Each user doc in db has 3 fields, each of which are an array of structures: `superManaged`, `managed`, and `memberOf`.
    - Each structure has user_id as key and username as value.
  - Each task has following fields: `creatorId`, `assignorId`, `assigneeId`, `tagId`, and `tagName`. The first 3, which are User \_id's, are indexed.

  #### Lets see how the following functions are supported:

  - New task is created
    - If its a regular task, only `creatorId` is set
  - Task is added to a tag
    - `tagId` and `tagName` are set accordingily
  - New tag is created
    - `superManager` field is set. `tagName` is a required field
  - Add a new or existing task to a tag(by superManager or manager only or member can choose for him/herself)
    - Set `tagId`, and `tagName`
    - Assign it to someone:
      - Set `assignorId`, and `assigneeId`
  - Add a manager to a tag
    - Set tag's `managers` field. And the new manager's `managed` field
  - Add a member to a tag
    - Set tag's `members` field. And the new member's `memberOf` field
  - Remove a member from a tag
    - Remove the entry from tag's `members` field. And from the new member's `memberOf` field. Remove all task's `assigneeId`, and `assignorId` for this particular userID and tagID
  - Set one of the managers as superManager(only done by the current superManager)
    - Add current superManager to `managers` field. Remove new manager from `managers` field and set as new `superManager`
    - Update both their User docs.
  - Remove a manager (can only be done by a `superManager`)
    - Remove entry from tag's `managers` field. And also remove from the old manager's `managed` field
    - Three options are presented to the remover about the Tasks assigned by the removed manager:
      - Delete all tasks assigned by the old manager
      - (OR) change the assignor to oneself(`superManager`)
      - (OR) delete the `assigneeId`, and `assignorId` from all relevant tasks
  - Delete a user account
    - Shouldnt be holding any superManager positions
    - Gets automatically removed from all manager positions
    - Delete the `assigneeId`, and `assignorId` from all relevant tasks
    - Delete all personal tasks
  - Delete a tag (can only be done by a `superManager`)
    - Delete all tasks with that tagID
    - Remove the tag info from all manager user's document
    - Remove the tag info from all member user's document
    - Remove the tag info from the superManager user's document
    - Delete the tag document itself
  - Changing tag name is NOT allowed

#### Usage Limit Variables:

- Max tasks associated with a user (e.g:- 1000)
- Max tags associated with a user (e.g:- 20)
- Max members per tag (e.g:- 100)
- Max managers per tag (e.g:- 5)
