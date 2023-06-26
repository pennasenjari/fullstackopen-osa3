const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
var morgan = require('morgan')
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const generateId = () => {
  min = 1
  max = 1000000000000
  return Math.floor(Math.random() * (max - min) + min)
}

app.post('/api/persons', (req, res) => {

  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'Both name and number are required' 
    })
  }
  const newName = req.body.name
  const newNumber = req.body.number
  const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
  if (existingPerson) {
    return res.status(400).json({ 
      error: `${newName} is already in phonebook`
    })
  }
  const person = {
    name: newName,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  res.json(person)
})

app.get('/info', (req, res) => {
  const now  =  new Date()
  const ret = `<p>Phonebook has info for ${persons.length} people.</p><p>${now.toString()}</p>`
  res.send(ret)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})