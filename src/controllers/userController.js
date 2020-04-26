import mongoose from "mongoose"
import userModel from "../models/userModel"
import saveFile from "../functions/saveFile"

const user = mongoose.model("user", userModel)

const signUp = (req, res) =>
{
    delete req.body.is_verified
    delete req.body.phone_verified
    delete req.body.email_verified
    delete req.body.created_date

    saveFile({file: req.files ? req.files.avatar : null, folder: "pictures"})
        .then(avatar =>
        {
            const newUser = new user({...req.body, avatar})
            newUser.save((err, _) =>
            {
                if (err) res.status(400).send(err)
                else res.send({message: "user created! wait for verify!"})
            })
        })
        .catch(err => res.status(500).send(err))
}

const verifyUser = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {user_id} = req.body
        if (user_id)
        {
            user.findOneAndUpdate(
                {_id: user_id},
                {is_verified: true},
                {new: true, useFindAndModify: false, runValidators: true},
                (err, _) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send({message: "done!"})
                },
            )
        }
        else res.status(400).send({message: "send user_id"})
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const userController = {
    signUp,
    verifyUser,
}

export default userController