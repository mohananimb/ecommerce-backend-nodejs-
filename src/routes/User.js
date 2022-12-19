const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/user', async (req, res) => {
  try {
    const isExist = await User.findOne({ email: req.body.email })
    if (isExist) {
      return res.status(400).send({
        message: 'This User is already exist.'
      })
    }

    const user = new User(req.body)
    await user.save()
    return res.status(201).send({
      message: 'User create successfully',
      user
    })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(400).send({
        message: 'User not found'
      })
    }

    const match = await user.passwordCheck(req.body.password)
    if (!match) {
      return res.status(400).send({
        message: 'Invalid Password'
      })
    }

    const token = await user.generateToken()

    const { _id, name, email, role, mobile } = user

    return res.status(200).send({
      message: 'Logged In Successfully',
      user: { _id, name, email, role, mobile, token }
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.patch('/user/add-to-cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.body.user)
    if (user.cartItems.length === 0) {
      user.cartItems = req.body.cartItems
    } else {
      const isItemExist = user.cartItems.find(
        item => item.product == req.body.cartItems[0].product
      )

      if (isItemExist) {
        isItemExist.quantity += 1
        isItemExist.price += req.body.cartItems[0].price
      } else {
        user.cartItems.push(req.body.cartItems[0])
      }
    }

    await user.save()

    return res.status(200).send({
      message: 'Cart Updated',
      user
    })
  } catch (error) {
    return res.status(400).send(error)
  }
})

router.patch('/user/remove-from-cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.body.user)
    if (user.cartItems.length === 0) {
      return res.status(200).send({
        message: 'There are to items to remove from cart.'
      })
    }

    const isItemExist = user.cartItems.find(
      item => item.product == req.body.cartItems[0].product
    )

    if (isItemExist) {
      if (isItemExist.quantity === 1) {
        const updatedCart = user.cartItems.filter(
          item => item.product != req.body.cartItems[0].product
        )

        user.cartItems = updatedCart
      } else {
        isItemExist.quantity -= 1
        isItemExist.price -= req.body.cartItems[0].price
      }
    }

    await user.save()

    return res.status(200).send({
      message: 'Cart Updated',
      user
    })
  } catch (error) {
    return res.status(400).send(error)
  }
})

module.exports = router
