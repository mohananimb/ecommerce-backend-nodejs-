const express = require('express')
const auth = require('../middleware/auth')
const { default: slugify } = require('slugify')
const Product = require('../models/Product')
const router = new express.Router()
const multer = require('multer')
const short = require('shortid')
const path = require('path')
const Category = require('../models/Category')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, `${short.generate()} ${file.originalname}`)
  }
})

const upload = multer({ storage })

router.post(
  '/product/create',
  auth,
  upload.array('productImages'),
  async (req, res) => {
    // res.status(200).json({ file: req.files, body: req.body });
    let productImages = []

    const { name, quantity, offer, description, category, price } = req.body

    if (req.files.length > 0) {
      productImages = req.files.map(file => {
        return {
          img: file.filename
        }
      })
    }

    try {
      const data = {
        name,
        slug: slugify(name),
        quantity,
        offer,
        description,
        category,
        createdBy: req.user_id,
        productImages,
        price
      }

      const product = await new Product(data)
      await product.save()
      return res.status(200).send(product)
    } catch (error) {
      return res.status(500).send(error)
    }
  }
)

router.get('/product/get', async (req, res) => {
  const { limit, skip } = req.query
  try {
    const product = await Product.find({})
      .limit(parseInt(limit)).skip(parseInt(skip))
    return res.status(200).send({
      message: 'Products retrieved successfully.',
      product,
      count: await Product.count()
    })
  } catch (error) {
    return res.status(500).send(error)
  }
})

module.exports = router
