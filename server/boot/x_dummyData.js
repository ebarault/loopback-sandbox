module.exports = function(app, cb) {
  var Parent = app.models.Parent;
  var Child = app.models.Child;

  Parent.create({}, function(err, parent) {
      if (err) return console.error(err);
      console.log('created parent: ', parent);
      Child.create({parentId: parent.id}, function(err, child) {
          if (err) return console.error(err);
          console.log('created child: ', child);
          cb(null, true);
      });
  });

};
