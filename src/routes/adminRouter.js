import adminController from "../controllers/adminController"

const adminRouter = (app) =>
{
    // app.route("/admin")
    //     .post(adminController.addAdmin)

    app.route("/admin/login")
        .post(adminController.adminLogin)

    app.route("/admin/verify-token")
        .post(adminController.verifyToken)
}

export default adminRouter
