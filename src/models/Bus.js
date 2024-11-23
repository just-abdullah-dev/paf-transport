import mongoose from "mongoose";

const busSchema = mongoose.Schema({
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  name: { type: String, required: true },
  number: { type: String },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seats: { type: Number },
  status: { type: String, enum: ["active", "maintenance"], default: "active" },
});

let Bus;
try {
  Bus = mongoose.model("Bus");
} catch (e) {
  Bus = mongoose.model("Bus", busSchema);
}

export default Bus;
