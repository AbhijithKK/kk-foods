const multer = require('multer')



let ids = [];
// multer start
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        //ids.push(file.fieldname + '-' + uniqueSuffix)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg',)
    }
})
const upload = multer({ storage: storage })
const multiUpload = upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 3 }])
// multer end
module.exports={multiUpload,ids}
