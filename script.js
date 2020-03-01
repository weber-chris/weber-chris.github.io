$(window).on('orientationchange', function (e) {
    location.reload();
});

document.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) {
        return;
    }

    var key = event.key || event.keyCode;

    if (key === "Escape" || key === "Esc" || key === 27) {
        $("#country_details").hide();
    }
});


function details_close() {
    $("#country_details").hide();
    $("#invisible_div").hide();
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
    calculate_statistc();
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

function init_touch_controls() {
    let eventsHandler = {
        haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
        , init: function (options) {
            var instance = options.instance
                , initialScale = 1
                , pannedX = 0
                , pannedY = 0

            // Init Hammer
            // Listen only for pointer and touch events
            this.hammer = Hammer(options.svgElement, {
                inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
            })

            // Enable pinch
            this.hammer.get('pinch').set({ enable: true })

            // Handle double tap
            this.hammer.on('doubletap', function (ev) {
                instance.zoomIn()
            })

            // Handle pan
            this.hammer.on('panstart panmove', function (ev) {
                // On pan start reset panned variables
                if (ev.type === 'panstart') {
                    pannedX = 0
                    pannedY = 0
                }

                // Pan only the difference
                instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY })
                pannedX = ev.deltaX
                pannedY = ev.deltaY
            })

            // Handle pinch
            this.hammer.on('pinchstart pinchmove', function (ev) {
                // On pinch start remember initial zoom
                if (ev.type === 'pinchstart') {
                    initialScale = instance.getZoom()
                    instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
                }

                instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
            })

            // Prevent moving the page on some devices when panning over SVG
            options.svgElement.addEventListener('touchmove', function (e) { e.preventDefault(); });
        }

        , destroy: function () {
            this.hammer.destroy()
        }
    }
    return eventsHandler
}

$(document).ready(function () {
    // Add the same function to all path elements
    $('path').click(function () {
        on_country_click(event, this.id);
    });
    init_countries();


    // Initialize Zooming Function
    customEventsHandler = init_touch_controls();
    zoomer = svgPanZoom('#map', {
        controlIconsEnabled: !isMobileDevice(),
        zoomScaleSensitivity: 0.3,
        minZoom: 1,
        maxZoom: 40,
        onUpdatedCTM: details_close,
        customEventsHandler: customEventsHandler
    });

    let map_svg = document.getElementById('map');
    let map_width = map_svg.getBoundingClientRect()['width'];
    let map_height = map_svg.getBoundingClientRect()['height'];
    let init_zoom = map_svg.createSVGPoint();
    init_zoom.x = map_width * 0.5;
    init_zoom.y = map_height * 0.45;
    aspect_ratio = map_height / map_width;
    zoom_grade = 5 * aspect_ratio;

    zoomer.zoomAtPoint(zoom_grade, init_zoom, false);

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
    $("#invisible_div").show();
    return false;
}

function calculate_statistc() {
    let total = country_dicts.length;

    let read = 0;
    let planned = 0;
    let open = 0;
    for (let i in country_dicts) {
        if (country_dicts[i].Read == "Read") {
            read++;
        } else if (country_dicts[i].Read == "Wanted") {
            planned++;
        }
        else {
            open++;
        }
    }
    
    let statistic_total = document.getElementById("statistic_total");
    let statistic_read = document.getElementById("statistic_read");
    let statistic_planned = document.getElementById("statistic_planned");
    let statistic_open = document.getElementById("statistic_open");
    
    statistic_total.innerHTML = `${total} Total`;
    statistic_read.innerHTML = `${read} Read`;
    statistic_planned.innerHTML = `${planned} Planned`;
    statistic_open.innerHTML = `${open} Open`;
}


function isMobileDevice() {
    let isMobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    return isMobile
};