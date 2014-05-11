'use strict';

var albums = global.nss.db.collection('albums');
var multiparty = require('multiparty');
var fs = require('fs');  //imports the fs module (this is built into node)

exports.index = (req, res)=>{
  albums.find().toArray((e, r)=>{
    res.render('albums/index', {albums: r, title: 'albums: Index'});
  });
};

exports.new = (req, res)=>{
  res.render('albums/new', {title: 'albums: New'});
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{

    if (!fs.existsSync(`${__dirname}/../static/img/${fields.name[0]}`)) {
      var album = {};
      album.name = fields.name[0];

      files.photo.forEach(p=>{
        fs.mkdirSync(`${__dirname}/../static/img/${fields.name[0]}`);
        fs.renameSync(p.path, `${__dirname}/../static/img/${fields.name[0]}/${p.originalFilename}`);
        album.photo = (p.originalFilename);
    });

    albums.save(album, ()=>res.redirect('/albums'));
    }else{
    res.redirect('/');
    }
  });

};
