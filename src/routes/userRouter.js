import userController from "../controllers/userController"

const userRouter = (app) =>
{
    app.route("/users")
        .get(userController.getUsersForUsers)

    app.route("/users/:user_id")
        .get(userController.getUserByIdForUsers)

    app.route("/user")
        .get(userController.getUsers)
        .post(userController.signUp)
        .delete(userController.removeUser)

    app.route("/user/verify")
        .post(userController.verifyUser)

    app.route("/user/tick")
        .post(userController.tickUser)
}

export default userRouter