import mongoose from "mongoose"
import adminModel from "../models/adminModel"
import tokenHelper from "../functions/tokenHelper"

const admin = mongoose.model("admin", adminModel)

const addAdmin = (req, res) =>
{
    delete req.body.created_date

    const newAdmin = new admin(req.body)
    newAdmin.save((err, createdAdmin) =>
    {
        if (err) res.status(400).send(err)
        else res.send(createdAdmin)
    })
}

const adminLogin = (req, res) =>
{
    const {username, password} = req.body
    if (username && password)
    {
        getAdminFunc({username, password, fields: "name username created_date"})
            .then(result =>
                tokenHelper.encodeToken({username, password})
                    .then(token => res.send({...result.takenAdmin.toJSON(), token}))
                    .catch(err => res.status(500).send(err)),
            )
            .catch(result => res.status(result.status || 500).send(result.err))
    }
    else res.status(400).send({message: "send username && password!"})
}

const verifyToken = (req, res) =>
{
    const {_id} = req.headers.authorization
    admin.findById(_id, "name username created_date", null, (err, takenAdmin) =>
    {
        if (err) res.status(500).send(err)
        else res.send(takenAdmin.toJSON())
    })
}

const getAdminFunc = ({username, password, fields, options}) =>
{
    return new Promise((resolve, reject) =>
    {
        admin.findOne({username, password}, fields, options, (err, takenAdmin) =>
        {
            if (err) reject({status: 400, err})
            else if (!takenAdmin) reject({status: 404, err: {message: "not found!"}})
            else resolve({status: 200, takenAdmin})
        })
    })
}

const adminController = {
    addAdmin,
    adminLogin,
    verifyToken,
    getAdminFunc,
}

export default adminController