const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const express = require("express");
const app = express();
const hbs = require("hbs");
const User = require("./models/user");
const router=require("./router/userrout")
require("./db/conn");

const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialsPath);
app.use(router)

app.listen(port, () => {
  console.log(`Connected at Port ${port}`);
});
