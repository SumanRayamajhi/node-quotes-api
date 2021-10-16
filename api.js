const fs = require("fs");
const quotesFile = "./quotes.json";

const saveQuotesToJson = (quotes) => {
  // quotes = [quote1{}, quote2{}, ...]
  // quotes is a json OBJECT
  const text = JSON.stringify(quotes, null, 4);
  // write the text into the quotes.json
  fs.writeFileSync("./quotes.json", text);
};
const getQuotesFromJson = () => {
  // the quotes are inside the quotes.json
  // read the file
  const text = fs.readFileSync(quotesFile);
  // parse the text to a json OBJECT
  const obj = JSON.parse(text);

  return obj;
};

const api = () => {
  const getQuoteById = (request, response) => {
    const quoteId = parseInt(request.params.quoteId);
    const quote = getQuotesFromJson().find((q) => q.id === quoteId);
    response.send(quote);
  };

  const getQuotes = (request, response) => {
    response.json(getQuotesFromJson());
  };

  const saveQuote = (request, response) => {
    const newQuote = request.body;
    const quotes = getQuotesFromJson();

    // checking that the same quote doesn't exist alreaduy.
    const sameQuote = quotes.find((q) => q.quote === newQuote.quote);
    if (sameQuote) {
      response
        .status(400)
        .send("A quote with the same content already exists.");
    }

    // providing unique id for the new quote.
    const maxId = Math.max(...quotes.map((q) => q.id)); // returns max id
    newQuote.id = maxId + 1;

    // saving quotes.
    quotes.push(newQuote);
    saveQuotesToJson(quotes);

    response.status(201).send(newQuote);
  };

  const editQuoteById = (request, response) => {
    const quoteId = parseInt(request.params.quoteId);
    const editedQuote = request.body;

    const quotes = getQuotesFromJson();
    const jsonQuote = quotes.find((q) => q.id === quoteId);
    jsonQuote.author = editedQuote.author;
    jsonQuote.quote = editedQuote.quote;
    saveQuotesToJson(quotes);

    response.status(200).send(editedQuote);
  };

  const deleteQuoteById = (request, response) => {
    const quoteId = parseInt(request.params.quoteId);

    let quotes = getQuotesFromJson();
    const jsonQuote = quotes.find((q) => q.id === quoteId);
    if (jsonQuote) {
      quotes = quotes.filter((q) => q.id != quoteId);
      saveQuotesToJson(quotes);
      response.status(200).send(jsonQuote);
    } else {
      response.status(404).send("Did not find quote with id " + quoteId);
    }
  };

  return {
    getQuoteById,
    getQuotes,
    saveQuote,
    editQuoteById,
    deleteQuoteById,
  };
};

module.exports = api;
