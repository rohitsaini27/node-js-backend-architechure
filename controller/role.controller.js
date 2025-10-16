// controllers/role.controller.js
import { InternalServerError } from "../core/CustomError.js"
import Role from "../modals/role.model.js"

export const getRole = async (roleCode) => {
  try {
    console.log(roleCode, "rolecode");
    const userRole = await Role.findOne({
      code: roleCode,
      status: true,
    })

    if (!userRole) {
      throw new InternalServerError("User role not found")
    }

    return userRole._id
  } catch (error) {
    console.error(error)
    throw new InternalServerError("User role not found")
  }
}
