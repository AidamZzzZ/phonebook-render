const mongoose = require('mongoose')

/* Conexion con la base de datos */
if (process.argv.length < 3) {
    console.log('Added password')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://Adrian:${password}@cluster0.qhrxb5b.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Creacion de esquema y modelo
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('persons', personSchema)

// Agregar a una persona o ver los numeros de la agenda
if (process.argv.length !== 5) {
    console.log('phonebook:')
    Person
        .find({})
        .then(result => {
            result.forEach(person =>{
                console.log(`${person.name} ${person.number}`)
            })
        mongoose.connection.close()
        })
} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person
        .save()
        .then(result => {
            console.log('persona agregada')
            mongoose.connection.close()
        })
}