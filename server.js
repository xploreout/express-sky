if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const API_KEY = process.env.API_KEY;
const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.json());

app.use(express.static('public'));

app.post('/weather', (req, res) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?lon=${req.body.longitude}&lat=${req.body.latitude}&units=imperial&APPID=${API_KEY}`;

  axios(url).then((data) => {
    res.json(data.data);
  });
});

let port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening to port ${port}`));
