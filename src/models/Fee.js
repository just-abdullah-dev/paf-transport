import mongoose from "mongoose";

const feeSchema = mongoose.Schema({
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  perMonth: { type: Number, required: true },
  perDay: { type: Number },
});

let Fee;
try {
  Fee = mongoose.model("Fee");
} catch (e) {
  Fee = mongoose.model("Fee", feeSchema);
}

export default Fee;
