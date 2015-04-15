exports = module.exports = function(mongoose) {
  var Schema = mongoose.Schema;

  var categorySchema = new Schema({
      title: String,
  });

  /////////////////////////////////////////////////////////////////
  // create the model for category and expose it to our app ///////
  /////////////////////////////////////////////////////////////////
  mongoose.model('Category', categorySchema);
};
