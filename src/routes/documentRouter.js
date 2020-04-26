import documentController from "../controllers/documentController"

const documentRouter = (app) =>
{
    app.route("/document")
        .post(documentController.addDocument)
}

export default documentRouter