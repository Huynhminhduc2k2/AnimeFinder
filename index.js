import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

// Initial server
const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});

// Make object passable to server side
app.use(bodyParser.urlencoded({ extended: true }));

// Use public as stylesheet for express
app.use(express.static('public'));

// Initial get mainPage
app.get(`/`, (req, res) => {
  res.render(`index.ejs`);
});

// Search page
const API_URL = 'https://api.jikan.moe/v4';
app.post(`/search`, async (req, res) => {
  try {
    console.log(req.body);
    const result = await axios.get(API_URL + `/anime?q=${req.body.AnimeName}`);

    //console.log(API_URL + `?q=${req.body.AnimeName}`);
    const listAnime = result.data;

    // Check if search successfully but without animes
    const totalPage = listAnime.pagination.items.total;
    if (totalPage === 0) {
      const isEmpty = true;
      res.render(`index.ejs`, { statusSearch: isEmpty });
    }
    res.render(`index.ejs`, { result: listAnime.data });
  } catch (error) {
    console.log('Error', error.response.data);
    res.render(`index.ejs`, {
      error: error.response.data.message + ' ' + error.response.data.status,
    });
  }
});

// Random page
app.post(`/random`, async (req, res) => {
  try {
    console.log(req.body);
    const result = await axios.get(API_URL + `/random/anime`);
    const random = result.data;
    //console.log(API_URL + `/random/anime`);
    console.log(random.data.images.jpg.image_url);
    res.render('index.ejs', { randomAnime: random.data });
  } catch (error) {
    console.log('Error', error.response.data);
    res.render(`index.ejs`, {
      error: error.response.data.message + ' ' + error.response.data.status,
    });
  }
});
