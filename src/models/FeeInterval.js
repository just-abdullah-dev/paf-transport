import mongoose from "mongoose";

const feeIntervalSchema = mongoose.Schema({
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  noOfMonths: { type: Number },
  namesOfMonths: [{ type: String }],
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  voucherStatus: {type: String, enum: ["generated", "not-generated"], default: "not-generated"}
});

let FeeInterval;
try {
  FeeInterval = mongoose.model("FeeInterval");
} catch (e) {
  FeeInterval = mongoose.model("FeeInterval", feeIntervalSchema);
}

export default FeeInterval;
