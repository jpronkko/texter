curl --request POST \
  -H 'Content-Type: application/json' \
  --data '{"query":"query foo { allUsers {name} }"}' \
  http://localhost:4000/graphql