const mongoose = require('mongoose')

const args = process.argv

if (args.length < 3 || args.length === 4 || args.length > 5) {
  console.log('Give either a) password as argument to list all persons or b) password, name and number as arguments to add a person.')
  process.exit(1)
}

const password = args[2]
const url = `mongodb+srv://pennasenjari:${password}@cluster0.hzxqoyr.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (args.length === 3) {
  // list persons
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else if  (args.length === 5) {
  // add person
  const person = new Person({
    name: args[3],
    number: args[4],
  })
  person.save().then(result => {
    console.log('number saved!')
    mongoose.connection.close()
  }) 
}