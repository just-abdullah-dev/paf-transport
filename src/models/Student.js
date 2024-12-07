import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  reg: { type: String, required: true },
  program: { type: String },
  department: { type: String },
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  stop: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  fees: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudentVoucher" },],
});

let Student;
try {
  Student = mongoose.model("Student");
} catch (e) {
  Student = mongoose.model("Student", studentSchema);
}

export default Student;
