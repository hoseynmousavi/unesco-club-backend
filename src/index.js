import cors from "cors"
import express from "express"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"
import mongoose from "mongoose"
import rootRouter from "./routes/rootRouter"
import data from "./data"
import notFoundRooter from "./routes/notFoundRouter"
import addHeaderAndCheckPermissions from "./functions/addHeaderAndCheckPermissions"
import adminRouter from "./routes/adminRouter"
import userRouter from "./routes/userRouter"
import documentRouter from "./routes/documentRouter"
import fileRouter from "./routes/fileRouter"

// Normal Things Never Leave Us Alone ...
const app = express()
app.use(cors())
app.use(fileUpload({createParentPath: true}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Connecting To DB (data file is private babes 😊)
mongoose.Promise = global.Promise
mongoose.connect(data.connectServerDb, {useNewUrlParser: true}).then(() => console.log("connected to db"))

// Add Header To All Responses & Token Things
addHeaderAndCheckPermissions(app)

// Routing Shits
rootRouter(app)
adminRouter(app)
userRouter(app)
documentRouter(app)
fileRouter(app, __dirname)
notFoundRooter(app) // & at the end

// Eventually Run The Server
app.listen(data.port, () => console.log(`Backend is Now Running on Port ${data.port}`))