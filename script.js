
// document.getElementById('change').onclick = changeColor;
// Add the same function to all path elements
$(document).ready(function () {
    $('path').click(function () {
        on_country_click(event, 'country_details', this.id);
        // alert(this.id);
        // alert('ho ho ho');
    });
});

function clickcountry(myid) {
    // document.getElementById(myid).style.fill = "purple";
    return false;
}

function set_star_rating(star_rating) {
    rating = document.getElementById("rating_div");
    let stars = rating.getElementsByTagName("span")
    for (i = 0; i < star_rating; i++) {
        stars[i].classList.add("fa-star")
    }
    for (i = star_rating; i < 5; i++) {
        stars[i].classList.add("fa-star-o")
    }
}

function extract_from_goodreads(goodreads_url){
    // TODO
    // goodreads API https://www.goodreads.com/api
    // key: IHC3XKlca8iW8bG921faA

    // the associate: ISBN 9780385517836
// fetch(goodreads_url);
// (async () => {
//     const response = await fetch(goodreads_url);
//     const text = await response.text();
//     console.log(text.match(/(?<=\<h1>).*(?=\<\/h1>)/));
//   })()
}

function on_country_click(e, divid, country_id) {
    let left = e.clientX + "px";
    let top = e.clientY + "px";
    let country_details = document.getElementById(divid);
    let country = document.getElementById(country_id);

    let country_name_text = country.getElementsByTagName("title")[0].textContent;

    // $country_details.find('#country_name').html(country_name_text);
    // book_metadata = country_details.getElementById("book_metadata");
    let goodreads_url = "https://www.goodreads.com/book/show/3613997-the-associate";
    extract_from_goodreads(goodreads_url);
    // Metadata
    country_name = document.getElementById("country_name");
    country_name.textContent = country_name_text;
    book_title = document.getElementById("book_title");
    book_title.textContent = "The Associate";
    book_author = document.getElementById("book_author");
    book_author.textContent = "John Grisham";

    // Review, Scrape from goodreads
    avg_rating = document.getElementById("avg_rating");
    avg_rating.textContent = "(⌀3.8)";
    // reading_status = document.getElementById("reading_status");
    // reading_status.textContent = "Read";
    set_star_rating(2);

    //Summary
    book_summary_text = document.getElementById("book_summary_text");
    book_summary_text.textContent = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur nobis assumenda vero doloremque!";

    country_details.style.left = left;
    country_details.style.top = top;

    country.style.fill = "purple";

    // $("#" + divid).toggle();
    $("#" + divid).show();
    return false;
}