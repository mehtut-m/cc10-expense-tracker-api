const express = require("express");

const categoryRoute = require("./routes/categoryRoute");
const transactionRoute = require("./routes/transactionRoute");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/category", categoryRoute);
app.use("/transaction", transactionRoute);

app.use((req, res) => {
  res.status(404).json({ message: "resource not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: err.message });
});
app.listen(8888, () => console.log("Expense Server is running"));
