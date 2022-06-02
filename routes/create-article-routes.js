const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

const imageDAO = require("../modules/images-dao");
const articleDAO = require("../modules/article-dao.js");
const notificationFunctions = require("../modules/notification-functions.js");
const subscribeDAO = require("../modules/subscribe-dao.js")


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
    res.locals.title = 'Create Article';
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
            
            thumbnailPath = './article-images/article-thumbnails/default_thumbnail.png'
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


    // Create notificaiton related to this article:
    // Check if any subscribers:
        const subscribers = await subscribeDAO.getSubscribesByAuthorId(author.userID);

    // If there are subscribers - create a notification:
        if(subscribers != ""){
            const notificationType = "newArticle";
            const notificaitonContent = author.userName+" has written a new article titled "+articleTitle;
            const usersToBeNotified = subscribers;
            const idForLink = articleID;
            const articleIDForLink = ""
            await notificationFunctions.createNewNotification(notificationType, notificaitonContent, usersToBeNotified, idForLink, articleIDForLink);
        } else {
            // No subscribers, no notifications made
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
                filePath: `./article-images/image_article${articleID}${fileExtension}`,
                thumbnailFlag: "0"
            },
            {
                fileName: `thumbnail_article${articleID}${fileExtension}`,
                filePath: `./article-images/article-thumbnails/thumbnail_article${articleID}${fileExtension}`,
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


router.get("/editArticle", async function (req, res){
    let articleID = req.query.articleID;
    let articleAuthorID = req.query.articleAuthorID;
  
    res.locals.imageMaxWidth = articleImageMaxWidth;
    res.locals.imageMaxHeight = articleImageMaxHeight;

    if(res.locals.user.userID == articleAuthorID){
      //Edit Article
      // Get Article content
      let articleToEdit = await articleDAO.getArticleByID(articleID)
      res.locals.articleToEdit = articleToEdit
  
      // Get article images (if any)
      // If this returns 1 image, it is the default thumbnail,
      // if 2 there is an image on the article
      let articleImages = await imageDAO.getAllImageByArticleID(articleID)
      if(articleImages.length == 1){
        // Only the default thumbnail - show no image
        articleImages = [];
      } else {
        articleImages = articleImages[1];
      }
  
      res.locals.imagesToEdit = articleImages
  
      res.render("edit-article")
  
    } else {
      // Not allowed to edit article
      res.redirect(`/getArticle?articleID=${articleID}`)
    }
  
  });

router.post("/editArticle", async function (req, res){
    const articleID = req.query.articleID
    
    // Obtain data from form:
    const articleTitle = req.body.articleTitle
    const articleContent = req.body.articleContent

  
});

// router.post("/editProfile", async function (req, res) {
//   const userToEdit = {
//     userID: req.body.userID,
//     userName: req.body.userName,
//     fName: req.body.fname,
//     lName: req.body.lname,
//     DOB: req.body.dob,
//     description: req.body.bio,
//     avatarFilePath: req.body.avatar
//   };

//   await userDao.updateUser(userToEdit);
//   res.redirect("/profile?id="+userToEdit.userID)
// })


module.exports = router;