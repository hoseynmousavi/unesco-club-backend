import userController from "../controllers/userController"

const userRouter = (app) =>
{
    app.route("/user")
        .get(userController.getUsers)
        .post(userController.signUp)
        .delete(userController.removeUser)

    app.route("/user/verify")
        .post(userController.verifyUser)
}

export default userRouter