import express from "express"
import asyncHandler from "express-async-handler"
import { ForbiddenError } from "../core/CustomError.js"
import Role from "../modals/role.model.js"

const router = express.Router()

router.use(
  asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.roles || !req.currentRoleCodes) {
      throw new ForbiddenError("Permission Denied")
    }

    const roles = await Role.find({
      code: {
        $in: req.currentRoleCodes,
      },
      status: true,
    })

    if (!roles.length) throw new ForbiddenError("Permission Denied")

    const roleids = roles.map(role => role._id.toString())

    let authorized = false

    for (const userRole of req.user.roles) {
      if (authorized) break
      if (roleids.includes(userRole.toString())) {
        authorized = true
        break
      }
    }

    if (!authorized) throw new ForbiddenError("Permission Denied")

    return next()
  })
)

export default router
