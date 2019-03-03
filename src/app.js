const path = require('path')
const express = require('express')
const hbs = require('hbs');
const request = require('request');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(path.join(__dirname, '../public')))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Jack Nichols'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    name: 'Jack Nichols'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Jack Nichols',
    message: 'To get help, go find some'
  })
})

app.get('/weather', (req, res) => {
  if(!req.query.address){
    return res.send({
      error: 'You must provide an address'
    })
  }

  geocode(req.query.address, (error, {latitude, longitude, location} = {} ) => {
    if(error){
      return res.send({ error})
    } forecast(latitude, longitude, (error, forecastData) => {
      if(error){
        return res.send({ error})
      }
      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })


})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404 Help',
    description: 'Help article not found',
    name: 'Jack Nichols'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    description: 'Page not found',
    name: 'Jack Nichols',
  })
})

app.listen(3000, () => {
  console.log('It started fool')
})