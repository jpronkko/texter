# Texter

Texter is like a poor man's Slack, in which users can create groups and invite people to the groups. Within groups users can create discussion topics and send messages to the discussions. At the moment its funcitonality is fairly limited as it has served as a study project for the author to study topics such as Material UI, GraphQL and Mongo. For the time being its current user interface is intended for desktop use only and no mobile app is provided. Small screen sizes are not supported. A running installation is currently availale at https://fstacktexter.azurewebsites.net. Working hours report is [here](workhours.md).

## Usage

First it is necessary to create a user account, click the create a new account-button in the login screen as in Figure 1.

<figure>
  <img src="images/newuser.png" width="70%">
  <figcaption>Figure 1. Login screen</figcaption>
</figure>

Fill in the user account information and give a long enough of a password.

<figure>
  <img src="images/createuser.png" width="70%">
  <figcaption>Figure 2. New user screen</figcaption>
</figure>

After submitting the information, you enter the main view, which shows your own groups and other groups you have joined in as in in Figure 3. Click **Create** button in **Own Groups** bar on the right to create a new group.


<figure>
  <img src="images/mainscreen.png" width="70%">
  <figcaption>Figure 3. Main screen with group cards</figcaption>
</figure>

In the main screen find your newly created group card and click **Select** button on it (see Figure 4).

<figure>
  <img src="images/groupselect.png" width="70%">
  <figcaption>Figure 4. Main screen, selecting a group</figcaption>
</figure>

You will now see the messaging screen, in which topics are on the left bar. There are no topics at the moment, so lets create a one. Click the **Add Topic** button on the upper left (see Figure 5).

<figure>
  <img src="images/addtopic.png" width="70%">
  <figcaption>Figure 5. Message screen, adding a topic</figcaption>
</figure>

After adding a topic, you can send a message to appear under it. Write the message in the text box below and click submit (see Figure 6).

<figure>
  <img src="images/createmessage.png" width="70%">
  <figcaption>Figure 6. Message screen, adding a message</figcaption>
</figure>

The situation is a bit silly, because nobody else can see your messages. Therefore lets add another user to your group to discuss with. Go back to the main screen listing the groups by clicking the Browse Groups button in the top bar.

Now go to group management by click the manage button in your group card as in Figure 7.

<figure>
  <img src="images/gomanage.png" width="70%">
  <figcaption>Figure 7. Message screen, going to group management</figcaption>
</figure>

In group management one can change group information, add invitations to users to join a group and remove users from a group. Lets invite some users to our group by clicking **Add Invitation** button in the **Invitations** below (Figure 8). A dialog appears (Figure 9) from which one can select users to invite. Only users, which are not group members yet are shown.

<figure>
  <img src="images/sendinginvitation.png" width="70%">
  <figcaption>Figure 8. Group management, sending invitation</figcaption>
</figure>

<figure>
  <img src="images/sendinginvitation2.png" width="70%">
  <figcaption>Figure 9. Group management, selecting users to invite</figcaption>
</figure>

If there are new invitations to a particular user, they appear in the top bar as shown in Figure 10. One can click the button and accept or reject an invitation from the menu (Figure 11).

<figure>
  <img src="images/recvinvitation.png" width="70%">
  <figcaption>Figure 10. Receiving invitation</figcaption>
</figure>

<figure>
  <img src="images/acceptinvitation.png" width="70%">
  <figcaption>Figure 11. Accepting an invitation</figcaption>
</figure>

If one wishes to change some of their profile parameters, such as e-mail address, one can click the user button in top bar on the right as shown in Figures 12 and 13.

<figure>
  <img src="images/gotoprofile.png" width="70%">
  <figcaption>Figure 12. Go to the user profile</figcaption>
</figure>

<figure>
  <img src="images/userprofile.png" width="70%">
  <figcaption>Figure 13. User profile</figcaption>
</figure>

## Requirements for the implementation

The requirements for the Texter are listed below:

