const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Invalid Email");
        }
      },
    },

    mobile: {
      type: Number,
      required: true,
      trim: true,
      validate(val) {
        if (val.toString().length > 10) {
          throw new Error("Invalid Phone");
        }
      },
    },

    password: {
      type: String,
      trim: true,
      minlength: 6,
      maxLength: 20,
      required: true,
      validate(val) {
        if (val.toLowerCase().includes("password")) {
          throw new Error("This password is not valid");
        }
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profileImg: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.passwordCheck = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return false;
  }

  return user;
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = await jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.JWT_STRING,
    { expiresIn: "24h" }
  );

  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
