/* jshint unused:false */

'use strict';

var artists = global.nss.db.collection('artists');
var albums = global.nss.db.collection('albums');
var songs = global.nss.db.collection('songs');

exports.index = (req, res)=>{
  songs.find().toArray((error, songData)=>{
    res.render('songs/index', {songs: songData, title: 'Songs: Index'});
  });
};

// artists.find().toArray((e, r)=>{
//   res.render('artists/index', {artists: r, title: 'artists: Index'});
// });

exports.new = (req, res)=>{
  artists.find().toArray((error, artistData)=>{
    albums.find().toArray((error, albumData)=>{
      res.render('songs/new', {artists: artistData, albums: albumData, title: 'Songs: Index'});
    });
  });
};

exports.create = (req, res)=>{
  var path = require('path');
  var fs = require('fs');
  var mp = require('multiparty');
  var fm = new mp.Form();

  fm.parse(req, (err, fields, files)=>{

    console.log('--------FIELDS----------');
    console.log(fields);
    console.log('--------FILES----------');
    console.log(files);

    var name = fields.name[0];
    var normalized = name.split(' ').map(w=>w.trim()).map(w=>w.toLowerCase()).join('');
    var genres = fields.genreName[0].split(',').map(w=>w.trim()).map(w=>w.toLowerCase());
    var artistName = fields.artistName[0];
    var albumName = fields.albumName[0];
    var extension = path.extname(files.audio[0].path);
    var newPathRel = `/audios/${artistName}/${albumName}/${normalized}${extension}`;

    var song = {};

// find the album photo:
  albums.find({name: `${albumName}`}).toArray((error, albumData)=>{
    artists.find({name: `${artistName}`}).toArray((error, artistData)=>{

      song.albumPhoto = albumData[0].photo;
      song.artistPhoto = artistData[0].photo;
      song.name     = name;
      song.genres   = genres;
      song.artistName = artistName;
      song.albumName  = albumName;
      song.file     = newPathRel;

  //determine the exact path for the song and create the directory

      var bseDir     = `${__dirname}/../static/audios`;
      var artDir     = `${bseDir}/${artistName}`;
      var albDir     = `${artDir}/${albumName}`;
      var newPathAbs = `${albDir}/${normalized}${extension}`;
      var oldPathAbs = files.audio[0].path;  //the old path is the temporary path that node set up when you imported the file

      if(!fs.existsSync(artDir)){
        fs.mkdirSync(artDir);
      }
      if(!fs.existsSync(albDir)){
        fs.mkdirSync(albDir);
      }
      fs.renameSync(oldPathAbs, newPathAbs);  // newPathAbs = `${__dirname}/../static/audios/${artistName}/${albumName}/${normalized}${extension}`

      songs.save(song, ()=>res.redirect('/songs'));
      });
    });
  });
};


// exports.create = (req, res)=>{
//   var path = require('path');
//   var fs   = require('fs');
//   var mp   = require('multiparty');
//   var fm   = new mp.Form();
//
//   fm.parse(req, (err, fields, files)=>{
//     var name       = fields.name[0];
//     var normalized = name.split(' ').map(w=>w.trim()).map(w=>w.toLowerCase()).join('');
//     var genres     = fields.genres[0].split(',').map(w=>w.trim()).map(w=>w.toLowerCase());
//     var artistId   = Mongo.ObjectID(fields.artistId[0]);
//     var albumId    = Mongo.ObjectID(fields.albumId[0]);
//     var extension  = path.extname(files.file[0].path);
//     var newPathRel = `/audios/${artistId}/${albumId}/${normalized}${extension}`;
//
//     var bseDir     = `${__dirname}/../static/audios`;
//     var artDir     = `${bseDir}/${artistId}`;
//     var albDir     = `${artDir}/${albumId}`;
//     var newPathAbs = `${albDir}/${normalized}${extension}`;
//     var oldPathAbs = files.file[0].path;
//
//     if(!fs.existsSync(artDir)){fs.mkdirSync(artDir);}
//     if(!fs.existsSync(albDir)){fs.mkdirSync(albDir);}
//     fs.renameSync(oldPathAbs, newPathAbs);
//
//     var song      = {};
//     song.name     = name;
//     song.genres   = genres;
//     song.artistId = artistId;
//     song.albumId  = albumId;
//     song.file     = newPathRel;
//
//     songs.save(song, ()=>res.redirect('/songs'));
//   });
// };
