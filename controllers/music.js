// Generated by CoffeeScript 1.9.3
(function() {
  var func_music, musics;

  func_music = __F('music');
  func_fav = __F('music_fav');
  func_play = __F('music_play');
  var async = require('async');
  musics = {};

  module.exports.controllers = {
    "/show_url": {
      get: function(req, res, next) {
        res.send({
          show: 0,
          url: "http://www.html-js.com/music"
        });
      }
    },
    "/": {
      get: function(req, res, next) {
        var condition, count, page;
        page = req.query.page || 1;
        count = req.query.count || 20;
        condition = null;
        return func_music.count(condition, function(error, _count) {
          if (error) {
            return next(error);
          } else {
            res.locals.total = _count;
            res.locals.totalPage = Math.ceil(_count / count);
            res.locals.page = req.query.page || 1;
            return func_music.getAll(page, count, condition, 'musics.index desc', function(error, musics) {
              if (error) {
                return next(error);
              } else {
                res.locals.musics = musics;
                return res.render('music/all.jade');
              }
            });
          }
        });
      }
    },
    ".json": {
      get: function(req, res, next) {
        var condition, last_id;
        last_id = req.query.last_id;
        condition = null;
        if (last_id) {
          condition = ['id > ?', last_id];
        }
        if (!last_id) {
          last_id = -1;
        }
        if (musics[last_id]) {
          return res.send(musics[last_id]);
        } else {
          return func_music.getAll(1, 10000, condition, 'musics.index desc', function(error, musics) {
            if (error) {
              return res.send(error);
            } else {
              res.locals.musics = musics;
              res.send(musics);
              if (!musics[last_id]) {
                return musics[last_id] = musics;
              }
            }
          });
        }
      }
    },
    "/add": {
      get: function(req, res, next) {
        return res.render('music/add.jade');
      },
      post: function(req, res, next) {
        return func_music.add(req.body, function(error, music) {
          musics = {};
          return res.redirect('/music/' + music.id);
        });
      }
    },
    "/:id.json": {
      get: function(req, res, next) {
        return func_music.getById(req.params.id, function(error, music) {
          if (error) {
            return res.send(error);
          } else {
            res.send(music);
            return func_music.addCount(req.params.id, 'visit_count', (function() {}), 1);
          }
        });
      }
    },
    "/:id": {
      get: function(req, res, next) {
        return func_music.getById(req.params.id, function(error, music) {
          if (error) {
            return next(error);
          } else {
            return func_music.getNext(req.params.id, function(error, next) {
              if (next) {
                res.locals.next = next;
              }
              res.locals.music = music;
              res.render('music/music.jade');
              return func_music.addCount(req.params.id, 'visit_count', (function() {}), 1);
            });
          }
        });
      }
    },
    "/tool/:id": {
      get: function(req, res, next) {
        return func_music.getById(req.params.id, function(error, music) {
          if (error) {
            return next(error);
          } else {
            return func_music.getNext(req.params.id, function(error, next) {
              if (next) {
                res.locals.next = next;
              }
              res.locals.music = music;
              res.render('music/music-tool.jade');
              return func_music.addCount(req.params.id, 'visit_count', (function() {}), 1);
            });
          }
        });
      }
    },
    "/add_favs":{
      post:function(req,res,next){
        var user_id = req.body.user_id;
        var push_id = req.body.push_id;
        var favs = req.body.favs.split(',')

        async.eachLimit(favs,1,function(music_id,callback){
          func_fav.get({
            user_id: user_id,
            music_id: music_id
          },function(err,fav){
            if(!fav){
              func_fav.add({
                user_id: user_id,
                push_id: push_id,
                music_id: music_id
              },function(){
                callback();
              })
              func_music.addCount(music_id, 'fav_count', (function() {}), 1);
            }else{
              callback();
            }
            
          })
          
        },function(){
          res.send('ok')
        });

      }
    },
    "/add_fav":{
      post:function(req,res,next){
        var user_id = req.body.user_id;
        var push_id = req.body.push_id;
        var music_id = req.body.music_id
        func_fav.get({
            user_id: user_id,
            music_id: music_id
          },function(err,fav){
            if(!fav){
              func_fav.add({
                user_id: user_id,
                push_id: push_id,
                music_id: music_id
              },function(){
                res.send('ok')
              })
            }else{
              res.send('ok')
            }
            
          })
        

        func_music.addCount(req.body.music_id, 'fav_count', (function() {}), 1);
      }
    },
    "/add_play":{
      post:function(req,res,next){
        var user_id = req.body.user_id;
        var push_id = req.body.push_id;
        var music_id = req.body.music_id
        func_play.get({
            user_id: user_id,
            music_id: music_id
          },function(err,fav){
            if(!fav){
              func_play.add({
                user_id: user_id,
                push_id: push_id,
                music_id: music_id
              },function(){
                res.send('ok')
              })
            }else{
              res.send('ok')
            }
            
          })
        

        func_music.addCount(req.body.music_id, 'play_count', (function() {}), 1);
      }
    }
  };

}).call(this);
