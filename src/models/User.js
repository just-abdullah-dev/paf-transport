import mongoose from "mongoose";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  role: { type: String, enum: ["bank", "admin", "driver"], required: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" }, // For drivers only
}, {timestamps: true});


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateJWT = async function () {
  return sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return compare(enteredPassword, this.password);
};


let User;
try {
  User = mongoose.model("User");
} catch (e) {
  User = mongoose.model("User", userSchema);
}

export default User;
