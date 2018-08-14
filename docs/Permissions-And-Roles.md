# Access, permissions and roles

## Roles 

We store roles in `usersData` collections. The following Stitch 
functions use that collection to determine user's role. We also
fetch [usersData record](../src/app/core/model/user.ts) into 
frontend app, so UI is aware of user's roles.

Each user's document in `usersData` collection has at least 
the following data:
```
roles: {
  admin?: boolean,
  editor?: boolean,
}
```

Stitch functions used in roles, which use the `usersData` info: 
```
isAdmin()
isEditor()
```

#### Admin role
For the future. Can do anything. Not used ATM.

#### Publisher
For the future. Not implemented yet.
Users who can set `publish` status on the event.

#### Editor
Users who can edit/contribute to any event.

#### Event Owner
Document owner (for events). User who owns the document can do
anything with it. When authenticated user submits new events (anyone
can do that when logged in), it automatically becomes the owner of that
record.
