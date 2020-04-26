import mongoose from "mongoose"
import documentModel from "../models/documentModel"
import saveFile from "../functions/saveFile"

const document = mongoose.model("document", documentModel)

const addDocument = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        saveFile({file: req.files ? req.files.thumbnail : null, folder: "pictures"})
            .then(thumbnail =>
            {
                saveFile({file: req.files ? req.files.film : null, folder: "videos"})
                    .then(film =>
                    {
                        const newDocument = new document({...req.body, thumbnail, film})
                        newDocument.save((err, createdDocument) =>
                        {
                            if (err) res.status(400).send(err)
                            else res.send(createdDocument)
                        })
                    })
                    .catch(err => res.status(500).send(err))
            })
            .catch(err => res.status(500).send(err))
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const documentController = {
    addDocument,
}

export default documentController