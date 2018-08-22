/**
 * Return TRUE if user is editor
 * ie. has editor (or admin) role.
 */
exports = function(user) {
  // const result = context.functions.execute("getUserRoles", userId);
  // return result.then((roles) => {
  //   return roles && (roles.admin || roles.editor) || false;
  // });
  return !!user && !!user.identities && !!user.identities[0] && 'anon-user' !== user.identities[0].provider_type;
};
