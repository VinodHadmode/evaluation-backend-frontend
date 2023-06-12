const express = require("express")
const bcrypt = require('bcrypt');
const { UserModel } = require("../models/user.model");
var jwt = require('jsonwebtoken');


const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    const { name, email, pass, gender, age, city, is_married } = req.body

    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            res.status(200).json({ msg: "User is already present" })
        } else {
            bcrypt.hash(pass, 5, async (err, hash) => {
                if (hash) {
                    const user = new UserModel({ name, email, pass: hash, gender, age, city, is_married })
                    await user.save()
                    res.status(200).json({ msg: "New user has been registered" })

                } else {
                    res.status(200).json({ err: err })
                }
            });
        }


    } catch (error) {
        res.status(400).json({ error: error })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            bcrypt.compare(pass, user.pass, (err, result) => {
                if (result) {
                    var token = jwt.sign({ userID: user._id}, 'masai', {
                        expiresIn: "7 days"
                    });
                    if (token) {
                        res.status(200).json({ msg: "Logged in succesfully!", token: token })
                    } else {
                        res.status(200).json({ msg: "token not generated" })
                    }
                } else {
                    res.status(200).json({ msg: "Wrong credentials!!" })
                }
            });
        } else {
            res.status(200).json({ msg: "User not exists!!" })
        }

    } catch (error) {
        res.status(400).json({ error: error })
    }
})


module.exports = {
    userRouter
}