import mongoose from "mongoose";

const routeSchema = mongoose.Schema({
  name: { type: String, required: true },
  road: { type: String, default: "" }, // "gt-road", "motorway", "bypass", "within-city", "other"
  city: { type: String },
  buses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],
  stops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stop" }],
});

let Route;
try {
  Route = mongoose.model("Route");
} catch (e) {
  Route = mongoose.model("Route", routeSchema);
}

export default Route;
