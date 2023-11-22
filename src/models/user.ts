import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  // relation between order and user should be many orders to one user
  // here's 1to1 just for the demo
  order: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Orders',
  },
})

export const User = mongoose.model('Users', userSchema)
