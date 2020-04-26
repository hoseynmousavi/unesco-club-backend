import userController from "../controllers/userController"

const userRouter = (app) =>
{
    app.route("/user")
        .post(userController.signUp)

    app.route("/user/verify")
        .post(userController.verifyUser)
}

export default userRouter