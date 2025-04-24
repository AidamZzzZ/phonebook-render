// Se llama al dotenv para usar las variables de entorno
require('dotenv').config()
const Person = require('./models/persons')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT

// Se utiliza JSON-PARSER para acceder a los datos enviados en la solicitud HTTP
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan('tiny'))

let persons = [
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

// Funcion para tomar la fecha actual
const timeZone = () => {
    return new Date().toString()
}

// Funcion para crear ID aleatorios
const randomId = () => {
    return Math.floor(Math.random() * 10000000)
}

// Obtiene la lista de todos los numeros guardados en la agenda
app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons)
        })
})

// Obtiene un recurso individual si este extiste en la lista.
app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(person)
        })
})

// Muestra la informacion de la hora y el numero de contactos en la agenda.
app.get('/info', (request, response) => {
    Person.estimatedDocumentCount()
        .then(count => {
            response.send(
                `<p>Phonebook has info for ${count} people</p>
                 <p>${timeZone()}</p>`
            )  
        })
        .catch(error => console.log(error))
})

/*
    Agrega a una persona accediendo al cuerpo de la peticion y verificando que los campos esten completos,
    si la persona existe dentro de la agenda, esta tambien mostrara un error, si no, esta creara un objeto
    singleton con un ID aleatorio, se pasara a la lista de contactos y se enviara como respuesta al json
*/
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(400).json({ message: "All fields have to be filled" })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(personSaved => {
        console.log(personSaved)
        response.json(personSaved)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }
    
    Person
        .findByIdAndUpdate((request.params.id), person, { new: true })
        .then(updatedPerson => {
        response.json(updatedPerson)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const errorHandle = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).end()
    } else if (error.name === 'ValidationError') {
        console.log(error.message)
        return response.status(400).json({ error: error.message })
    }
    
    next(err)
}

app.use(errorHandle)

app.listen(PORT,  () => {
    console.log(`Server running in port: ${PORT}`)
})