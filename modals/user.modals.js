import mongoose, { Schema } from "mongoose"
import { DOCUMENT_NAME as ROLE_DOCUMENT_NAME } from "./role.model.js";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: ROLE_DOCUMENT_NAME,
        },
      ],
      required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})


// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");

//   this.passwordResetToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

//   return resetToken;
// };

// userSchema.index({email: 1});
userSchema.index({name: 1});

const User = mongoose.model("User", userSchema)

export default User
