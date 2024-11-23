import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  role: { type: String, enum: ["bank", "admin", "driver"], required: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" }, // For drivers only
});

let User;
try {
  User = mongoose.model("User");
} catch (e) {
  User = mongoose.model("User", userSchema);
}

export default User;
