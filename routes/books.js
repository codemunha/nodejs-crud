let express = require('express')
let router = express.Router()
let dbCon = require('../lib/db')

// display books page
router.get('/', (req, res, next) =>{
  dbCon.query('SELECT * FROM books ORDER BY id desc',(err,rows)=> {
    if(err){
      req.flash('error', err)
      res.render('books', {data:''})
    }else{
      res.render('books', {data:rows})
    }
  })
})

// display add books page
router.get('/add', (req, res, next) =>{
  res.render('books/add', {
    name:'',
    author:''
  })
})

// add new a book
router.post('/add', (req, res, next) =>{
  let name = req.body.name
  let author = req.body.author
  let errors = false

  if(name.length === 0 || author.length === 0){
    errors = true

    // Set flash message
    req.flash('error', 'Please enter name and author')

    // render to add.ejs with flash message 
    res.render('books/add',{
      name:name,
      author:author
    })
  }

  // if no error
  if(!errors){
    let form_data = {
      name:name,
      author:author
    }

    // insert query
    dbCon.query('INSERT INTO books SET ?', form_data, (err,result)=> {
      if(err){
        req.flash('error', err)
        res.render('books/add', {
          name: form_data.name,
          author: form_data.author
        })
      }else{
        req.flash('success', 'Book successfully added')
        res.redirect('/books')
      }
    })
  }
})

// display edit book page
router.get('/edit/(:id)', (req, res, next) =>{
  let id = req.params.id

  dbCon.query('SELECT * FROM books WHERE id =' + id, (err, rows, fields) => {
    if (rows.length <= 0){
      req.flash('error', 'Book not found with id = ' + id)
      res.redirect('/books')
    } else {
      res.render('books/edit',{
        title: 'Edit book',
        id: rows[0].id,
        name: rows[0].name,
        author: rows[0].author,
      })
    }
  })
})

// udpate new a book
router.post('/update/(:id)', (req, res, next) =>{
  let id = req.params.id
  let name = req.body.name
  let author = req.body.author
  let errors = false

  if(name.length === 0 || author.length === 0){
    errors = true

    // Set flash message
    req.flash('error', 'Please enter name and author')

    // render to add.ejs with flash message 
    res.render('books/edit',{
      name:name,
      author:author
    })
  }

  // if no error
  if(!errors){
    let form_data = {
      name:name,
      author:author
    }

    // insert query
    dbCon.query('UPDATE books SET ? WHERE id =' + id, form_data, (err, result)=> {
      if(err){
        req.flash('error', err)
        res.render('books/edit', {
          id: req.params,id,
          name: form_data.name,
          author: form_data.author
        })
      }else{
        req.flash('success', 'Book successfully updated')
        res.redirect('/books')
      }
    })
  }
})

// display delest book page
router.get('/delete/(:id)', (req, res, next) =>{
  let id = req.params.id

  dbCon.query('DELETE FROM books WHERE id =' + id, (err, result) => {
    if (err){
      req.flash('error', err)
      res.redirect('/books')
    } else{
      req.flash('success', 'Book successfully deleted Id = ' + id)
      res.redirect('/books')
    }
  })
})

module.exports = router