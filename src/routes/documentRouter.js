import documentController from "../controllers/documentController"

const documentRouter = (app) =>
{
    app.route("/document")
        .post(documentController.addDocument)

    app.route("/document/category")
        .get(documentController.getCategories)
        .post(documentController.addCategory)
        .delete(documentController.removeCategory)
}

export default documentRouter