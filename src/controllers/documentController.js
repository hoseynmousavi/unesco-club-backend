import mongoose from "mongoose"
import documentModel from "../models/documentModel"
import saveFile from "../functions/saveFile"
import categoryModel from "../models/categoryModel"
import documentCategoryModel from "../models/documentCategoryModel"
import documentFilmModel from "../models/documentFilmModel"
import documentPictureModel from "../models/documentPictureModel"

const document = mongoose.model("document", documentModel)
const category = mongoose.model("category", categoryModel)
const documentCategory = mongoose.model("documentCategory", documentCategoryModel)
const documentFilm = mongoose.model("documentFilm", documentFilmModel)
const documentPicture = mongoose.model("documentPicture", documentPictureModel)

const addCategory = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        saveFile({file: req.files ? req.files.picture : null, folder: "pictures"})
            .then(picture =>
            {
                const newCategory = new category({...req.body, picture})
                newCategory.save((err, createdCategory) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send(createdCategory)
                })
            })
            .catch(err => res.status(500).send(err))
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const removeCategory = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {category_id} = req.body
        if (category_id)
        {
            documentCategory.find({category_id}, (err, records) =>
            {
                if (records.length > 0) res.status(403).send({message: "it is using!"})
                else
                {
                    category.deleteOne({_id: category_id}, err =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send({message: "done!"})
                    })
                }
            })
        }
        else res.status(400).send({message: "send category_id!"})
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const getCategories = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    category.find(null, null, {sort: "-created_date", skip, limit}, (err, categories) =>
    {
        if (err) res.status(400).send(err)
        else res.send(categories)
    })
}

const getDocumentsForUsers = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    document.find({is_deleted: false}, null, {sort: "-created_date", skip, limit}, (err, documents) =>
    {
        if (err) res.status(400).send(err)
        else res.send(documents)
    })
}

