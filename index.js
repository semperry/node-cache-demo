const express = require("express");

const swapiRoutes = require("./swapiRoutes");

const app = express();
app.use(express.json());

app.use("/", swapiRoutes);

app.listen(4000, () => console.log("Server listening on " + 4000));
