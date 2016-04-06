module.exports = function(app) {
  var Parent = app.models.Parent;

  console.log('fetching parent with id:1, including related child');

  Parent.findById(1, function(err, parent) {
      if (err) return console.error(err);
      console.log('fetched parent with child: ', parent);
  });

};
