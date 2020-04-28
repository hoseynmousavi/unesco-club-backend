import mongoose from "mongoose"
import documentModel from "../models/documentModel"
import saveFile from "../functions/saveFile"
import categoryModel from "../models/categoryModel"
import documentCategoryModel from "../models/documentCategoryModel"

const document = mongoose.model("document", documentModel)
const category = mongoose.model("category", categoryModel)
const documentCategory = mongoose.model("documentCategory", documentCategoryModel)

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
            category.deleteOne({_id: category_id}, err =>
            {
                if (err) res.status(400).send(err)
                else res.send({message: "done!"})
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
                        res.send(createdDocument)
                        const categories = JSON.parse(req.body.categories)
                        categories.forEach(item => new documentCategory({category_id: item, document_id: createdDocument._id}).save())
                    }
                })
            })
            .catch(err => res.status(500).send(err))
    }
    else res.status(403).send({message: "don't have permission babe!"})
}

const documentController = {
    addCategory,
    removeCategory,
    getCategories,
    addDocument,
}

export default documentController