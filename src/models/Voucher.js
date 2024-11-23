import mongoose from "mongoose";

const voucherSchema = mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  feeInterval: { type: mongoose.Schema.Types.ObjectId, ref: "FeeInterval" },
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
});

let Voucher;
try {
  Voucher = mongoose.model("Voucher");
} catch (e) {
  Voucher = mongoose.model("Voucher", voucherSchema);
}

export default Voucher;
