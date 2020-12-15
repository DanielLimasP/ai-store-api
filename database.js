// Mongodb connection file
const mongoose = require('mongoose')
const url = 'mongodb://localhost/aidb'
const atlas = 'ask for the admin'

mongoose.connect(atlas, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(db => console.log('Connection to Atlas established'))
.catch(err => console.log(err))