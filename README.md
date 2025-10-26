# Creations-Showcase-API
My version of TOP's blog api project but instead of a blog, it allows creators to showcase their web dev projects

Some links I used during development:

node-jsonwebtoken github: https://github.com/auth0/node-jsonwebtoken#readme

passport-jwt githbu: https://github.com/mikenicholson/passport-jwt

node_jwt_example https://github.com/bradtraversy/node_jwt_example/blob/master/app.js


Some notes on how user roles work in this api.
There are 2 roles. The main role is User which is anyone who is signed up with this api.
The 2nd role of Author is available as well but requires contacting the developer hbar1st to elevate your credentials.
The client apps that interact with this api do not have the ability to elevate a User to an Author.
An Author can add their projects and publish them. A User cannot. A User can post comments and like published projects.
All users are free to delete their accounts, but if they do, all their comments and projects will be removed as well. (permanently)

Current plan for routes in this api.

GET routes:

/projects
/project/:pid
/project/:pid/interactions
/project/:pid/comment/:cid

POST routes:

/user/login
/user/sign-up
/project
/like
/comment

PUT routes:

/user
/project
/comment

DELETE routes:

/user
/project
/comment
/like
