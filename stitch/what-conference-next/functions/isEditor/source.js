/**
 * Return TRUE if user is editor
 * ie. has editor (or admin) role.
 */
exports = function(userId){
  const result = context.functions.execute("getUserRoles", userId);
  return result.then((roles) => {
    return roles && (roles.admin || roles.editor) || false;
  });
};
