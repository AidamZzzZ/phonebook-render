// importar mongoose
const mongoose = require('mongoose');

// se conecta la base de datos (en caso de que acceda y cuando haya algun error)
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose.connect(url)
  .then(result => {
    console.log('Connect to MongoDB');
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message);
  });

// Se crea un esquema y formatea
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone numnber!`
    },
    required: true
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Se exporta el modelo persons (coleccion) para ser utilizado en el
module.exports = mongoose.model('persons', personSchema);