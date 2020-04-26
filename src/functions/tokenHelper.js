import jwt from "jsonwebtoken"
import data from "../data"
import adminController from "../controllers/adminController"

const encodeToken = (payload) =>
{
    return new Promise((resolve, reject) =>
        jwt.sign(payload, data.sign, {algorithm: "HS512"}, (err, token) =>
        {
            if (err) reject(err)
            else resolve(token)
        }),
    )
}

const decodeToken = (token) =>
{
    return new Promise((resolve, reject) =>
        jwt.verify(token, data.sign, {algorithm: "HS512"}, (err, payload) =>
        {
            if (err) reject({status: 403, err})
            else
            {
                const {username, password} = payload
                adminController.getAdminFunc({username, password})
                    .then((result) => resolve(result.takenAdmin))
                    .catch((result) => reject({status: result.status, err: result.err}))
            }
        }),
    )
}

const tokenHelper = {
    encodeToken,
    decodeToken,
}

export default tokenHelper
