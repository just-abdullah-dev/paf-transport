import mongoose from "mongoose";

const routeVoucherSchema = mongoose.Schema({
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  fee: { type: mongoose.Schema.Types.ObjectId, ref: "Fee" },
  feeInterval: { type: mongoose.Schema.Types.ObjectId, ref: "FeeInterval" },
  totalAmount: { type: Number },
  finePerDay: { type: Number },
});

let RouteVoucher;
try {
  RouteVoucher = mongoose.model("RouteVoucher");
} catch (e) {
  RouteVoucher = mongoose.model("RouteVoucher", routeVoucherSchema);
}

export default RouteVoucher;
