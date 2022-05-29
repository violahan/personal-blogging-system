const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

const imageDAO = require("../modules/images-dao");
const articleDAO = require("../modules/article-dao.js");

// Set up multer to allow file uploads and save files
// to temp folder before being used
const multer = require("multer");
const path = require("path");
const upload = multer({
    dest: path.join(__dirname, "temp")
});

// set up fs to allow renaming and moving uploaded files
const fs = require("fs");

// set up jimp to allow resizing image file uploads
// to create thumbnails, and also to limit size of user
// uploaded images
const jimp = require("jimp");
const { route } = require("./application-routes");
const { json } = require("express/lib/response");
const res = require("express/lib/response");


// Adjust these values to change size of images or thumbnails:
const articleImageMaxWidth = 600;
const articleImageMaxHeight = 600;
const thumbnailImageMaxWidth = 150;
const thumbnailImageMaxHeight = 150;






router.get("/createArticle", verifyAuthenticated, async function (req, res){
    
    res.locals.imageMaxWidth = articleImageMaxWidth;
    res.locals.imageMaxHeight = articleImageMaxHeight;

    // If user is logged in (verifyAuthrnticated) will direct to create article page
    res.render("create-article")

})

router.post("/createArticle", upload.single("imageFileUpload"), async function (req, res){

    // Obtain data for the current user who authored the article
    const author = res.locals.user;

    // Obtain data from form:
    const articleTitle = req.body.articleTitle
    const articleContent = req.body.articleContent
    
    // Create article in database - return article ID:
    const articleID = await articleDAO.createNewArticle(author.userID, articleTitle, articleContent) 

    // Set up required image variables, do be defined within if statement below
    let articleImageFileName;
    let articleImagePath;
    let thumbnailFileName;
    let thumbnailPath;

        if(req.file == undefined){
            // No file was uploaded
            // Article will not have an image
            // Set default thumbnail image for article cards
            
            thumbnailPath = 'public/article-images/article-thumbnails/default_thumbnail.png'
            thumbnailFileName = 'default_thumbnail.png'

            await imageDAO.createArticleThumbnail(articleID, thumbnailFileName, thumbnailPath)

        } else {
            
            // is await needed if not returning anything?
            let articleImageInformation = await createImages(articleID, req.file) 
            
            articleImageFileName = articleImageInformation[0].fileName;
            articleImagePath = articleImageInformation[0].filePath;
            thumbnailFileName = articleImageInformation[1].fileName;
            thumbnailPath = articleImageInformation[1].filePath;
            

            await imageDAO.createArticleImage(articleID, articleImageFileName, articleImagePath)
            await imageDAO.createArticleThumbnail(articleID, thumbnailFileName, thumbnailPath)

        }

    res.redirect(`./getArticle?articleID=${articleID}`)

})

async function createImages(articleID, imageFile){

    // get file info and set up
    const articleImagefileInfo = imageFile;

    // Get file type/extension
    const originalFileName = articleImagefileInfo.originalname
    const fileExtension = originalFileName.toLowerCase().substring(originalFileName.lastIndexOf("."))

    // Rename image to image_articleID, save in article-images directory
    const articleImageOldFileName = articleImagefileInfo.path;
    const articleImageNewFileName = `./public/article-images/image_article${articleID}${fileExtension}`;
    fs.renameSync(articleImageOldFileName, articleImageNewFileName);
 
    // make a clone of the image for thumbnail purposes
    const thumbnailImageNewFileName = `./public/article-images/article-thumbnails/thumbnail_article${articleID}${fileExtension}`
    fs.copyFileSync(articleImageNewFileName, thumbnailImageNewFileName)

    // Resize images based on defined maximums
    await resizeArticleImage(articleImageNewFileName)
    await resizeThumbnailImage(thumbnailImageNewFileName)
  
   let imageInformaiton = [
            {
                fileName: `image_article${articleID}${fileExtension}`,
                filePath: `${articleImageNewFileName}`,
                thumbnailFlag: "0"
            },
            {
                fileName: `thumbnail_article${articleID}${fileExtension}`,
                filePath: `${thumbnailImageNewFileName}`,
                thumbnailFlag: "1"
            }   
        ]

   return imageInformaiton

}

async function resizeArticleImage(filePath){

    let articleImage = await jimp.read(filePath)

    if(articleImage.bitmap.width > articleImageMaxWidth){
        articleImage.resize(articleImageMaxWidth, jimp.AUTO);
    }

    if(articleImage.bitmap.height > articleImageMaxHeight){

        articleImage.resize(jimp.AUTO, articleImageMaxHeight);

    }

    await articleImage.write(filePath)

    return filePath;
}

async function resizeThumbnailImage(filePath){

    let thumbnailImage = await jimp.read(filePath)

        if(thumbnailImage.bitmap.width > thumbnailImageMaxWidth){
            thumbnailImage.resize(thumbnailImageMaxWidth, jimp.AUTO);
        }

        if(thumbnailImage.bitmap.height > thumbnailImageMaxHeight){
            thumbnailImage.resize(jimp.AUTO, thumbnailImageMaxHeight);
            
        }

    await thumbnailImage.write(filePath)

    return filePath;
}


module.exports = router;