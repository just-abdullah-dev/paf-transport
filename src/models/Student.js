import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  reg: { type: String, required: true },
  program: { type: String },
  department: { type: String },
  stop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  feeTracking: [{ type: mongoose.Schema.Types.ObjectId, ref: "Voucher" }],
});

let Student;
try {
  Student = mongoose.model("Student");
} catch (e) {
  Student = mongoose.model("Student", studentSchema);
}

export default Student;
