// role.middleware.js
export default function roleMiddleware(...roleCodes) {
  return (req, res, next) => {
    req.currentRoleCodes = roleCodes; // Inject roles into request
    next();
  };
}
