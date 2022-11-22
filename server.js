import express from "express";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view-engine", "ejs");

import { MongoClient, ServerApiVersion } from "mongodb";
const uri =
  "mongodb+srv://yoda:maythenodebewithyou@cluster0.i15dj6r.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//MONGODB

// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   if (err) return console.error(err);
//   console.log("Connected to database!");
//   client.close();
// });

client
  .connect()
  .then((client) => {
    console.log("wow connected to database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => console.error(error));
    });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          { $set: { name: req.body.name, quote: req.body.quote } },
          { upsert: true }
        )
        .then((result) => {
          res.json("Success");
        })
        .catch((error) => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json("Deleted Darth Vader's quote");
        })
        .catch((error) => console.error(error));
    });
  })
  .catch((error) => console.error(error));

//CRUD

// app.get("/", (req, res) => {
//   //   res.send("hello world");
//   res.sendFile(
//     "/Users/justi/Documents/GitHub/crud-starwars-quote" + "/index.html"
//   );
// });

// app.post("/quotes", (req, res) => {
//   console.log(req.body);
// });

app.listen(8000, function () {
  console.log("May the Node be with you");
});
