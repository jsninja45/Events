"use-strict";

var Promise = require('bluebird');
var mongoose = require('mongoose');
var Script = require('../models/script');
var User = require('../models/user');
var fs = Promise.promisifyAll(require("fs"));
var exec = require('child_process').exec;
var config = require('../../config/config');
var knox = require('knox');
var HyPDF = require('hypdf');

var knoxClient = knox.createClient({
    key: config.AmazonS3.AccessKey,
    secret: config.AmazonS3.SecretKey,
    bucket: config.AmazonS3.DynamicBucketName
});

var hypdf = new HyPDF('app32908468@heroku.com', 'Jp9cDrPhTxvk', {
  bucket: "scriptduploads",
  public: true,
  test: true
});

Promise.promisifyAll(Script);
Promise.promisifyAll(Script.prototype);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
Promise.promisifyAll(mongoose.Query.prototype);

exports.getScripts = function(req, res) {
  Script.find().populate('author avatarImg').execAsync()
    .then(function(scripts) {
      res.status(200).json(scripts);
    }).catch(function(err) {
      res.status(500).json(err);
    });
}

exports.getScriptById = function(req, res) {
  Script.findById(req.params.id).populate('author favorites.user avatarImg').execAsync()
    .then(function(script) {
      res.status(200).json(script);
    }).catch(function(err) {
      res.status(500).json(err);
    });
}

exports.updateFavorites = function(req, res) {
  _userId =  req.user.id;
  var _scriptId = mongoose.Types.ObjectId(req.params.id);
  var favorited = req.body.favorited;
  if (favorited) {
    User.updateAsync({
      _id: _userId,
      'favorites.script': {
        $ne: _scriptId
      }
    }, {
      $push: {
        favorites: {
          script: _scriptId
        },
        activity: {
          action: 'Favorited',
          script: _scriptId
        }
      }
    }).then(function(result) {
      return Script.updateAsync({
        _id: _scriptId,
        'favorites.user': {
          $ne: _userId
        }
      }, {
        $push: {
          favorites: {
            user: _userId
          }
        }
      });
    }).then(function(result) {
      return Script.findOne({
        _id: _scriptId
      }).populate('author').execAsync();
    }).then(function(script) {
      res.status(200).json(script);
    }).catch(function(err) {
      res.status(500).json(err);
    });
  } else {
    User.updateAsync({
      _id: _userId
    }, {
      $pull: {
        favorites: {
          script: _scriptId
        },
        activity: {
          action: 'Favorited',
          script: _scriptId
        }
      }
    }).then(function(result) {
      return Script.updateAsync({
        _id: _scriptId
      }, {
        $pull: {
          favorites: {
            user: _userId
          }
        }
      });
    }).then(function(result) {
      return Script.findOneAsync({
        _id: _scriptId
      });
    }).then(function(script) {
      res.status(200).json(script);
    }).catch(function(err) {
      res.status(500).json(err);
    });
  }
}

exports.getUpload = function(req, res) {
  knoxClient.getFile(req.session.fileName,
    function(err, s3res){
     s3res.pipe(res);
    });
};
exports.getSample = function(req, res){
  Script.findById(req.params.id).populate('author favorites.user').execAsync()
    .then(function(script) {
      knoxClient.getFile('sample-' + script.fileName,
        function(err, s3res){
          s3res.pipe(res);
      });
    }).catch(function(err) {
      res.status(500).json(err);
    });
};
exports.addScript = function(req, res) {
  req.session.title = req.body.title;
  req.session.description = req.body.description;
  req.session.genres = req.body.genres;
  req.session.category = req.body.category;
  res.end();
};

