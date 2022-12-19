const express = require('express')
const auth = require('../middleware/auth')
const { default: slugify } = require('slugify')
const Category = require('../models/Category')
const generateCategories = require('../Helper Methods/Categories')
const router = new express.Router()

router.post('/category/create', auth, async (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: slugify(req.body.name)
  }

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId
  }

  try {
    const category = await Category(categoryObj)
    await category.save()
    return res.status(200).send({
      message: 'Category created',
      category
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/category/get', async (req, res) => {
  try {
    const categories = await Category.find({})
    const cat = await generateCategories(categories)

    return res.send({
      message: 'Fetched Successfully',
      categories: cat
    })
  } catch (error) {
    return res.status(400).send(error)
  }
})

module.exports = router
