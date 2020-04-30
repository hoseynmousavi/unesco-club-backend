import mongoose from "mongoose"
import userModel from "../models/userModel"
import saveFile from "../functions/saveFile"

const user = mongoose.model("user", userModel)

const getUsersForUsers = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    const fields = "email name major grade university birth_date_year avatar range_of_activity specializations familiarity_with_language familiarity_with_area familiarity_with_tourism experience current_organ description created_date"
    user.find({is_deleted: false, is_verified: true}, fields, {sort: "-created_date", skip, limit}, (err, users) =>
    {
        if (err) res.status(400).send(err)
        else res.send(users)
    })
}

const getUsers = (req, res) =>
{
    if (req.headers.authorization && req.headers.authorization.username)
    {
        const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5
        const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
        user.find({is_deleted: false}, null, {sort: "-created_date", skip, limit}, (err, users) =>
        {
            if (err) res.status(400).send(err)
            else res.send(users)
        })
    }
    else res.status(403).send({message: "you don't have permission babe!"})
}

const signUp = (req, res) =>
{
    delete req.body.is_verified
    delete req.body.phone_verified
    delete req.body.email_verified
    delete req.body.created_date
    delete req.body.is_deleted

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
                {_id: user_id, is_deleted: false},
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

const removeUser = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {user_id} = req.body
        if (user_id)
        {
            user.findOneAndUpdate(
                {_id: user_id},
                {is_deleted: true},
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
    getUsersForUsers,
    getUsers,
    signUp,
    verifyUser,
    removeUser,
}

export default userController