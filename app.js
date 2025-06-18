const express = require('express');
const app = express();
const usersRouter = require('./note-demo/users-api');
const noteRouter = require('./note-demo/note-api');
const favoritesRouter = require('./note-demo/favorites-api');
const dotenv = require('dotenv');
dotenv.config()

app.listen(process.env.PORT)


app.use("/users",usersRouter)
app.use("/notes",noteRouter)
app.use("/favorites",favoritesRouter)