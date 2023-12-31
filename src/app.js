require("dotenv").config();
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const port = process.env.PORT || 5152;
require("./db/conn.js");
const Register = require("./model/register");


const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../Templates/views");
const partialPath = path.join(__dirname, "../Templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", templatePath);
hbs.registerPartials(partialPath);
app.use(express.static(staticPath));

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/home", (req, res) => {
    res.render("home");
});
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerStudent = new Register({
                username: req.body.username,
                email: req.body.mail,
                phonenumber: req.body.number,
                address: req.body.address,
                password: password,
                confirmpassword: cpassword,
            });
            const userEnroll = await Register.findOne({ email: mail });
            if (userEnroll != null) {
                res.status("404").render("errorpage", {
                    errorMessage: "user exist",
                });
            }
            else {
                const registered = await registerStudent.save();
                res.status(201).render("index");
            }
        } else {
            res.status("404").render("errorpage", {
                errorMessage: "password do not match",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).render("errorpage", {
            errorMessage: "Sorr, Looks like something is Wrong",
        });
    }
});

app.post("/login", async (req, res) => {
    try {
        const mail = req.body.email;
        const password = req.body.password;

        const userEnroll = await Register.findOne({ email: mail });

        if (password === userEnroll.password) {
            res.status(201).render("home", {
                "username": userEnroll.username,
                "mail": userEnroll.email,
                "number": userEnroll.phonenumber,
                "address": userEnroll.address,
            });
        } else {
            res.status(404).render("errorpage", {
                errorMessage: "Password or email do not match with the database",
            });
        }
    } catch (error) {
        res.status(404).render("errorpage", {
            errorMessage: "Login Detail do not match",
        });
        console.log(error);
    }
});

app.get("*", (req, res) => {
    res.render("errorpage", {
        errorMessage: "Where are you?Go back",
    }
    );
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
