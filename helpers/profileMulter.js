const multer = require('multer')




// multer start
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        //ids.push(file.fieldname + '-' + uniqueSuffix)
        cb(null, file.fieldname + '-' +uniqueSuffix+ '.jpg')
    }
})
const upload = multer({ storage: storage })
const propicUpload = upload.fields([{ name: 'proImage', maxCount: 1 }])
// multer end
module.exports=propicUpload
