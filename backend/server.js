const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const port = 3001;

// Define Schema
const studentSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  standard: Number,
  section: String,
  roll: Number,
  address1: String,
  address2: String,
});

// craete a model
const Student = mongoose.model("student", studentSchema);

const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/students");
    console.log("Database is connected successfully...");
  } catch (error) {
    console.log(error);
  }
};

connectToDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.post("/students", async (req, res) => {
  try {
    const students = await Student.insertMany(req.body);
    res.json(students);
  } catch (error) {
    res.sendStatus(500);
  }
});
// app.put("/students", async (req, res) => {
//   const promises = req.body.data?.map(({ _id, ...rest }) =>
//     Student.findByIdAndUpdate(_id, rest, { new: true })
//   );
//   const results = await Promise.all(promises);
//   res.json(results)
// });
app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(student)
  } catch (error) {
    res.sendStatus(500);
  }

});

// app.delete("/students", async (req, res) => {
//   try {
//     await Student.deleteMany({ _id: { $in: req.body?.ids } });
//     res.sendStatus(204);
//   } catch (error) {
//     res.sendStatus(500);
//   }
// });

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id)
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
