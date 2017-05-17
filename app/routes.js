var express = require('express')
var router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// add your routes here




router.get('/employees', function (req, res) {
  var charity = req.session.data['charity']

  if (charity == 'Yes') {
    req.session.data['outcome'] = 'small';
    res.redirect('outcome');
  }
  else {
    res.render('employees');
  }

})

router.get('/balance-sheet', function (req, res) {
  var employees = req.session.data['employees']
  var turnover = req.session.data['turnover']

  if (turnover == 'Yes') {
    req.session.data['outcome'] = 'large';
    res.redirect('outcome');
  }
  else if (turnover == 'No' && employees <= '50') {
    res.redirect('small-companies');
  }
  else {
    res.render('balance-sheet');
  }

})

router.get('/small-companies', function (req, res) {
  var balancesheet = req.session.data['balancesheet']

  if (balancesheet == 'Yes') {
    req.session.data['outcome'] = 'large';
    res.redirect('outcome');
  }
  else {
    res.render('small-companies');
  }

})

router.get('/small-companies-group', function (req, res) {
  var smallcompanies = req.session.data['smallcompanies']

  if (smallcompanies == 'Yes') {
    req.session.data['outcome'] = 'large';
    res.redirect('outcome');
  }
  else {
    res.render('small-companies-group');
  }

})

router.get('/outcome', function (req, res) {
  var smallcompaniesgroup = req.session.data['smallcompaniesgroup']

  if (smallcompaniesgroup == 'Yes') {
    req.session.data['outcome'] = 'large';
    res.render('outcome');
  }
  else if (smallcompaniesgroup == 'No') {
    req.session.data['outcome'] = 'small';
    res.render('outcome');
  }
  else {
    res.render('outcome');
  }

})




module.exports = router
