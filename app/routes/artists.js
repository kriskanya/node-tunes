'use strict';

var artists = global.nss.db.collection('artists');
var multiparty = require('multiparty');
var fs = require('fs');  //imports the fs module (this is built into node)

exports.index = (req, res)=>{
  artists.find().toArray((e, r)=>{
    res.render('artists/index', {artists: r, title: 'artists: Index'});
  });
};

exports.new = (req, res)=>{
  res.render('artists/new', {title: 'artists: New'});
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();
  form.parse(req, (err, fields, files)=>{

    if (!fs.existsSync(`${__dirname}/../static/img/${fields.name[0]}`)) {
      var artist = {};
      artist.name = fields.name[0];
      files.photo.forEach(p=>{
        fs.mkdirSync(`${__dirname}/../static/img/${fields.name[0]}`);
        fs.renameSync(p.path, `${__dirname}/../static/img/${fields.name[0]}/${p.originalFilename}`);
        artist.photo = (p.originalFilename);
    });

    console.log(fields);
    console.log(files);


    artists.save(artist, ()=>res.redirect('/artists'));
    }else{
    res.redirect('/');
    }
  });

};
