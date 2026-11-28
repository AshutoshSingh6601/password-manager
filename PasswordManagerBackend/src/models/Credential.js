import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User ID is required"],
      index: true
    },
    websiteURL: {
      type: String,
      trim: true,
      default: ""
    },
    websiteName: {
      type: String,
      trim: true,
      default: ""
    },
    email: {
      type: String,
      trim: true,
      default: ""
    },
    username: {
      type: String,
      required: [true, "Username or account identifier is required"],
      trim: true
    },
    password: {
      type: String,
      required: [true, "Encrypted password is required"]
    },
    iv: {
      type: String,
      required: [true, "Initialization Vector is required"]
    },
    tag: {
      type: String,
      default: ""
    },
    algorithm: {
      type: String,
      default: "aes-256-gcm"
    }
  },
  {
    timestamps: true
  }
);

// Optimize queries filtering by user and sorting by creation time
credentialSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Credential", credentialSchema);
