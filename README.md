# Creations-Showcase-API
My version of TOP's blog api project but instead of a blog, it allows creators to showcase their web dev projects


ToDo
[ ] go through your todos in the code
[ ] When the user logs out, you can have the client remove the JWT from storage.

Some links I used during development:

node-jsonwebtoken github: https://github.com/auth0/node-jsonwebtoken#readme

passport-jwt githbu: https://github.com/mikenicholson/passport-jwt

node_jwt_example https://github.com/bradtraversy/node_jwt_example/blob/master/app.js

REST api best practices article: https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design#h-nesting-resources-for-hierarchical-objects

Some notes on how user roles work in this api.
There are 2 roles. The main role is User which is anyone who is signed up with this api.
The 2nd role of Author is available as well but requires contacting the developer hbar1st to elevate your credentials.
The client apps that interact with this api do not have the ability to elevate a User to an Author.
An Author can add their projects and publish them. A User cannot. A User can post comments and like published projects.
All users are free to delete their accounts, but if they do, all their comments and projects will be removed as well. (permanently)

Current plan for routes in this api.

GET routes:

/user (this one gets the current user's nickname/email/etc)
/projects (gets all projects - unauthenticated access)
/projects/user (gets all the specific user's projects - authenticated by jwt)
/projects/:pid (gets a project - unauthenticated access)
/projects/:pid/interactions (gets a project's interactions - unauthenticated access)
/projects/:pid/comment/:cid (gets a project's comments - unauthenticated access)

POST routes:

/user/login
/user/sign-up
/projects/ (adds a new project to this user's list)
/projects/:pid/like
/comments/:pid

PUT routes:

/user
/projects/:pid
/projects/:pid/image
/projects/:pid/comment


DELETE routes:

/user
/projects/:pid
/projects/:pid/image
/projects/:pid/comment
/projects/:pid/like
