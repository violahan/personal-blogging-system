const express = require("express");
const router = express.Router();
const { verifyAuthenticated } = require("../middleware/auth-middleware.js");

const imageDAO = require("../modules/images-dao");
const articleDAO = require("../modules/article-dao.js");
const notificationFunctions = require("../modules/notification-functions.js");
const subscribeDAO = require("../modules/subscribe-dao.js");
const articleFunctions = require("../modules/display-article");
const likeDao = require("../modules/like-dao");
const notificationDAO = require("../modules/notifications-dao.js");
const commentDao = require("../modules/comment-dao.js");

// Set up multer to allow file uploads and save files
// to temp folder before being used
const multer = require("multer");
const path = require("path");
const upload = multer({
  dest: path.join(__dirname, "temp"),
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

router.get("/createArticle", verifyAuthenticated, async function (req, res) {
  res.locals.imageMaxWidth = articleImageMaxWidth;
  res.locals.imageMaxHeight = articleImageMaxHeight;
  res.locals.title = "Create Article";
  // If user is logged in (verifyAuthrnticated) will direct to create article page
  res.render("create-article");
});

router.post(
  "/createArticle",
  upload.single("imageFileUpload"),
  async function (req, res) {
    // Obtain data for the current user who authored the article
    const author = res.locals.user;

    // Obtain data from form:
    const articleTitle = req.body.articleTitle;
    const articleContent = req.body.articleContent;

    // Create article in database - return article ID:
    const articleID = await articleDAO.createNewArticle(
      author.userID,
      articleTitle,
      articleContent
    );

    // Set up required image variables, do be defined within if statement below
    let articleImageFileName;
    let articleImagePath;
    let thumbnailFileName;
    let thumbnailPath;

    if (req.file == undefined) {
      // No file was uploaded
      // Article will not have an image
      // Set default thumbnail image for article cards

      thumbnailPath =
        "./article-images/article-thumbnails/default_thumbnail.png";
      thumbnailFileName = "default_thumbnail.png";

      await imageDAO.createArticleThumbnail(
        articleID,
        thumbnailFileName,
        thumbnailPath
      );
    } else {
      // is await needed if not returning anything?
      let articleImageInformation = await createImages(articleID, req.file);

      articleImageFileName = articleImageInformation[0].fileName;
      articleImagePath = articleImageInformation[0].filePath;
      thumbnailFileName = articleImageInformation[1].fileName;
      thumbnailPath = articleImageInformation[1].filePath;

      await imageDAO.createArticleImage(
        articleID,
        articleImageFileName,
        articleImagePath
      );
      await imageDAO.createArticleThumbnail(
        articleID,
        thumbnailFileName,
        thumbnailPath
      );
    }

    // Create notificaiton related to this article:
    // Check if any subscribers:
    const subscribers = await subscribeDAO.getSubscribesByAuthorId(
      author.userID
    );

    // If there are subscribers - create a notification:
    if (subscribers != "") {
      const notificationType = "newArticle";
      const notificaitonContent =
        author.userName + " has written a new article titled " + articleTitle;
      const usersToBeNotified = subscribers;
      const idForLink = articleID;
      const articleIDForLink = "";
      await notificationFunctions.createNewNotification(
        notificationType,
        notificaitonContent,
        usersToBeNotified,
        idForLink,
        articleIDForLink
      );
    } else {
      // No subscribers, no notifications made
    }

    res.redirect(`./getArticle?articleID=${articleID}`);
  }
);

async function createImages(articleID, imageFile) {
  // get file info and set up
  const articleImagefileInfo = imageFile;

  // Get file type/extension
  const originalFileName = articleImagefileInfo.originalname;
  const fileExtension = originalFileName
    .toLowerCase()
    .substring(originalFileName.lastIndexOf("."));

  // Rename image to image_articleID, save in article-images directory
  const articleImageOldFileName = articleImagefileInfo.path;
  const articleImageNewFileName = `./public/article-images/image_article${articleID}${fileExtension}`;
  fs.renameSync(articleImageOldFileName, articleImageNewFileName);

  // make a clone of the image for thumbnail purposes
  const thumbnailImageNewFileName = `./public/article-images/article-thumbnails/thumbnail_article${articleID}${fileExtension}`;
  fs.copyFileSync(articleImageNewFileName, thumbnailImageNewFileName);

  // Resize images based on defined maximums
  await resizeArticleImage(articleImageNewFileName);
  await resizeThumbnailImage(thumbnailImageNewFileName);

  let imageInformaiton = [
    {
      fileName: `image_article${articleID}${fileExtension}`,
      filePath: `./article-images/image_article${articleID}${fileExtension}`,
      thumbnailFlag: "0",
    },
    {
      fileName: `thumbnail_article${articleID}${fileExtension}`,
      filePath: `./article-images/article-thumbnails/thumbnail_article${articleID}${fileExtension}`,
      thumbnailFlag: "1",
    },
  ];

  return imageInformaiton;
}

async function resizeArticleImage(filePath) {
  let articleImage = await jimp.read(filePath);

  if (articleImage.bitmap.width > articleImageMaxWidth) {
    articleImage.resize(articleImageMaxWidth, jimp.AUTO);
  }

  if (articleImage.bitmap.height > articleImageMaxHeight) {
    articleImage.resize(jimp.AUTO, articleImageMaxHeight);
  }

  await articleImage.write(filePath);

  return filePath;
}

async function resizeThumbnailImage(filePath) {
  let thumbnailImage = await jimp.read(filePath);

  if (thumbnailImage.bitmap.width > thumbnailImageMaxWidth) {
    thumbnailImage.resize(thumbnailImageMaxWidth, jimp.AUTO);
  }

  if (thumbnailImage.bitmap.height > thumbnailImageMaxHeight) {
    thumbnailImage.resize(jimp.AUTO, thumbnailImageMaxHeight);
  }

  await thumbnailImage.write(filePath);

  return filePath;
}

router.get("/editArticle", async function (req, res) {
  let articleID = req.query.articleID;
  let articleAuthorID = req.query.articleAuthorID;

  res.locals.imageMaxWidth = articleImageMaxWidth;
  res.locals.imageMaxHeight = articleImageMaxHeight;

  if (res.locals.user.userID == articleAuthorID) {
    //Edit Article
    // Get Article content
    let articleToEdit = await articleDAO.getArticleByID(articleID);
    res.locals.articleToEdit = articleToEdit;

    // Get article images (if any)
    // If this returns 1 image, it is the default thumbnail,
    // if 2 there is an image on the article
    let articleImages = await imageDAO.getAllImageByArticleID(articleID);
    if (articleImages.length == 1) {
      // Only the default thumbnail - show no image
      articleImages = [];
    } else {
      articleImages = articleImages[1];
    }

    res.locals.imagesToEdit = articleImages;
    res.locals.title = "Edit Article";
    res.render("edit-article");
  } else {
    // Not allowed to edit article
    res.redirect(`/getArticle?articleID=${articleID}`);
  }
});

router.post(
  "/editArticle",
  upload.single("imageFileUpload"),
  async function (req, res) {
    const articleID = req.query.articleID;

    // Obtain data from form:
    const articleTitle = req.body.articleTitle;
    const articleContent = req.body.articleContent;

    await articleDAO.updateArticle(articleID, articleTitle, articleContent);

    // Check for image upload - if none the image part will not be changed
    if (req.file == undefined) {
      // Do not change the images related to the file. Either keep
      // the ones used, or, there are no images.

      if (req.body.deleteImage == 1) {
        // User did not add a new image, and chose to delete the image:

        // Delete current images from server if any:
        const articleImages = await imageDAO.getAllImageByArticleID(articleID);

        if (articleImages) {
          for (let i = 0; i < articleImages.length; i++) {
            let imagePathToDelete = articleImages[i].path;
            let fullImageFilePath =
              "./public" +
              imagePathToDelete.substring(imagePathToDelete.indexOf("/"));
            if (articleImages[i].fileName == "default_thumbnail.png") {
              // Do not delete the default thumbnail image
            } else {
              // Delete the image on the server
              fs.unlinkSync(fullImageFilePath);
            }
          }

          // Delete the current images on the database file
          await imageDAO.deleteAllArticleImages(articleID);

          // Add default thumbnail to the article
          thumbnailPath =
            "./article-images/article-thumbnails/default_thumbnail.png";
          thumbnailFileName = "default_thumbnail.png";
          await imageDAO.createArticleThumbnail(
            articleID,
            thumbnailFileName,
            thumbnailPath
          );
        }
      }
    } else {
      // New image has been uploaded

      // Delete the current image on the file
      await imageDAO.deleteAllArticleImages(articleID);

      // Make new article images (these will overwrite the old images on the server)
      let articleImageInformation = await createImages(articleID, req.file);

      articleImageFileName = articleImageInformation[0].fileName;
      articleImagePath = articleImageInformation[0].filePath;
      thumbnailFileName = articleImageInformation[1].fileName;
      thumbnailPath = articleImageInformation[1].filePath;

      await imageDAO.createArticleImage(
        articleID,
        articleImageFileName,
        articleImagePath
      );
      await imageDAO.createArticleThumbnail(
        articleID,
        thumbnailFileName,
        thumbnailPath
      );
    }

    res.redirect(`/getArticle?articleID=${articleID}`);
  }
);

// load page to display a given article will require /getArticle?articleID=XXX in the URL
router.get("/getArticle", async function (req, res) {
  if (req.query.deleteMessage) {
    res.locals.deleteMessage = req.query.deleteMessage;
  }

  const articleID = req.query.articleID;
  const articleInfo = await articleDAO.getArticleByID(articleID);

  const articleImages = await imageDAO.getMainImageByArticleID(articleID);

  if (articleImages == "undefined") {
    res.locals.articleImages = "";
  } else {
    res.locals.articleImages = articleImages[0];
  }

  const commentsToDisplay =
    await articleFunctions.getAllCommentsByArticleIDOrdered(articleID);

  // Get details of all likes on article
  const likesOnArticle = await likeDao.getLikesByArticle(articleID);

  res.locals.numberOfLikes = likesOnArticle.length;

  // Check if user has liked the article
  if (res.locals.user) {
    // There is a logged in user

    let userHasLiked = "";
    for (let i = 0; i < likesOnArticle.length; i++) {
      if (res.locals.user.userID == likesOnArticle[i].userID) {
        userHasLiked = "true";
      }
    }

    res.locals.userHasLiked = userHasLiked;
  } else {
    // There is no logged in user - user has not liked
    res.locals.userHasLiked = "";
  }

  // Check if user has subscribed to author
  if (res.locals.user) {
    // There is a logged in user

    // Get details of all subscribers to the author
    const subscribersToAuthor = await subscribeDAO.getSubscribesByAuthorId(
      articleInfo.authorID
    );

    let userHasSubscribed = "";
    for (let i = 0; i < subscribersToAuthor.length; i++) {
      if (res.locals.user.userID == subscribersToAuthor[i].userSubscriberID) {
        userHasSubscribed = "true";
      }
    }

    res.locals.userHasSubscribed = userHasSubscribed;
  } else {
    // There is no logged in user - user has not Subscribed
    res.locals.userHasSubscribed = "";
  }
  //

  res.locals.articleInfo = articleInfo;
  res.locals.commentsToDisplay = commentsToDisplay;
  res.locals.title = "Article";

  res.render("article");
});

// Route to allow AJAX requests from clientside JS for ordered articles
router.get("/sortedAllArticles", async function (req, res) {
  // Obtain the sort option, and the order option from the
  // request generated on change of the filters in handlebars
  const orderColumn = req.query.value;
  const orderBy = req.query.order;
  const userId = req.query.userId || null;
  let orderedArticles;
  if (userId) {
    orderedArticles = await articleDAO.getAllSortedArticlesByUser(
      userId,
      orderColumn,
      orderBy
    );
  } else {
    orderedArticles = await articleDAO.getAllSortedArticles(
      orderColumn,
      orderBy
    );
  }
  res.json(orderedArticles);
});

router.get("/deleteArticle", async function (req, res) {
  //As the deleting an article is a get request, check that the
  // user is allowed to delete the article - either they are the
  // article author
  const articleID = req.query.articleID;
  const articleAuthorID = req.query.articleAuthorID;
  const currentUserID = res.locals.user.userID;
  if (articleAuthorID == currentUserID) {
    // Allowed to delete the article
    deleteMessage = "Article deleted";
    // Delete items in order to ensure no database issues:
    // Delete all comments on article
    await commentDao.deleteAllArticleComments(articleID);
    // Delete all likes
    await likeDao.deleteAllArticleLikes(articleID);
    // Delete images
    // Delete images from server
    const articleImages = await imageDAO.getAllImageByArticleID(articleID);
    if (articleImages) {
      for (let i = 0; i < articleImages.length; i++) {
        let imagePathToDelete = articleImages[i].path;
        let fullImageFilePath =
          "./public" +
          imagePathToDelete.substring(imagePathToDelete.indexOf("/"));
        if (articleImages[i].fileName == "default_thumbnail.png") {
          // Do not delete the default thumbnail image
        } else {
          // Delete the image on the server
          fs.unlinkSync(fullImageFilePath);
        }
      }
    }
    // Delete images from Database
    await imageDAO.deleteAllArticleImages(articleID);
    // Delete the article from the Database
    await articleDAO.deleteArticle(articleID);
  } else {
    deleteMessage = "Not authorised to delete comment";
  }
  // Once an article is deleted, check to see if any notifications related to it
  // and remove them
  await notificationDAO.removeNotificationsByTypeAndIDLink(
    "newArticle",
    articleID
  );
  res.redirect("/?deleteMessage=" + deleteMessage);
});

module.exports = router;
