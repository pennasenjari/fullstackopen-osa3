const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
var morgan = require('morgan')
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))
const Person = require('./models/person')

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

app.delete('/api/persons/:id', (req, res) => {

  Person.deleteOne({ _id: req.params.id }).then(res2 => {
    res.send(res2)
  }).catch(err => {
    console.log(err)
    return res.status(400).json({ 
      error: 'An error occurred' 
    })
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'Both name and number are required' 
    })
  }

  const newName = req.body.name
  const newNumber = req.body.number
  const person = new Person({
    name: newName,
    number: newNumber
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.get('/info', (req, res) => {
  const now  =  new Date()

  Person.count().then(count => {
    const ret = `<p>Phonebook has info for ${count} people.</p><p>${now.toString()}</p>`
    res.send(ret)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})