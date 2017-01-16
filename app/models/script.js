"use strict";

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var script = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: ''
    },
    description: {
        type: String,
        required: true,
        trim: true,
        default: ''
    },
    sampleUrl:
    {
      type: String
    },
    fileName:
    {
      type: String
    },
    genres: [{
        type: String,
        enum: ['Comedy', 'Drama']
    }],
    category: {
        type: String,
        enum: ['Film', 'TV', 'Web']
    },
    type: {
        type: String,
        enum: ['Fiction', 'Nonfiction']
    },
    tags: [{
        type: String
    }],
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    favorites: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        created: {
            type: Date,
            default: Date.now
        }
    }],
    purchases: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        created: {
            type: Date,
            default: Date.now
        }
    }],
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Script', script);
