
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

function on_country_click(e, divid, country_id) {
    let left = e.clientX + "px";
    let top = e.clientY + "px";
    let country_details = document.getElementById(divid);
    let country = document.getElementById(country_id);

    let country_name_text = country.getElementsByTagName("title")[0].textContent;

    // $country_details.find('#country_name').html(country_name_text);
    // book_metadata = country_details.getElementById("book_metadata");

    // Metadata
    country_name = document.getElementById("country_name");
    country_name.textContent = country_name_text;
    book_title = document.getElementById("book_title");
    book_title.textContent = "The Associate";
    book_author = document.getElementById("book_author");
    book_author.textContent = "John Grisham";

    // Review
    goodreads_link = document.getElementById("goodreads_link");
    goodreads_link.textContent = "Link";
    reading_status = document.getElementById("reading_status");
    reading_status.textContent = "Read";
    // scrape from goodreads
    rating = document.getElementById("rating");
    rating.textContent = "4/5";

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