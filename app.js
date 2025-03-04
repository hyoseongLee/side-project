const express = require('express');
const app = express();
const usersRouter = require('./note-demo/users-api');
const noteRouter = require('./note-demo/note-api');
const favoritesRouter = require('./note-demo/favorites-api');
app.listen(1234)


app.use("/users",usersRouter)
app.use("/notes",noteRouter)
app.use("/favorites",favoritesRouter)

