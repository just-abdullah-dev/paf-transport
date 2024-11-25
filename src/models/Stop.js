import mongoose from "mongoose";

const stopSchema = mongoose.Schema({
  name: { type: String, required: true },
  pickTime: { type: String },
  dropTime: { type: String },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
});
 
let Stop;
try {
  Stop = mongoose.model("Stop");
} catch (e) {
  Stop = mongoose.model("Stop", stopSchema);
}

export default Stop;
