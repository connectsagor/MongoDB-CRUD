const dotenv = require("dotenv");
const express = require("express");
var bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const uri = process.env.DATABASE;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must have a name"],
  },
  age: Number,
});

const Name = mongoose.model("Name", userSchema);

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/addName", async (req, res, next) => {
  const userData = req.body;

  Name.insertMany(userData).then((result) => {
    console.log("data is sent");
  });
  res.send("Success");
  next();
});

app.get("/name", async (req, res) => {
  const data = await Name.find({});
  res.send(data);
});

app.delete("/delete/:id", (req, res) => {
  Name.deleteOne({ _id: new ObjectId(req.params.id) }).then((result) => {
    console.log(result);
  });
  console.log(req.params.id);
});
// const getData = async (req, res) => {
//   const data = await Name.find();
//   console.log(data);
// };

// getData();

// const NewUser = new Name({
//   name: "Sagor",

//   age: 21,
// });

// NewUser.save()
//   .then(() => {
//     console.log("added user");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.listen(PORT, () => console.log("app is running on port 3000"));
