'use strict'

const express = require('express')
const router = new express.Router()
const jsonschema = require('jsonschema')

const { BadRequestError } = require('../expressError')

const locationNewSchema = require('../schemas/locationNew.json')

/**
 * Route to add new location
 */
