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
