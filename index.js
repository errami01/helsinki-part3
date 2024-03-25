const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

let persons =[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons=>{
    console.log(persons)
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
app.get('/api/persons/:id',(req, res)=>{
  Person
    .findById(req.params.id)
    .then(person=>res.json(person))
    .catch(()=>res.status(404).end())
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res)=>{
    // const id = Math.floor(Math.random()*1000)
    const body = req.body
    if(!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    // if(persons.some((person)=> person.name.toLowerCase() === body.name.toLowerCase())){
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person
      .save()
      .then(savedPerson=>res.json(savedPerson))
    
})
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
