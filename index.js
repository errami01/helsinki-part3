const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons=>{
    response.json(persons)
  })
    
})
app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons=>{
      response.send(`<p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</P>`)
    })
})
app.get('/api/persons/:id',(req, res, next)=>{
  Person
    .findById(req.params.id)
    .then(person=>res.json(person))
    .catch((error)=>next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
app.put('/api/persons/:id',(request, response, next)=>{
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true ,runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})
app.post('/api/persons', (req, res, next)=>{
  const body = req.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then(savedPerson=>res.json(savedPerson))
    .catch(error => next(error))
    
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
