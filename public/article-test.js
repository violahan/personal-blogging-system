

async function sortOptions(){

    // Obtain the selected option from the drop down menu - returns the value
    let sortOption = document.getElementById('sortOption');
    let sortOptionValue = sortOption.options[sortOption.selectedIndex].value;
    
    // Obtain the sort order from the radio boxes - defauls to descending
    let sortOrder = document.getElementsByName('sortOrder');
    let sortOrderOption = "desc"

    if(sortOrder[0].checked == false){
        sortOrderOption = "asc"
    } else if (sortOrder[0].checked == true){
        sortOrderOption = "desc"
    }

    // const response = await fetch("./sortedArticles?value=sortOptionValue&order=")



}



