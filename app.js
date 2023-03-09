// Importing necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

// Creating an instance of Express
const app = express();

// Setting the view engine to ejs
app.set('view engine', 'ejs');

// Parsing incoming request bodies in a middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serving static files such as CSS or images
app.use(express.static("public"));

// Connecting to the MongoDB database
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', {useNewUrlParser: true});
}

// Creating a schema for the articles collection
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Creating a model for the articles collection
const Article = mongoose.model('Article', articleSchema);

// Creating routes for the "/articles" endpoint
app.route('/articles')

// GET request to retrieve all articles
.get(async (req, res) => {
  const articles = await Article.find({});
  res.send(articles);
})

// POST request to create a new article
.post(async (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  await newArticle.save();
  res.send("Article added");
})

// DELETE request to delete all articles
.delete(async (req, res) => {
  await Article.deleteMany({});
  res.send("All articles deleted");
});

// Creating routes for the "/articles/:articleTitle" endpoint
app.route('/articles/:articleTitle')

// GET request to retrieve a specific article
.get(async (req, res) => {
  const foundArticle = await Article.findOne({ title: req.params.articleTitle });
  res.send(foundArticle);
})

// PUT request to update a specific article
.put(async (req, res) => {
  await Article.replaceOne(
    { title: req.params.articleTitle },
    { title: req.body.title, content: req.body.content },
    { timeout: 30000 } // Increase the timeout to 30 seconds
  );
  res.send("Article updated");
})

// PATCH request to partially update a specific article
.patch(async (req, res) => {
  await Article.updateOne(
    { title: req.params.articleTitle}, 
    { title: req.body.title }, 
  );
  res.send("Successfully updated article");
})

// DELETE request to delete a specific article
.delete(async (req, res) => {
  await Article.deleteOne(
    { title: req.params.articleTitle },
  );
  res.send("Successfully deleted article");
});

// Starting the server
app.listen(4000, () => {
  console.log('listening on port 4000');
});
