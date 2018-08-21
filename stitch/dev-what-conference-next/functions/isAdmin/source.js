/**
 * Return TRUE if user has an admin role
 */
exports = function(userId){
  const result = context.functions.execute("getUserRoles", userId);
  return result.then((roles) => {
    return roles && roles.admin || false;
  });
};