- A user can create an account based on username, password, name and e-mail address.
- A user can modify the mentioned password and email.
- A user can create groups with names and textual descriptions.
- A user can invite other users to the groups.
- A user can cancel a sent invitation before it is accepted.
- A user can accept or reject invitations from other users to their groups.
- Upon accepting an invitation to a group, a user becomes a member of a group with two role options: member or admin.
- A user can create discussion topics within groups they have created or in which they have admin rights.
- A user can write text messages to the topics, which belong to groups they own or are members or admins of
- A user can leave a group.
- Users can view their groups, topics and discussions both of which they own and are members of.
- Users can manage groups they own by sending invitations to users not yet in the group and removing users from the group.
- Users can manage groups they own by changing their name and description.
- Users can manage groups they own by removing discussion topics and their contents belonging to a particular group.

## Technology stack

The Texter app utilises the following technologies:

- React, Redux, Material UI and React Hook Forms for its frontend
- GraphQL (Apollo) in client server communication and state management via its queries, mutations, subscriptions and its cache
- Node, Express, Mongoose and Mongo in its server side implementation
- Cypress for integration testing, Jest for server side API and client side component tests

The repositries are in GitHub and GitHub Actions have been configured to deliver code via accepted pull requests to testing and deployment to Azure App Service. The CI/CD pipeline uses a protected main branch for delivery to production. To qualify for deployment, code must pass linting, component, API and integration testing within the pipeline. Cypress Dashboard has been used to observe test progess and results in the pipeline. 

## Notes on installation

One needs to have Node and an accessible Mongo database installed, after that one can clone the repository from GitHub to a local machine, change to the project root directory and do ```npm install```. For a development setup one needs to have two .env files, one in the server subdirectory and the other in the www-client subdirectory. These files include environment variables used by the server and the client respectively.

### Server dot env file

One needs to define the port the server is listening to and development and test connection urls of the MongoDB installation. Here is an example of a setup with local development and testing connections as well as a production MongoDB ATLAS connection:

```javascript
PORT=8080
DEV_MONGODB_URI=mongodb://root:some_password_for_mongo@localhost:27017/texterdev?authsource=admin
TEST_MONGODB_URI=mongodb://root:some_password_for_mongo@localhost:27017/textertest?authsource=admin
PROD_MONGODB_URI=mongodb+srv://some_username:some_password_for_atlas@your_atlas_hostname/texter?retryWrites=true&w=majority
SECRET=somejwtsecret
```

You need to replace ```<some_password_for_mongo>```, ```<some_password_for_atlas>``` and ```<your_atlas_hostname>``` according to your installation values. Note that the ```SECRET```-variable is a character string used to encode JSON Web Tokens and do comparisons between encoded strings by jsonwebtoken-library, so choose a suitable string and insert it here.

### WWW-client dot env file

For development purposes the front end uses two addresses, one for the API and one for a websocket interface in the following fashion:

```javascript
REACT_APP_API_ENDPOINT=http://localhost:8080/api
REACT_APP_WS_ENDPOINT=ws://localhost:8080/
```

The websocket interface is used by GraphQL subscription service.

### Running the application locally

The root level package.json has some options to run the setup in development or test mode. To start both the client and the server for development, one needs to issue ```npm run dev``` -command from the terminal in the project root directory. Note that the mongodb needs to be up and running and that the connection string is correctly configured in the server/.env.

To run client side component tests one can issue npm run component-test -command at the project root directory. To run server side API test one can run ```npm run api-test``` in the project root. Running integration tests locally on needs to run build first for the frontend: npm run build in the project. Then one has to start the server in the test mode by running ```npm start:test``` and finally from a separate terminal ```npm run e2e-test```.

## CI/CD & Running in Azure

Currently there is a GitHub action workflow file in .github/workflows/, which specifies build, test and deployment steps to eventually deploy to Azure App Service. It is worth noting that the testing step requires environment variables (```PROD_MONGDB_URI```, ```TEST_MONGODB_URI```, ```SECRET``` and ```PORT``` as well as ```REACT_APP_API_TEST_ENDPOINT``` and ```REACT_APP_WS_TEST_ENDPOINT```) to be specified in GitHub repository secrets and variable settings, otherwise the test run or will fail. In Cypress testing ```REACT_APP_*``` endpoints refer to localhost. 

