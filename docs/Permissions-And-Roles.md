# Access, permissions and roles

## Roles

#### Admin role
Can do anything.
We keep the list of admin users in Stitch Value `accessAdmins`.

#### Owner
Document owner (for events).
User who owns the document can edit it.

#### Publisher
TODO: Users who can set `publish` status on the event.

#### Editor
Users who can edit/contribute to any event.
We keep the list of admin users in Stitch Value `accessEditors`.

## Functions
```
isAdmin()
isEditor()
```

We store roles in `usersData` collections. The above functions
use these documents to check user's role.
