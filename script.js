document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    var key = event.key || event.keyCode;

    if (key === 'Escape' || key === 'Esc' || key === 27) {
        $("#country_details").hide();
    }
});

function on_country_details_click() {
    $("#country_details").hide();
}

function init_countries() {
    let spreadsheet_url = "https://docs.google.com/spreadsheets/d/1ekFxb2alTcKRRemIsXoG8Un41cRW4q19HC4iEstOs7U/pubhtml";
    Tabletop.init({
        key: spreadsheet_url,
        callback: set_country_data,
        simpleSheet: true
    })
}
let country_dicts = {}
function set_country_data(data) {
    country_dicts = data;
    color_countries();
}


function color_countries() {
    for (let i in country_dicts) {
        let country_div = document.getElementById(country_dicts[i].Country);
        if (country_dicts[i].Read == "Read") {
            country_div.style.fill = "#a2f89f";
        } else if (country_dicts[i].Read == "Wanted") {
            country_div.style.fill = "#fae77c";
        } else {
            country_div.style.fill = "#ffd9d9";
        }
    }
}

// Add the same function to all path elements
$(document).ready(function () {
    $('path').click(function () {
        on_country_click(event, this.id);
    });
    init_countries();
});

function set_star_rating(star_rating) {
    // TODO only works for the first country with a rating
    let rating = parseInt(star_rating) || 0;
    let rating_div = document.getElementById("rating_div");
    let stars = rating_div.getElementsByTagName("span")

    for (i = 0; i < rating; i++) {
        stars[i].classList.remove("fa-star-o")
        stars[i].classList.add("fa-star")
    }
    for (i = rating; i < 5; i++) {
        stars[i].classList.remove("fa-star")
        stars[i].classList.add("fa-star-o")
    }
}

// function book_data_google_api(isbn) {
//     // TODO API Key einschränken, nur von christophweber.net
//     book_title.textContent = "";
//     book_author.textContent = "";
//     book_summary_text.textContent = "";
//     book_cover.src = "";
//     if (isbn != "") {
//         let google_api_key = "AIzaSyDeVVKLKHV-Bs4H1t3dosjntojl9fkdqVw";
//         let google_url = "https://www.googleapis.com/";

//         $.get(`${google_url}books/v1/volumes?q=isbn:${isbn}&key=${google_api_key}`, function (response) {

//             if (response.items != null) {
//                 book_title = document.getElementById("book_title");
//                 book_title.textContent = response.items[0].volumeInfo.title;
//                 book_author = document.getElementById("book_author");
//                 book_author.textContent = response.items[0].volumeInfo.authors;
//                 book_summary_text = document.getElementById("book_summary_text");
//                 book_summary_text.textContent = response.items[0].volumeInfo.description;
//                 book_cover = document.getElementById("book_cover");
//                 if (response.items[0].volumeInfo.imageLinks != null) {
//                     book_cover.src = response.items[0].volumeInfo.imageLinks.thumbnail;
//                 } else {
//                     console.log(`No thumbnail for ${isbn}`);
//                     book_cover.src = "";
//                 }
//             } else {
//                 // console.log("ISBN not resolvable");
//                 console.log(isbn);
//             }
//         });
//     }
// }

// function rating_data_goodreads_api(isbn) {
//     // TODO
//     // goodreads API https://www.goodreads.com/api
//     // key: IHC3XKlca8iW8bG921faA
//     let goodreads_api_key = "IHC3XKlca8iW8bG921faA";
//     let goodreads_user_id = "85284077";
//     let goodreads_url = "https://www.goodreads.com/";
//     let req_book_id = `${goodreads_url}book/isbn_to_id?isbn=${isbn}?key=${goodreads_api_key}&format=json`;
//     let req_json = `${goodreads_url}book/isbn/${isbn}?user_id=${goodreads_user_id}&format=json`;
//     let req_tmp = "https://www.goodreads.com/book/isbn_to_id?isbn=9780385517836&key=IHC3XKlca8iW8bG921faA";

//     let my_rating = 2;
//     let avg_rating = 3.7;
// }

function get_country_dict(country_name) {
    // TODO Check if page fully loaded
    for (let i in country_dicts) {
        if (country_dicts[i].Country == country_name) {
            return country_dicts[i];
        }
    }
    return null;
}

function on_country_click(e, country_id) {
    // Information from DOM Elements
    let left = e.clientX + "px";
    let top = e.clientY + "px";
    let country_details = document.getElementById("country_details");
    let country = document.getElementById(country_id);

    let country_name_text = country.getElementsByTagName("title")[0].textContent;
    let country_name = document.getElementById("country_name");

    // Fill Country Summary
    country_name.textContent = country_name_text;
    country_dict = get_country_dict(country_id);
    book_title.textContent = country_dict.Title;
    book_author.textContent = country_dict.Author;
    book_summary_text.textContent = country_dict.Description;
    book_cover.src = country_dict.Thumbnail;

    set_star_rating(country_dict.Rating);

    // Reset position to appear at Mouse Cursor
    country_details.style.left = left;
    country_details.style.top = top;


    // $("#" + divid).toggle();country_details
    // $("#" + divid).show();
    $("#country_details").show();
    return false;
}