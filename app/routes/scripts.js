'use strict';

module.exports = function(app) {
  var scripts = require('../../app/controllers/scripts');

  app.get('/scripts', scripts.getScripts);
  app.get('/scripts/getupload', scripts.getUpload);
  app.get('/scripts/:id', scripts.getScriptById);
  app.get('/getSample/:id', scripts.getSample);
  app.put('/scripts/favorite/:id', scripts.updateFavorites);

}
