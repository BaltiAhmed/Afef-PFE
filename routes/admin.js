const express = require('express');
const route = express.Router();

const adminControllers = require('../controllers/admin')

const {check} = require('express-validator')

route.post('/signup', 
check('name')
.not()
.isEmpty(),
check('matricule')
.not()
.isEmpty(),
check('password')
.isLength({min:8})
, adminControllers.signup)


route.post('/login', 
check('matricule')
.not()
.isEmpty(),
check('password')
.isLength({min:8})
, adminControllers.login)

module.exports = route