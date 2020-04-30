import documentController from "../controllers/documentController"

const documentRouter = (app) =>
{
    app.route("/documents")
        .get(documentController.getDocumentsForUsers)

    app.route("/document")
        .get(documentController.getDocuments)
        .post(documentController.addDocument)
        .patch(documentController.updateDocument)

    app.route("/document-category")
        .post(documentController.addDocumentCategory)
        .delete(documentController.deleteDocumentCategory)

    app.route("/document-picture")
        .get(documentController.getPictures)
        .post(documentController.addDocumentPicture)
        .delete(documentController.removeDocumentPicture)

    app.route("/document-film")
        .get(documentController.getFilms)
        .post(documentController.addDocumentFilm)
        .delete(documentController.removeDocumentFilm)

    app.route("/document/category")
        .get(documentController.getCategories)
        .post(documentController.addCategory)
        .delete(documentController.removeCategory)

    app.route("/document/:document_id")
        .get(documentController.getDocumentById)
}

export default documentRouter