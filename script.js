function init_countries() {
    // let publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/19z0z2cKliGYZHEkiN-1nuJStdU1oMRkOW9bLBW7mbns/pubhtml';
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
    console.log('bla');
    for (let i in country_dicts) {
        let country = country_dicts[i].Country
        let country_path = document.getElementById(country)
        if (country_path == null) {
            console.log(country)
        }
    }

    var array = new Array();
    $('path','#map').each(function () {
        array.push($(this).attr('id'));
    });
    console.log(array);
}

// Add the same function to all path elements
$(document).ready(function () {
    $('path').click(function () {
        on_country_click(event, 'country_details', this.id);
    });
    init_countries();
});

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

function book_data_google_api(isbn) {
    // TODO API Key einschränken, nur von christophweber.net
    // the associate: ISBN 9780385517836
    let google_api_key = "AIzaSyDeVVKLKHV-Bs4H1t3dosjntojl9fkdqVw";
    let google_url = "https://www.googleapis.com/";
    $.get(`${google_url}books/v1/volumes?q=isbn:${isbn}&key=${google_api_key}`, function (response) {

        // console.log(response);
        book_title = document.getElementById("book_title");
        book_title.textContent = response.items[0].volumeInfo.title;
        book_author = document.getElementById("book_author");
        book_author.textContent = response.items[0].volumeInfo.authors;
        book_summary_text = document.getElementById("book_summary_text");
        book_summary_text.textContent = response.items[0].volumeInfo.description;
        book_summary_text = document.getElementById("book_cover");
        book_summary_text.src = response.items[0].volumeInfo.imageLinks.thumbnail;
    });
}

function rating_data_goodreads_api(isbn) {
    // TODO
    // goodreads API https://www.goodreads.com/api
    // key: IHC3XKlca8iW8bG921faA
    let goodreads_api_key = "IHC3XKlca8iW8bG921faA";
    let goodreads_user_id = "85284077";
    let goodreads_url = "https://www.goodreads.com/";
    let req_book_id = `${goodreads_url}book/isbn_to_id?isbn=${isbn}?key=${goodreads_api_key}&format=json`;
    let req_json = `${goodreads_url}book/isbn/${isbn}?user_id=${goodreads_user_id}&format=json`;
    let req_tmp = "https://www.goodreads.com/book/isbn_to_id?isbn=9780385517836&key=IHC3XKlca8iW8bG921faA";

    let my_rating = 2;
    let avg_rating = 3.7;
}

function get_country_dict(country_name) {
    // TODO Check if page fully loaded
    for (let i in country_dicts) {
        if (country_dicts[i].Country == country_name) {
            return country_dicts[i];
        }
    }
    return null;
}

function on_country_click(e, divid, country_id) {
    // Information from DOM Elements
    let left = e.clientX + "px";
    let top = e.clientY + "px";
    let country_details = document.getElementById(divid);
    let country = document.getElementById(country_id);

    let country_name_text = country.getElementsByTagName("title")[0].textContent;
    let country_name = document.getElementById("country_name");

    // Fill Country Summary
    country_name.textContent = country_name_text;
    country_dict = get_country_dict(country_id);
    let isbn = country_dict.ISBN;

    // Metadata from Google-API via ISBN
    book_data_google_api(isbn);

    set_star_rating(2);

    // Reset position to appear at Mouse Cursor
    country_details.style.left = left;
    country_details.style.top = top;

    country.style.fill = "purple";

    // $("#" + divid).toggle();
    $("#" + divid).show();
    return false;
}