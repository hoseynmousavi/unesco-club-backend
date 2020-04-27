import tokenHelper from "./tokenHelper"

const addHeaderAndCheckPermissions = (app) =>
{
    app.use((req, res, next) =>
    {
        res.setHeader("Access-Control-Allow-Origin", "*")
        if (
            (req.originalUrl === "/") ||
            (req.originalUrl === "/admin/login/") ||
            (req.originalUrl === "/user/" && req.method === "POST")
        )
        {
            if (req.headers.authorization)
            {
                tokenHelper.decodeToken(req.headers.authorization)
                    .then((payload) =>
                    {
                        req.headers.authorization = {...payload.toJSON()}
                        next()
                    })
                    .catch(() => next())
            }
            else next()
        }
        else
        {
            if (req.headers.authorization)
            {
                tokenHelper.decodeToken(req.headers.authorization)
                    .then((payload) =>
                    {
                        req.headers.authorization = {...payload.toJSON()}
                        next()
                    })
                    .catch((result) => res.status(result.status || 403).send(result.err))
            }
            else res.status(401).send({message: "send token!"})
        }
    })
}

export default addHeaderAndCheckPermissions
