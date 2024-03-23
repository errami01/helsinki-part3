const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')


const app = express()
app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))
const url = process.env.MONGO_URI
mongoose.connect(url)
const personSchema = mongoose.Schema({
  name : String,
  number: String
})
const Person = mongoose.model('Person', personSchema)
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
app.delete('/api/persons/:id',(req, res)=>{
    const id = Number(req.params.id)
    persons = persons.filter((person)=> person.id !== id)
    res.status(204).end
})
app.post('/api/persons', (req, res)=>{
    const id = Math.floor(Math.random()*1000)
    const body = req.body
    if(!body.name || !body.number) {
        return res.status(400).json({ 
            error: 'name or number missing' 
        })
    }
    if(persons.some((person)=> person.name.toLowerCase() === body.name.toLowerCase())){
        return res.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: id
    }
    persons = persons.concat(person)
    res.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
