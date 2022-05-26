const mongoose = require('mongoose')



const url = "mongodb://localhost:27017/e-commarceSite";

mongoose.connect(url, function (err, data) {
    if (err) {
      console.log(err);
      return;
    } else if (data) {
      console.log("database is connected");
    }
  });