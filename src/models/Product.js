const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true
    },
    quantity: {
      type: Number
    },

    price: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    offer: {
      type: Number
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    productImages: [
      {
        img: String
      }
    ],

    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        review: String
      }
    ]
  },
  { timestamps: true }
)

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
