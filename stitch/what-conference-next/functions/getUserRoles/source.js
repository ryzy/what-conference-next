/**
 * Gets user roles from usersData collection
 * or empty {} if no user nor roles in its data.
 */
exports = function(userId){
  const collection = context.services.get("mongodb-atlas").db("wcn-db").collection("usersData");
  return collection.findOne({ userId }).then(user => {
    return user && user.roles || {};
  });
};
