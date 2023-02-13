const express = require('express')
require('dotenv').config()

const app = express()
const cors = require('cors')
const Note = require('./models/note')

app.use(express.static('build'))
app.use(express.json())

app.use(cors())


//custom middleware: receives 3 params
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('------')
    next()
}
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello World called Earth!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
  })

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if(note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.post('/api/notes', (request, response, next) => {
    const body = request.body

   const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
   })

    note.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response) => {
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

//toggle importance
app.put('/api/notes/:id', (request, response, next) => {
    const {content, important} = request.body

    Note.findByIdAndUpdate(request.params.id, {content, important}, 
        {new:true, runValidators:true, context:'query'})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})


//middleware to use if no route is found
//simply returns a 404 message
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)


//error handler middleware: receives 4 params
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}
//last loaded middleware gotta be errorHandler
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})