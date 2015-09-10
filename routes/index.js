var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/crudpuppies');
var posts = db.get('posts');
// var comments = db.get('comments');

/* GET home page. */
router.get('/', function (req, res, next) {
  posts.find({}, function (err, docs) {
    console.log(docs);
    res.render('index', {posts: docs});
  })

});


router.get('/posts/new', function (req, res, next) {
  res.render('new', {title: 'New Page'});
});

router.post('/', function (req, res, next) {
  if (!req.body.posts) {
    res.render('new', {newError: 'You must fill in the input field.'});
  }
  else {
    req.body.comments = [];
    posts.insert(req.body);
    res.redirect('/');

  }
});

router.get('/posts/:id', function (req, res, next) {
  posts.findOne({_id: req.params.id}, function (err, doc) {
    console.log(doc)
    res.render('show', {posts: doc});

  })
});

router.get('/posts/:id/edit', function (req, res, next) {
  posts.findOne({_id: req.params.id}, function (err, doc) {

    if (err) throw err

    res.render('edit', doc)

  })
});

router.post('/posts/:id/comments', function(req,res,next){
  posts.findOne({_id: req.params.id}, function(err,doc){
    doc.comments.push(req.body.comment)
    posts.update({_id: req.params.id}, doc, function (err, doc) {

      if (err) throw err;
      res.redirect('/posts/' + req.params.id)
    })
  })
})

router.post('/posts/:id/comments/delete', function(req,res,next){
  posts.findOne({_id: req.params.id}, function(err,doc){
    var index = doc.comments.indexOf(req.body.comment)
    doc.comments.splice(index,1);
    posts.update({_id: req.params.id}, doc, function(err, doc) {
      res.redirect('/posts/' + req.params.id)
    })
  })
})

router.post('/posts/:id/update', function (req, res, next) {

  posts.update({_id: req.params.id}, req.body, function (err, doc) {

    if (err) throw err;
    res.redirect('/')
  })


});

router.post('/posts/:id/delete', function (req, res, next) {
  posts.remove({_id: req.params.id}, function (err, doc) {
    if (err) throw err;
    res.redirect('/')

  })

});




module.exports = router;
