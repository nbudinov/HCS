const md5 = require('md5');
const fs = require('fs')
const fs2 = require('fs')
const mkdirp = require('mkdirp');
const sharp = require('sharp');
const path = require('path');
const path2 = require('path');
const IMAGES_ROOT = require("./../../config/constants.js")['IMAGES_ROOT'];
const THUMB_IMAGES_ROOT = require("./../../config/constants.js")['THUMB_IMAGES_ROOT'];
const mime = require('mime');

const http = require('http');
const https = require('https');
const Stream = require('stream').Transform;
const axios = require('axios');

const Utilities = require('./utilities')();

const { promisify } = require('util');
const { resolve } = require('path');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

module.exports = (function (db) {
    return {
        compressImageForThumb,
        uploadImageFromUrl,
        uploadImage,
        compressUploadedImage,
        listFolderContent,
        getFiles,
        readCategoriesDefaultImages
    };

    function compressImageForThumb(fileName, keepImageTransparent = 0) {
        // const imagesPath = path.join(__dirname, '/../../files/images/');
        // const newImagesPath = path.join(__dirname, '/../../files/images/');
        // const newImagesThumbsPath = path.join(__dirname, '/../../files/images_thumbs/');

        // mkdirp(THUMB_IMAGES_ROOT, function (err) {
        return new Promise((resolve, reject) => {

            mkdirp(THUMB_IMAGES_ROOT).then(async made => {

                let imgPath = path.join(IMAGES_ROOT, fileName);
                // let newImgPath = path.join(newImagesPath, fileName);
                let newImgThumbPath = path.join(THUMB_IMAGES_ROOT, fileName);

                // var nameSplit = fileName.split(".");
                // let ext = nameSplit[nameSplit.length-1];
                // nameSplit.pop();
                // let newImgThumbPath = path.join(newImagesThumbsPath, nameSplit.join(".") + "_thumb" + "." + ext);

                let shThumb;
                // ext == 'png' ? 
                // shThumb = sharp(imgPath).png({compressionLevel: process.env.THUMB_IMAGES_RESIZE_QUALITY ? process.env.THUMB_IMAGES_RESIZE_QUALITY/10 : 1})
                // : 
                
                let ext = fileName.split('.').pop();
                if(keepImageTransparent == 1 && ext && ext == "png") {
                    Jimp.read(imgPath, async (err, lenna) => {
                        if (err) reject(err);
                        lenna
                            .resize(process.env.THUMB_IMAGES_RESIZE_WIDTH ? process.env.THUMB_IMAGES_RESIZE_WIDTH*1 : 400, Jimp.AUTO) // resize
                            // .scaleToFit(400, Jimp.AUTO, Jimp.RESIZE_BEZIER)
                            .quality(60) // set JPEG quality
                            // .greyscale() // set greyscale
                            .write(newImgThumbPath); // save

                            // await imagemin([newImgThumbPath], {
                            //     destination: '/',
                            //     plugins: [
                            //         imageminPngquant()
                            //     ]
                            // });

                            resolve('succcess');
                          
                      });

                   

                    // shThumb = sharp(imgPath)
                    // .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
                    // .withMetadata()

                    // shThumb
                    // .resize({ width: process.env.THUMB_IMAGES_RESIZE_WIDTH ? process.env.THUMB_IMAGES_RESIZE_WIDTH * 1 : 400 })
                    // .toBuffer(function (err, buffer) {
                    //     // return new Promise((resolve, reject) => {
                    //     fs.writeFile(newImgThumbPath, buffer, function (err) {
                    //         if (err) reject(err);
                    //         resolve("file created successfully with handcrafted Promise!");
                    //     })
                    // })

                } else {
                    
                    shThumb = sharp(imgPath)
                    .jpeg({
                        quality: process.env.THUMB_IMAGES_RESIZE_QUALITY ? process.env.THUMB_IMAGES_RESIZE_QUALITY * 1 : 80,
                        // background: {r:255,g:255,b:255,alpha:1},
                        // force: true
                    })
                    .flatten({ background: { r: 255, g: 255, b: 255 } })
                    

                    shThumb
                    .resize({ width: process.env.THUMB_IMAGES_RESIZE_WIDTH ? process.env.THUMB_IMAGES_RESIZE_WIDTH * 1 : 400 })
                    .toBuffer(function (err, buffer) {
                        // return new Promise((resolve, reject) => {
                        fs.writeFile(newImgThumbPath, buffer, function (err) {
                            if (err) reject(err);
                            resolve("file created successfully with handcrafted Promise!");
                        })
                    })

                }
                
                // shThumb
                //     .resize({ width: process.env.THUMB_IMAGES_RESIZE_WIDTH ? process.env.THUMB_IMAGES_RESIZE_WIDTH * 1 : 400 })
                //     .toBuffer(function (err, buffer) {
                //         // return new Promise((resolve, reject) => {
                //         fs.writeFile(newImgThumbPath, buffer, function (err) {
                //             if (err) reject(err);
                //             resolve("file created successfully with handcrafted Promise!");
                //         })
                //     })

            });

        });
    }

    async function uploadImage(file, savePath, imgName = "", compress = false, rawData = false) {
        let allowedExtensions = ['gif', 'jpeg', 'jpg', 'png', 'svg', 'blob'];

        return new Promise(async (resolve, reject) => {
            let fileData = "";
            var d = new Date();
            // let sampleFile = req.files.file;
            if (imgName && !rawData && file.name) {
                let parts = file.name.split(".");
                imgName = file.md5 ? file.md5 : parts[0];
                let ext = mime.extension(file.mimetype); //parts[parts.length-1];
                imgName += "_" + d.getTime() + "." + ext;
            } else if (rawData) {
                imgName = "ri_" + d.getTime() + ".png";
            } else { //if imgName not given -> generate a random one
                let ext = mime.getExtension(file.mimetype); //parts[parts.length-1];
                if(!allowedExtensions.includes(ext)) {
                    return reject(ext + " is not allowed extension")
                }
                let fileName = file.name ? (file.name.slice(0, -(ext.length+1))).replace(/\s+/g, '') : "";
                imgName = fileName + "_" + Utilities.generateOnlyRandomToken(10) + d.getTime() + "." + ext;
            }

            if (rawData) { // rawData not used for now -> 23.10.2020
                fileData = file; //Buffer.from(file, 'binary')
            } else {
                fileData = file.data;
            }

            let imgPath = savePath + imgName;

            mkdirp(savePath).then(async made => {
                if (rawData) { // not used at the moment i think
                    var matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                        response = {};

                    if (matches.length !== 3) {
                        reject('Invalid input string');
                    }
                    resolve(fileData.length);

                    response.type = matches[1];
                    response.data = new Buffer.from(matches[2], 'base64');
                    let decodedImg = response;
                    let imageBuffer = decodedImg.data;
                    let type = decodedImg.type;
                    let extension = mime.extension(type);
                    let fileName = Utilities.generateOnlyRandomToken() + d.getTime() + "." + extension;
                    try {
                        fs.writeFileSync(savePath + fileName, imageBuffer);
                        // let success = await compressUploadedImage(savePath, fileName).catch(e => reject("catch"+e));
                        resolve({ success: true, payload: { "imgName": fileName } })

                    } catch (e) {
                        reject(e);
                    }

                } else {
                    if (compress) {

                        Jimp.read(fileData, async (err, lenna) => {
                            let resizeWidth = lenna.bitmap.width || 1000;

                            if(resizeWidth > 1000) {
                                resizeWidth = 1000;
                            }
                            if (err) throw err;
                            lenna
                                .resize(resizeWidth, Jimp.AUTO) // resize
                                // .scaleToFit(400, Jimp.AUTO, Jimp.RESIZE_BEZIER)
                                .quality(60) // set JPEG quality
                                // .greyscale() // set greyscale
                                .write(imgPath); // save

                                resolve({ success: true, payload: { "imgName": imgName } })
                        })

                        // let sharpImg = sharp(fileData)
                        // .png({ compressionLevel: 9, adaptiveFiltering: true, force: true });

                        // const metaReader = sharp(fileData).metadata()
                        // .then(info => {
                        //     let resizeWidth = info.width || 1000;

                        //     if(resizeWidth > 1000) {
                        //         resizeWidth = 1000;
                        //     }
                        //     sharpImg
                        //     // .flatten({ background: { r: 255, g: 255, b: 255 } })
                        //     // .resize({ width: process.env.THUMB_IMAGES_RESIZE_WIDTH ? process.env.THUMB_IMAGES_RESIZE_WIDTH*1 : 400 })
                        //     .resize({ width: resizeWidth })
                        //     .toBuffer(function (err, buffer) {
                        //         if (err) reject(err);

                        //         // return new Promise((resolve, reject) => {
                        //         fs.writeFile(imgPath, buffer, function (err) {
                        //             if (err) reject(err);
                        //             resolve({ success: true, payload: { "imgName": imgName } })
                        //         })
                        //     })

                        // })
                        // .catch(err => {
                        //   console.log(err)
                        // })

                        // .jpeg({
                        //     quality: process.env.THUMB_IMAGES_RESIZE_QUALITY ? process.env.THUMB_IMAGES_RESIZE_QUALITY * 1 : 70,
                        //     // background: {r:255,g:255,b:255,alpha:1},
                        //     // force: true
                        // })

                        
                    } else {
                        file.mv(imgPath, function (err) {
                            if (err) reject(err);

                            resolve({ success: true, payload: { "imgName": imgName } })
                        })
                    }
                }


            })

        })
    }

    async function uploadImageFromUrl(url, imgName) {

        return new Promise(async (resolve, reject) => {

            let imgPath = IMAGES_ROOT + imgName;

            let imageResponse = await axios({ url: url, responseType: 'arraybuffer' }).catch(err => {
                reject(err);
                return;
            });


            const buffer = Buffer.from(imageResponse.data, 'binary')
            const output = await sharp(buffer).jpeg({
                quality: process.env.IMAGES_RESIZE_QUALITY ? process.env.IMAGES_RESIZE_QUALITY * 1 : 70,
            }).toBuffer();

            fs.writeFile(imgPath, output, function (err) {
                if (err) reject(err);

                resolve(true);
            })

        })

        // client.request(url, async function(response) {       

        //     return response;

        //     const buffer = Buffer.from(response, 'binary')
        //     const output = await sharp(buffer).png().toBuffer();

        //     let imgPath = IMAGES_ROOT + imgName;

        //     fs.writeFile(imgPath, output, function(err) {
        //         if (err) reject(err);

        //         resolve("file created successfully with handcrafted Promise!");
        //     })

        //     // shImg = sharp(buffer).jpeg({
        //     //     quality: process.env.IMAGES_RESIZE_QUALITY ? process.env.IMAGES_RESIZE_QUALITY*1 : 70,
        //     // })


        //     // var data = new Stream();                                                    

        //     // response.on('data', function(chunk) {                                       
        //     //     data.push(chunk);                                                         
        //     // });                                                                         


        //     // response.on('end', function() {

        //     //     fs.writeFile(imgPath, buffer, function(err) {
        //     //         if (err) reject(err);
        //     //         resolve("file created successfully with handcrafted Promise!");
        //     //     })

        //     //     fs.writeFileSync(imgPath, data.read());

        //     //     imagesService.compressImageForThumb(imgName);
        //     //     res.json("Success");

        //     // });                      
        // }).end();
    }

    async function compressUploadedImage(path, fileName) {
        return new Promise((resolve, reject) => {
            shThumb = sharp(path + fileName)
                .jpeg({ progressive: true, force: false })
                .png({ progressive: true, force: false })

            // .jpeg({
            //     quality: process.env.THUMB_IMAGES_RESIZE_QUALITY ? process.env.THUMB_IMAGES_RESIZE_QUALITY*1 : 70,
            //     // background: {r:255,g:255,b:255,alpha:1},
            //     // force: true
            // })

            shThumb
                .flatten({ background: { r: 255, g: 255, b: 255 } })
                // .resize({ width: process.env.THUMB_IMAGES_RESIZE_WIDTH ? process.env.THUMB_IMAGES_RESIZE_WIDTH*1 : 400 })
                .toBuffer(function (err, buffer) {
                    if (err) reject(err);

                    // return new Promise((resolve, reject) => {
                    fs.writeFile(path + "COMP_" + fileName, buffer, function (err) {
                        if (err) reject(err);
                        resolve(true);
                    })
                })
        })
    }

    // async function compressUploadedImageV2(path, fileName) {
    //     return new Promise(async (resolve, reject) => {


    //         imagemin([path + "*.{jpg,png}"], {
    //             destination: path + "/compressed",
    //             plugins: [
    //                 imageminJpegtran(),
    //                 imageminPngquant({
    //                     quality: [0.6, 0.8]
    //                 })
    //             ]
    //         })
    //             .then(resp => {
    //                 resolve("RESP " + resp);
    //             })
    //             .catch(err => {
    //                 reject(err);
    //             });

    //         // resolve(files);

    //     })

    // }



    // function generateTableWithToken() {
    //     return db.table
    //     .findOne({
    //         where: { deleted: 0 },
    //         order: [
    //             ['id', 'DESC']
    //         ]
    //     })
    //     .then(table => {
    //         if(!table) {
    //             var tableNum = (md5(1 + new Date));
    //             var tableToken =  md5(md5(tableNum + (new Date)));
    //         } else {
    //             var tableNum = md5(md5((table.id++) + new Date));
    //             var tableToken =  md5(md5(tableNum + (new Date)));
    //         }

    //         let newTable = {
    //             table_num: tableNum,
    //             table_token: tableToken,
    //             qr_code_image: ""
    //         }

    //         return db.table.create(newTable);
    //             // .then(table => {
    //             //     res.json({token: tableToken});
    //             // })
    //             // .catch(err => {
    //             //     res.json({"error":err})
    //             // });
    //     });
    // }

// List all files in a directory in Node.js recursively in a synchronous fashion
    function readCategoriesDefaultImages(dir, filelist) {

        var files = fs.readdirSync(dir);
        filelist = filelist || [];
        let filesObj = {};

        files.forEach(function(file) {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                let filesInFolder = fs.readdirSync(path.join(dir, file));
                if(!filesObj[file]) {
                    filesObj[file] = []
                }
                filesObj[file] = filesInFolder;
                // filelist = walkSync(path.join(dir, file), filelist);
            }
            else {
                // filelist.push(file);
            }
        });
        return filesObj;
    };

    async function getFiles(dir) {
        const subdirs = await readdir(dir);
        const files = await Promise.all(subdirs.map(async (subdir) => {
          const res = resolve(dir, subdir);
          return (await stat(res)).isDirectory() ? getFiles(res) : res;
        }));
        let reducedFiles = files.reduce((a, f) => a.concat(f), []);

        return reducedFiles.map(f => f.split("defaultCategoryImages").pop());

        // return reducedFiles.map(f => f.slice(dir.length / 2));
    }

    async function listFolderContent(folder) {

        return new Promise((resolve, reject) => {
            let dname = __dirname
            const testFolder = path.join(__dirname, '../../files/defaultCategoryImages');
            let files = [];
            

            fs.readdir(testFolder, (err, fileNames) => {
                if (err) {
                    reject(err);
                } else {
                    // var stats = fs.statSync(testFolder+'/'+fileNames);
                    // if (stats.isDirectory())
                    // if (fileNames.indexOf('.') == -1) {
                    //     fs.readdir(testFolder + '/' + fileNames, (err, fileNames) => {
                    //         if (err) {
                    //             reject(err);
                    //         } else {
                    //             resolve(fileNames)
                    //         }
                    //     });
                    // } else {
                    // resolve(fileNames)
                    // }


                    fileNames.forEach(file => {

                        if (file.indexOf('.') == -1) { // Folder
                            // resolve(file)
                            // file = file.replaceAll('"', '')
                            let childFolder = path2.join(dname, `../../files/defaultCategoryImages/${file}/`);
                                files.push('sdadas1')
                                // files.push(testFolder)
                            // files.push(`../../files/defaultCategoryImages/${file}/`)

                            // app.set('rfidTagDir', './data/rfidTagData');
                            fs2.readdirSync(childFolder, (err2, fns) => {
                                files.push('sdadas2')

                                if (err2) {
                                    files.push('sdadas3')
                                    reject(err2);

                                } else {

                                    fns.forEach(f => {


                                        // resolve(fn)
                                        files.push(file + '/' + f)

                                    })
                                }
                            });
                        } else {
                            files.push(file)
                        }
                        // console.log(file);
                    });



                }
                resolve(files)
            });

        })

    }

})