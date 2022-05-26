

async function sortOptions(){

    // Obtain the selected option from the drop down menu - returns the value
    let sortOption = document.getElementById('sortOption');
    let sortOptionValue = sortOption.options[sortOption.selectedIndex].value;
    
    // Obtain the sort order from the radio boxes - defauls to descending
    let sortOrder = document.getElementsByName('sortOrder');
    let sortOrderOption = "desc"

    // set the sort order based on which radio box is checked:
    if(sortOrder[0].checked == false){
        sortOrderOption = "asc"
    } else if (sortOrder[0].checked == true){
        sortOrderOption = "desc"
    }

    // Make get request to the server, providing the sort option and sort order
    // returns ordered article array
    const response = await fetch(`./sortedArticles?value=${sortOptionValue}&order=${sortOrderOption}`)
    const orderedArticleArray = await response.json();
    

    // Loop to take the ordered array, extract the key information only,
    // format as HTML article cards to be displayed.

    let cardsToDisplay = "";

    for (let i = 0; i < orderedArticleArray.length; i++) {
        let articleID = orderedArticleArray[i].articleID;
        let title = orderedArticleArray[i].title;
        let userName = orderedArticleArray[i].userName;
        let publishDate = orderedArticleArray[i].publishDate;
        let thumbnailImagePath = orderedArticleArray[i].thumbnailImagePath;
      
        let cardHTML = `
                <div class="card">
                    <div class="cardImage">
                        <img src="${thumbnailImagePath}" alt="">
                    </div>
                    <div class="cardContent">
                        <p>ArticleID = ${articleID}</p>
                        <a href="./getArticle?articleID=${articleID}">
                            <h3>${title}</h3>
                        </a>
                        <a href="/userLoad">
                            <h4>${userName}</h4>
                        </a>
                            
                        <p>${publishDate}</p>
                    </div>
                </div>
                `    
        
        cardsToDisplay = cardsToDisplay+cardHTML;
    };
    
    // Call function to update the visible articles
    updateArticles(cardsToDisplay);
   
}

function updateArticles(cardsToDisplay){
    document.getElementById('all-card-container').innerHTML = cardsToDisplay;
}

