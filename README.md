# Texter

Texter is a poor man's slack, in which users of Texter can create groups and invite people to the groups. Within groups users can create topics of discussion and send messages to the discussions. At the moment its funcitonality is fairly limited as it has served as a study project for the author to study topics such as material ui, graphql and mongo. For the time being its current user interface is intended for desktop use and no mobile app is provided.

## Requirements for the implementation

The requirements for the Texter are listed below

- user can create an account based on username, password, name and e-mail address
- user can modify the mentioned password and email
- user can create groups with names and textual descriptions
- user can invite other users to the groups
- user can cancel a sent invitation before it is accepted
- user can accept or reject invitations from other users to their groups
- upon accepting an invitation to a group, a user becomes a member of a group with two role options: member or admin
- user can create discussion topics within groups they have created or in which they have admin rights
- user can write text messages to the topics, which belong to groups they own or are members or admins of
- user can leave a group
- users can view their groups, topics and discussions both of which they own and are members of
- users can manage groups they own by sending invitations to users not yet in the group and removing users from the group
- users can manage groups they own by changing their name and description
- users can manage groups they own by removing discussion topics and their contents belonging to a particular group

## Technology stack

The texter app utilises the following technologies:

- React, redux, material UI and React Hook Forms in its frontend and managing global state
- Graphql (Apollo) in client server communication and state management via its queries, mutations, subscriptions and its cache
- Node, Express, mongoose and Mongo in its server side implementation
- Cypress for integration testing, jest for server side api and client side component tests

The repositries are in GitHub and GitHub Actions have been configured to deliver code via accepted pull requests to testing and deployment to Azure App Service. The CI/CD pipeline uses a protected main branch for delivery to production. To qualify for deployment, code must pass linting, component, api and integration testing phases within the pipeline.

## Notes on installation

One needs to have Node and an accessible Mongo database installed, after that one can clone the repository from GitHub to a local machine, change to the project root directory and do npm run install. For development setup one needs to have two .env files, one in the server subdirectory and the other in the www-client subdirectory. These files include environment variables used by the server and the client respectively. 

### Example server dot env file

One needs to define the port the server is listening to and development and test connection urls of the MongoDB installation. Here is an example of a setup with local development and testing connections as well as a production MongoDB ATLAS connection:

PORT=8080
DEV_MONGODB_URI=mongodb://root:some_password_for_mongo@localhost:27017/texterdev?authsource=admin
TEST_MONGODB_URI=mongodb://root:some_password_for_mongo@localhost:27017/textertest?authsource=admin
PROD_MONGODB_URI=mongodb+srv://some_username:some_password_for_atlas@your_atlas_hostname/texter?retryWrites=true&w=majority
SECRET=somejwtsecret

You need to replace <some_password_for_mongo>, <some_password_for_atlas> and <your_atlas_hostname> according to your installation values. Note that the SECRET-variable is a character string used to encode JSON Web Tokens and do comparisons between encoded strings by jsonwebtoken-library, so choose a suitable string and insert here.

### Example www-client dot env file and hardcoded net address

For development purposes the front end uses two addresses, one for the API and one for a websocket interface in the following fashion:

REACT_APP_API_ENDPOINT=http://localhost:8080/api
REACT_APP_WS_ENDPOINT=ws://localhost:8080/

The websocket interface is used by GraphQL subscription service. 

Note that the www-client has a hardcoded webserver address for the depoloyed version in its www-client/index.js file.

### Running the application locally

The root level package.json has some options to run the setup in development or test mode. To start both the client and the server, one needs to issue npm run dev -command from the terminal in the project root directory. Note that the mongodb needs to be up and running and that the connection string is correctly configured in the server/.env.

To run client side component tests one can issue npm run component-test -command at the project root directory. To run server side api test one can run npm run api-test in the project root. Running integration tests locally on needs to run build first for the frontend: npm run build in the project. Then one has to start the server in the test mode by running npm start:test and finally from a separate terminal npm run e2e-test.

## CI/CD & Running in Azure

Currently toplevel workflow file in .github/workflows specifies a GitHub actions workflow file with build, test and deployment steps to Azure App Service. It is worth noting that the testing step requires some of the above mentioned environment variables (PROD_MONGDB_URI, TEST_MONGODB_URI, SECRET and PORT) to be specified here, otherwise the test run will fail. Similarly the deployment step requires these variables to be specified in the azure portal secrets for this particular application. Also a publish-profile key is required.

## Software architecture