The deployment step requires variables ```REACT_APP_API_PROD_ENDPOINT``` and ```REACT_APP_WS_PROD_ENDPOINT``` to be specified in GitHub settings and they refer to the production addresses of the server. Also a Azure publish-profile key is required. In Azure portal secrets ```PROD_MONGDB_URI```, ```TEST_MONGODB_URI```, ```SECRET```, ```PORT``` have to be specified.

The testing step includes API, UI component and E2E tests made with Jest and Cypress. Due to the fact that Cypress E2E tests can express pretty different behavior in a local machine compared to while running via actions in the pipeline, cloud based Cypress Dashboard was used to record artifacts, such as screenshots from the pipeline runs. For this to work one needs to setup a Cypress Cloud account (https://www.cypress.io/), create a project and configure the repository workflow file accordingly, e.g. incorporate related environment variables to the cypress running action definition (```CYPRESS_RECORD_KEY``` from the dashboard and the ```GITHUB_TOKEN```).

## On software architecture and project structure

The functional blocks of the application include the web page based client, a server and a Mongo database. The communication between the client and the server happens via GraphQL queries, mutations and subscriptions. However in test mode the server responds to some REST-style endpoints (```/test/addusers``` to add some test users and ```/test/users``` to list users). There is currently also a health check endpoint at ```/health```, which returns status code 200.

In general the application is fairly dynamic in its nature in the sense that several subscrioptions are used to signal corresponding clients of such events as user group invitations, messages and leaving from a group.

The repository contains both client and server files in its subfolders ```www-client``` and ```server``` respectively. The outline of the directory structure is presented below in figure 14. Some folders are omitted here, such as ```./.github``` or ```./server/build```.

<figure>
  <img src="images/folders.png" width="40%" height="40%">
  <figcaption>Fig 14. Project folder structure</figcaption>
</figure>
<br />
<br />

The top level includes subfolders for workflows (.github/workflows) and the mentioned package.json file, which refers to running targets of specified in server/package.json and www-client/package.json.

### Server

The server utilises a layered approach to handling incoming requests. GraphQL definitions and resolver code modules reside in ```./server/graphql``` folder in ```*.resolver.js``` files. The resolvers use model functions located at ```./server/models``` folder to access database and other services. The model functions are located in ```*.model.js``` files. The Mongoose schema definitions for Mongo also reside in ```./server/models/*.mongo.js``` files. The functionality is split up to different files according to concepts in the application, such as groups, invitations, messages, topics and users. Each area of functionality has a corresponding resolver, model and schema definition file. API test files (```*.test.js```) are located within the graphql directory alongside with the resolver files.

Cypress E2E test code and helper files are located in the server side ```./server/cypress``` subfolder. Routes contain router modules used to serve the REST-style endpoints. Services folder contains modules used with functionality to launch Apollo and connect/disconnect to/from Mongo. Utils folder has module files containing functionality used in many different parts of the application, such as user permission, JWT token, environment configuration handling as well as logging.

In server launch the main entrypoint is in index.js, which uses functionality in server.js to launch express server to serve the REST endpoints and the frontend, Apollo as middleware and websocket services needed to run GraphQL subscriptions. Mongo connection is also initiated.

### WWW-client

The client follows an encapsulation philosophy, in which the network access is hidden from the UI components to custom hooks in ```./www-client/src/hooks```. UI is split to pages corresponding to the main screen views visibile to the user and other components used by pages such as dialogs, forms or drop down menus. Client state is managed by Redux and Apollo cache with the following division of responsibility: general UI related state is taken care by Redux and state related to the information retrieved from the server is mostly handled by Apollo and its cache. Redux is used in conjunction with error and notification messaging and holding selection information: which group and topic is currently selected. Apollo cache is relied on in information related to user group memebership, pending invitations to groups, particular topic related messages and so forth.

## Limitations

There are some limitations in the current implementation. Some of them are listed to below. Naturally it is possible to improve on these areas in the future.

- UI does not scale well for small displays.
- The messaging itself is limited to simple text messages. Images and other information types would be beneficial as part of the messages.
- Only simple password authentication is provided.
- Testing code emphasizes E2E tests at the moment and especially UI component tests are very limited.
