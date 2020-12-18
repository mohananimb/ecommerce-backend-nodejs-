const express = require("express");
require("./db/mongoose");
const userRouter = require("./routes/User");
const app = express();

app.use(express.json());
app.use(userRouter);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});
