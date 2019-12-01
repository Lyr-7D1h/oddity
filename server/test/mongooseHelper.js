const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
  testStringRequired: {
    required: true,
    type: String
  },
  testStringRequiredUniqueLowercase: {
    required: true,
    unique: true,
    type: String,
    lowercase: true
  },
  config: {
    type: String,
    lowercase: true
  }
})

const buildSchema = schema => {
  schema = schema || testSchema
  return mongoose.Schema(schema)
}

const buildModel = (schema, app) => {
  schema = schema || testSchema
  return mongoose.model('test', schema)
}

module.exports = {
  buildSchema,
  buildModel
}
