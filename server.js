const express = require("express");
const mongoose = require("mongoose");

const app = express();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/citibikes";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected : %s", MONGO_URI))
  .catch((err) => console.log(err));

const processor = require("./src/processor");

processor.main();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
