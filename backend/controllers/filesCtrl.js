
// var mongoose = require('mongoose');
// var fs = require('fs');
// var Q = require('q');
// var Image = mongoose.model('Image');

// var ee = require('../config/event')();
// var fsx = require('../config/fsExtender')();

// /* **** Error promise status **** */
// // status = 1 : createDir error
// // status = 2 : error moving file
// // status = 3 : error writing thumbnail
// // status = 4 : error saving image in db
// // status = 5 : error removing file
// /* ******** */

// function _saveFile(oldFile, userPath, file, author){
//     console.log('working on : '+file.originalname+ ' > '+file.name);
//     var deferred = Q.defer();
//     var tasks = [];
//     var newFile = userPath+'/'+file.name;

//     fsx._moveFile(oldFile, newFile)
//     .then(function (){
//         return fsx._createDir(userPath+'/200');
//     }).then(function (){
//         return fsx._makeThumb(newFile, userPath+'/200/'+file.name, 200);
//     }).then(function (){
//         return fsx._createDir(userPath+'/50');
//     }).then(function (){
//         return fsx._makeThumb(newFile, userPath+'/50/'+file.name, 50);
//     })
//     .then(function (){
//         var image = new Image({
//             name:file.name,
//             ext:file.extension,
//             size:file.size,
//             mimetype:file.mimetype,
//             author:author
//         });
//         image.save(function (err, image){
//             console.log('done : '+file.originalname);
//             if (err || !image)
//                 deferred.reject({status:4, err:err});
//             else
//                 deferred.resolve(image);
//         });
//     },function (error){
//         if (error.status >= 2)
//             tasks.push(Q.denodeify(fs.unlink(oldFile)));
//         if (error.status >= 3)
//             tasks.push(Q.denodeify(fs.unlink(newFile)));
//         if (error.status >= 4)
//             tasks.push(Q.denodeify(fs.unlink(userPath+'/200/'+file.name)));
//         Q.all(tasks).then(function (results){
//             deferred.reject(error);
//         });
//     }).done();
//     return deferred.promise;
// }

// exports.uploadImg = function (req, res){
//     var uploadPath = './frontend/uploads/';
//     var userPath = uploadPath+req.user.username;

//     fsx._createDir(userPath).then(function (success){
//         var tasks = [];
//         for (var key in req.files)
//             tasks.push(_saveFile(uploadPath+req.files[key].name, userPath, req.files[key], req.user));

//         Q.all(tasks).then(function (images){
//             res.status(200).json(images);
//             ee.emit('uploadCompleted');
//         }).fail(function (error){
//             ee.emit('uploadCompleted');
//             console.log('one file provided an error : ');
//             console.log(error);
//             res.status(500).json({message:"Oups, some files didn't upload correctly."});
//         });

//     }, function (error){
//         console.log("couldn't create user folder.");
//         res.status(500).json({message:"Oups, some files didn't upload correctly."});
//     });
// };

// exports.getImages = function (req, res){
//     Image.find({author:req.user}, function (err, images){
//         if (err)
//             res.status(500).json({message:"Images not found."});
//         else
//             res.status(200).json(images);
//     });
// };

// exports.remove = function (req, res){
//     Image.findOne({_id:req.params.id, author:req.user}, function (err, image){
//         if (err || !image)
//             return res.status(500).json({message:"You can't remove this image."});
//         var tasks = [];
//         tasks.push(image.remove());
//         if (image.path) tasks.push(fsx._unlink("./frontend/"+image.path));
//         if (image.small) tasks.push(fsx._unlink("./frontend/"+image.small));
//         if (image.xsmall) tasks.push(fsx._unlink("./frontend/"+image.xsmall));
//         Q.all(tasks).then(function (results){
//             res.status(200).send();
//         }, function (error){
//             console.log('an error occured removing image\'s files ...');
//             console.log(error);
//             res.status(500).send();
//         });
//         res.status(200).json(image);
//     });
// };