const getDocuments = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    document.find({is_deleted: false}, null, {sort: "-created_date", skip, limit}, (err, documents) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            documentPicture.find({document_id: {$in: documents.reduce((sum, doc) => [...sum, doc._id], [])}}, (err, pictures) =>
            {
                if (err) res.status(400).send(err)
                else
                {
                    documentFilm.find({document_id: {$in: documents.reduce((sum, doc) => [...sum, doc._id], [])}}, (err, films) =>
                    {
                        if (err) res.status(400).send(err)
                        else
                        {
                            documentCategory.find({document_id: {$in: documents.reduce((sum, doc) => [...sum, doc._id], [])}}, (err, docCats) =>
                            {
                                if (err) res.status(400).send(err)
                                else
                                {
                                    category.find({_id: {$in: docCats.reduce((sum, docCat) => [...sum, docCat.category_id], [])}}, (err, categories) =>
                                    {
                                        if (err) res.status(400).send(err)
                                        else
                                        {
                                            const documentsObject = documents.reduce((sum, doc) => ({...sum, [doc._id]: doc.toJSON()}), {})
                                            const categoriesObject = categories.reduce((sum, cat) => ({...sum, [cat._id]: cat.toJSON()}), {})
                                            pictures.forEach(pic =>
                                            {
                                                documentsObject[pic.document_id] = {...documentsObject[pic.document_id], pictures: [...documentsObject[pic.document_id].pictures || [], {...pic.toJSON()}]}
                                            })
                                            films.forEach(film =>
                                                documentsObject[film.document_id] = {...documentsObject[film.document_id], films: [...documentsObject[film.document_id].films || [], {...film.toJSON()}]},
                                            )
                                            docCats.forEach(docCat =>
                                                documentsObject[docCat.document_id] = {...documentsObject[docCat.document_id], categories: [...documentsObject[docCat.document_id].categories || [], {...categoriesObject[docCat.category_id]}]},
                                            )
                                            res.send(Object.values(documentsObject))
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

const addDocument = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        saveFile({file: req.files ? req.files.thumbnail : null, folder: "pictures"})
            .then(thumbnail =>
            {
                const newDocument = new document({...req.body, thumbnail})
                newDocument.save((err, createdDocument) =>
                {
                    if (err) res.status(400).send(err)
                    else
                    {
                        const newDocument = {...createdDocument.toJSON()}
                        const categories = req.body.categories ? JSON.parse(req.body.categories) : []

                        let videos = []
                        if (req.files)
                        {
                            const keys = Object.keys(req.files).filter(file => file.includes("film"))
                            keys.forEach(key => videos.push({file: req.files[key], description: req.body[key]}))
                        }

                        let pictures = []
                        if (req.files)
                        {
                            const keys = Object.keys(req.files).filter(file => file.includes("picture"))
                            keys.forEach(key => pictures.push({file: req.files[key], description: req.body[key]}))
                        }

                        saveCategories(categories, createdDocument._id, newDocument).then(() => savePictures(pictures, createdDocument._id, newDocument).then(() => saveFilms(videos, createdDocument._id, newDocument).then(() => res.send(newDocument))))
                    }
                })
            })
            .catch(err => res.status(500).send(err))
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const saveCategories = (categories, document_id, newDocument) =>
{
    return new Promise(resolve =>
    {
        if (categories.length > 0)
        {
            categories.forEach((item, index) =>
            {
                new documentCategory({category_id: item, document_id}).save(() =>
                {
                    newDocument.categories = [...newDocument.categories || [], item]
                    if (index === categories.length - 1) resolve()
                })
            })
        }
        else resolve()
    })
}

const savePictures = (pictures, document_id, newDocument) =>
{
    return new Promise(resolve =>
    {
        if (pictures.length > 0)
        {
            pictures.forEach((item, index) =>
            {
                saveFile({file: item.file, folder: "pictures"})
                    .then(file => new documentPicture({file, description: item.description, document_id}).save((err, created) =>
                    {
                        newDocument.pictures = [...newDocument.pictures || [], created]
                        if (index === pictures.length - 1) resolve()
                    }))
            })
        }
        else resolve()
    })
}

const saveFilms = (films, document_id, newDocument) =>
{
    return new Promise(resolve =>
    {
        if (films.length > 0)
        {
            films.forEach((item, index) =>
            {
                saveFile({file: item.file, folder: "videos"})
                    .then(file => new documentFilm({file, description: item.description, document_id}).save((err, created) =>
                    {
                        newDocument.films = [...newDocument.films || [], created]
                        if (index === films.length - 1) resolve()
                    }))
            })
        }
        else resolve()
    })
}

const getDocumentById = (req, res) =>
{
    const {document_id} = req.params
    if (document_id)
    {
        document.findOne({is_deleted: false, _id: document_id}, (err, takenDocument) =>
        {
            if (err) res.status(400).send(err)
            else if (!takenDocument) res.status(404).send({message: "not found"})
            else
            {
                documentPicture.find({document_id: takenDocument._id}, (err, pictures) =>
                {
                    if (err) res.status(400).send(err)
                    else
                    {
                        documentFilm.find({document_id: takenDocument._id}, (err, films) =>
                        {
                            if (err) res.status(400).send(err)
                            else
                            {
                                documentCategory.find({document_id: takenDocument._id}, (err, docCats) =>
                                {
                                    if (err) res.status(400).send(err)
                                    else
                                    {
                                        category.find({_id: {$in: docCats.reduce((sum, docCat) => [...sum, docCat.category_id], [])}}, (err, categories) =>
                                        {
                                            if (err) res.status(400).send(err)
                                            else
                                            {
                                                let documentObject = takenDocument.toJSON()
                                                documentObject = {...documentObject, pictures, films, categories}
                                                res.send(documentObject)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
    else res.status(400).send({message: "send document_id!"})
}

const addDocumentCategory = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {category_id, document_id} = req.body
        if (category_id && document_id)
        {
            new documentCategory({category_id, document_id}).save((err) =>
            {
                if (err) res.status(400).send(err)
                else res.send({message: "done!"})
            })
        }
        else res.status(400).send({message: "send category_id && document_id!"})
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const deleteDocumentCategory = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {category_id, document_id} = req.body
        if (category_id && document_id)
        {
            documentCategory.deleteOne({category_id, document_id}, err =>
            {
                if (err) res.status(400).send(err)
                else res.send({message: "done!"})
            })
        }
        else res.status(400).send({message: "send category_id && document_id!"})
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const updateDocument = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {document_id} = req.body
        saveFile({file: req.files ? req.files.thumbnail : null, folder: "pictures"})
            .then(thumbnail =>
            {
                let updateTemp = {...req.body}
                if (thumbnail) updateTemp.thumbnail = thumbnail
                document.findOneAndUpdate(
                    {_id: document_id},
                    updateTemp,
                    {new: true, useFindAndModify: false, runValidators: true},
                    (err, updated) =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send(updated)
                    },
                )
            })
            .catch(err => res.status(500).send(err))
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const addDocumentPicture = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {document_id, description} = req.body
        const file = req.files ? req.files.file : null
        if (file && document_id)
        {
            saveFile({file: file, folder: "pictures"})
                .then(file => new documentPicture({file, description, document_id}).save((err, created) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send(created)
                }))
        }
        else res.status.send({message: "please send document_id && file"})
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const removeDocumentPicture = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {picture_id} = req.body
        documentPicture.deleteOne({_id: picture_id}, err =>
        {
            if (err) res.status(400).send(err)
            else res.send({message: "done!"})
        })
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const addDocumentFilm = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {document_id, description} = req.body
        const file = req.files ? req.files.file : null
        if (file && document_id)
        {
            saveFile({file: file, folder: "videos"})
                .then(file => new documentFilm({file, description, document_id}).save((err, created) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send(created)
                }))
        }
        else res.status.send({message: "please send document_id && file"})
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const removeDocumentFilm = (req, res) =>
{
    if (req.headers.authorization.username)
    {
        const {film_id} = req.body
        documentFilm.deleteOne({_id: film_id}, err =>
        {
            if (err) res.status(400).send(err)
            else res.send({message: "done!"})
        })
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const getPictures = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    documentPicture.find(null, null, {sort: "-created_date", skip, limit}, (err, pictures) =>
    {
        if (err) res.status(400).send(err)
        else res.send(pictures)
    })
}

const getFilms = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 5
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    documentFilm.find(null, null, {sort: "-created_date", skip, limit}, (err, films) =>
    {
        if (err) res.status(400).send(err)
        else res.send(films)
    })
}

const documentController = {
    addCategory,
    removeCategory,
    getCategories,
    getDocumentsForUsers,
    getDocuments,
    addDocument,
    updateDocument,
    getDocumentById,
    addDocumentCategory,
    deleteDocumentCategory,
    addDocumentPicture,
    removeDocumentPicture,
    addDocumentFilm,
    removeDocumentFilm,
    getPictures,
    getFilms,
}

export default documentController