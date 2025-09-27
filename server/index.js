const PORT = 6001;

mongoose.connect('mongodb://localhost:27017/socialeX', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  server.listen(PORT, () => {
    console.log(Running @ ${PORT});
  });
})
.catch((e) => console.log(Error in db connection ${e}));