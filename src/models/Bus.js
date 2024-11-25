import mongoose from "mongoose";

const busSchema = mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String },
  seats: { type: Number },
  status: { type: String, enum: ["active", "maintenance"], default: "active" },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
 
let Bus;
try {
  Bus = mongoose.model("Bus");
} catch (e) {
  Bus = mongoose.model("Bus", busSchema);
}

export default Bus;
