const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 3000

// Se utiliza JSON-PARSER para acceder a los datos enviados en la solicitud HTTP
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

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

console.log(randomId())

// Obtiene la lista de todos los numeros guardados en la agenda
app.get('/api/persons', (request, response) => {
    response.send(persons)
})

// Obtiene un recurso individual si este extiste en la lista.
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (!person) {
        return response.status(404).json({
            error: "Person not found"
        })
    }
    response.send(person)
})

// Muestra la informacion de la hora y el numero de contactos en la agenda.
app.get('/info', (request, response) => {
    const infoPeople = persons.length
    response.send(
        `<p>Phonebook has info for ${infoPeople} people</p>
         <p>${timeZone()}</p>`
    )
})

/*
    Agrega a una persona accediendo al cuerpo de la peticion y verificando que los campos esten completos,
    si la persona existe dentro de la agenda, esta tambien mostrara un error, si no, esta creara un objeto
    singleton con un ID aleatorio, se pasara a la lista de contactos y se enviara como respuesta al json
*/
app.post('/api/persons', (request, response) => {
    const body = request.body
    const findName = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())
    
    if (!body.name || !body.number) {
        return response.status(400).json({ message: "All fields have to be filled" })
    } else if (findName) {
        return response.status(409).json({ message: "This person already exists on the phonebook" })
    }

    const person = {
        id: randomId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const index = persons.findIndex(person => person.id === id)

    if (index !== -1) {
        persons.splice(index, 1)
        response.status(204).json({ message: "Person successfully removed" })
    } else {
        response.status(404).json({ message: "Person not found" })
    }
})

app.listen(PORT,  () => {
    console.log(`Server running in port: ${PORT}`)
})