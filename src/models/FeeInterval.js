import mongoose from "mongoose";

const feeIntervalSchema = mongoose.Schema({
  fee: { type: mongoose.Schema.Types.ObjectId, ref: "Fee" },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  noOfMonths: { type: Number },
  namesOfMonths: [{ type: String }],
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  totalAmount: { type: Number },
  finePerDay: { type: Number },
});

let FeeInterval;
try {
  FeeInterval = mongoose.model("FeeInterval");
} catch (e) {
  FeeInterval = mongoose.model("FeeInterval", feeIntervalSchema);
}

export default FeeInterval;
