require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3939;

app.use(cors());
app.use(express.json());

//* ———————————————[Event]———————————————
const Field = require("./Data/localStorage");
const storageFile = new Field();
app.use((req, res, next) => {
  req.field = storageFile;
  next();
});
//* ——————————————————————————————————————————

//* ———————————————[Router]———————————————

//!TODO GET
//!TODO POST
const updata = require("./Router/Post/data");
const { Login, setAdmin } = require("./Router/Post/auth");
const { getDataWithMonth } = require("./Router/Get/user_data");
app.use("/api", Login);
app.use("/api", setAdmin);
app.use("/api", updata);
app.use("/api", getDataWithMonth);

//* ——————————————————————————————————————————

app.listen(port, () => console.log(`Sever running port: ${port}`));
