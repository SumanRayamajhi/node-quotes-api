const express = require("express");
const app = express();

// PROJECT IMPORTS
const api = require("./api");
const webapi = api();

// MIDDLEWARES
app.use(express.json());
app.get("/quotes", webapi.getQuotes);
app.get("/quotes/:quoteId", webapi.getQuoteById);
app.post("/quotes", webapi.saveQuote);
app.put("/quotes/:quoteId", webapi.editQuoteById);
app.delete("/quotes/:quoteId", webapi.deleteQuoteById);

// START EXPRESS-SERVER
app.listen(3000, () => console.log("Listening on port 3000"));
