import mongoose from "mongoose";

const studentVoucherSchema = mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  routeVoucher: { type: mongoose.Schema.Types.ObjectId, ref: "RouteVoucher" },
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  notes: {type: String}
});
 
let StudentVoucher;
try {
  StudentVoucher = mongoose.model("StudentVoucher");
} catch (e) {
  StudentVoucher = mongoose.model("StudentVoucher", studentVoucherSchema);
}

export default StudentVoucher;
