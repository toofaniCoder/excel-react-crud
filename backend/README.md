### Basic Starter Code
```javascript
const express = require("express");
const app = express();
const cors = require("cors");

const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/students", (req, res) => {
  res.send("Get All Students");
});

app.post("/students", (req, res) => {
  res.send("Create All Students");
});

app.put("/students", (req, res) => {
  res.send("Update All Students");
});

app.delete("/students", (req, res) => {
  res.send("Delete All Students");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

### Connect to the mongodb local database
```javascript
const mongoose = require("mongoose");
const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/students");
    console.log("Database is connected successfully...");
  } catch (error) {
    console.log(error);
  }
};

connectToDB();
```

### define schema
```js
// Define Schema
const { Schema } = mongoose;

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
```