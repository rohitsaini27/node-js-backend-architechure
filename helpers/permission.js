import { ForbiddenError } from "../core/CustomError.js";
// import { Permission } from "../modals/apiKey.modal.js";

function permission(requiredPermission) {
  return (req, res, next) => {
    try {
      if (!req.apiKey || !req.apiKey.permissions) {
        return next(new ForbiddenError("Permission Denied"));
      }

      const exists = req.apiKey.permissions.includes(requiredPermission);
      if (!exists) {
        return next(new ForbiddenError("Permission Denied"));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export default permission;
