module.exports = Schema => {
  return new Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    url: String,
    accessKey: {
      type: String,
      required: true,
      unique: true,
      min: 8,
      max: 30
    },
    secretKey: {
      type: String,
      required: true,
      unique: true,
      min: 30,
      max: 80
    }
  })
}
