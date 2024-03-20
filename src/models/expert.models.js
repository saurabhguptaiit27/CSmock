import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// const availabilitySchema = new mongoose.Schema({
//     date: {
//         type: Date,
//         required: true
//     },
//     timeSlots: [{
//         type: Date,
//         required: true
//     }]
// });

const expertSchema = new Schema(
  {
    userType: {
      type: String,
      default: "Expert",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    currentPosition: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    experience: {
      type: Number,
      required: true,
      default: 0,
    },
    expertise: [
      {
        type: String,
      },
    ],
    previousCompanies: [
      {
        type: String,
      },
    ],
    // proficiency: {
    //     type: String,
    //     enum: ["Beginner", "Intermediate", "Expert"],
    //     required: [true, "This field should be filled carefully."]
    // },
    // availability: {
    //     type: [availabilitySchema]
    // },
    availability: [
      {
        type: String,
      },
    ],
    fees: {
      type: Number,
      required: true,
    },
    bookingHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    feedbackHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feedback",
      },
    ],
    postHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

expertSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

expertSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

expertSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
expertSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Expert = mongoose.model("Expert", expertSchema);
