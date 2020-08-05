const MulterSharpResizer = require("multer-sharp-resizer");

const resizerImages = async (req, res, next) => {
  try{
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");
   
    const filename = `avatar-${Date.now()}`;
   
    const sizes = [
      {
        path: "hd",
        width: 1280,
        height: 720,
      }
    ];
   
    const uploadPath = `./public/uploads/photo/avatar/${year}/${month}`;
   
    const fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/avatar/photo/${year}/${month}`;
   
    // sharp options
    const sharpOptions = {
      fit: "fill",
      background: { r: 255, g: 255, b: 255 },
    };
   
    // create a new instance of MulterSharpResizer and pass params
    const resizeObj = new MulterSharpResizer(
      req,
      filename,
      sizes,
      uploadPath,
      fileUrl,
      sharpOptions
    );
   
    // call resize method for resizing files
    await resizeObj.resize();
    const getDataUploaded = resizeObj.getData();
  
    req.body.avatar_url = getDataUploaded[0].hd.path;
   
    next();
  } catch(err) {
    req.body.avatar_url = 'siemane, zdjecie nie zostalo dodane!';
    console.log(err);
    next();
  }
    
};

module.exports = resizerImages;
