'use strict';

var albums = global.nss.db.collection('albums');
var songs = global.nss.db.collection('songs');
var artists = global.nss.db.collection('artists');
var multiparty = require('multiparty');
var fs = require('fs');  //imports the fs module (this is built into node)
// var Mongo = require('mongodb');

exports.index = (req, res)=>{
  albums.find().toArray((e, r)=>{
    artists.find().toArray((e, r2)=>{
      res.render('albums/index', {albums: r, artists: r2, title: 'albums: Index'});
    });
  });
};

exports.new = (req, res)=>{
  artists.find().toArray((error, records)=>{
    res.render('albums/new', {title: 'albums: New', artists: records});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{
    console.log('---------');
    console.log(fields);

    if (!fs.existsSync(`${__dirname}/../static/img/${fields.artist[0]}/${fields.name[0]}`)) {
      var album = {};
      album.name = fields.name[0];
      files.coverArt.forEach(p=>{
        fs.mkdirSync(`${__dirname}/../static/img/${fields.artist[0]}/${fields.name[0]}`);
        fs.renameSync(p.path, `${__dirname}/../static/img/${fields.artist[0]}/${fields.name[0]}/${p.originalFilename}`);
        album.photo = (p.originalFilename);
    });

    albums.save(album, ()=>res.redirect('/albums'));
    }else{
    res.redirect('/');
    }
  });

};

exports.show = (req, res)=>{

  var name1 = req.params.name;
  songs.find({albumName: name1}).toArray((error, records)=>{
    res.render('albums/show', {songs: records, title: 'albums: New'});
  });
};
