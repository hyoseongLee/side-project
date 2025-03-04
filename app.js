const express = require('express');
const app = express();
const usersrouter = require('./note-demo/users-api');
const noterouter = require('./note-demo/note-api');
const favoritesrouter = require('./note-demo/favorites-api');
app.listen(1234)


app.use("/users-api",usersrouter)
app.use("/note-api",noterouter)
app.use("/favorites-api",favoritesrouter)

