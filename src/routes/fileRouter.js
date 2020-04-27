import path from "path"

const fileRouter = (app, dirname) =>
{
    app.route("/media/:folder/:file").get((req, res) =>
    {
        res.setHeader("Cache-Control", "max-age=31536000")
        res.sendFile(path.join(dirname, `/media/${req.params.folder}/${req.params.file}`))
    })
}

export default fileRouter