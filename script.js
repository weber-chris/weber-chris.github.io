const READ_COLOR = "#a2f89f";
const WANTED_COLOR = "#fae77c";
const OPEN_COLOR = "#ffd9d9";
const READ_COLOR_HIGHLIGHT = "#08f000";
const WANTED_COLOR_HIGHLIGHT = "#f5c800";
const OPEN_COLOR_HIGHLIGHT = "#ff0000";
let current_country = null;

$(window).on('orientationchange', function (e) {
    location.reload();
});

$(window).on('click', function (e) {
    if (e.target == detailModal) {
        detailModal.style.display = "none";
    }
    if (e.target == countryModal) {
        countryModal.style.display = "none";
        reset_country_color();
    }
})

document.addEventListener("keyup", function (event) {
    if (event.defaultPrevented) {
        return;
    }

    var key = event.key || event.keyCode;

    if (key === "Escape" || key === "Esc" || key === 27) {
        countryModal.style.display = "none";
        reset_country_color();
    }
});


function reset_country_color() {
    if (current_country != null) {
        let country_dict = get_country_dict(current_country);
        let country = document.getElementById(current_country);
        if (country_dict.Read == "Read") {
            country.style.fill = READ_COLOR;
        } else if (country_dict.Read == "Current") {
            let stripes_currently_reading_fg = document.getElementById("stripes_currently_reading_foreground");
            stripes_currently_reading_fg.style.stroke = READ_COLOR;
            let stripes_currently_reading_bg = document.getElementById("stripes_currently_reading_background");
            stripes_currently_reading_bg.style.fill = WANTED_COLOR;
            country.style.fill = "url(#stripes_currently_reading)";
        } else if (country_dict.Read == "Wanted") {
            country.style.fill = WANTED_COLOR;
        } else {
            country.style.fill = OPEN_COLOR;
        }
    }
}

// function details_close() {
//     reset_country_color();
//     $("#country_details").hide();
//     $("#invisible_div").hide();
// }

function init_countries() {
    let spreadsheet_url = "https://docs.google.com/spreadsheets/d/1ekFxb2alTcKRRemIsXoG8Un41cRW4q19HC4iEstOs7U/pub?output=csv";
    Papa.parse(spreadsheet_url, {
        download: true,
        header: true,
        complete: set_country_data
    })
}
// function init_countries() {
//     let spreadsheet_url = "https://docs.google.com/spreadsheets/d/1ekFxb2alTcKRRemIsXoG8Un41cRW4q19HC4iEstOs7U/pubhtml";
//     Tabletop.init({
//         key: spreadsheet_url,
//         callback: set_country_data,
//         simpleSheet: true
//     })
// }
let country_dicts = {}
function set_country_data(data) {
    country_dicts = data.data;
    currently_reading();
    color_countries();
    calculate_statistc();
    create_overview_table();
}

function create_overview_table() {
    const dt_overview = $('#tbl_overview').DataTable({
        searching: true,
        language: { search: "" },
        order: [[0, 'asc'], [4, 'desc'], [1, 'asc']],
        // scrollResize: true,
        // scrollY: '60vh',
        // scrollCollapse: true,
        paging: false
    });

    for (let i in country_dicts) {
        // Hidden column with status for initial ordering
        let status_rank = 4;
        if (country_dicts[i]['Read'] === 'Read') {
            status_rank = 1;
        } else if (country_dicts[i]['Read'] === 'Current') {
            status_rank = 2;
        } else if (country_dicts[i]['Read'] === 'Wanted') {
            status_rank = 3;
        }
        let r = dt_overview.row.add(
            [status_rank,
                country_dicts[i]['Country'].replaceAll("_", " "),
                country_dicts[i]['Title'],
                country_dicts[i]['Author'],
                country_dicts[i]['Rating']]
        ).draw(false).node();

        if (status_rank === 1) {
            $(r).addClass('read-row');
        } else if (status_rank === 2) {
            $(r).addClass('current-row');
        } else if (status_rank === 3) {
            $(r).addClass('wanted-row');
        } else {
            $(r).addClass('open-row');
        }
        // dt_overview.row.add([country_dicts[i]['Read'], country_dicts[i]['Country'].replaceAll("_"," "), country_dicts[i]['Title'], country_dicts[i]['Author'], country_dicts[i]['Rating']]).draw(false);
    };

    // We only need the status to order
    dt_overview.column(0).visible(false);
    // set placeholder value of search box
    $('#tbl_overview_filter').find('input').attr('placeholder', 'Search the Table...');
}

function color_countries() {
    for (let i in country_dicts) {
        let country_div = document.getElementById(country_dicts[i].Country);
        if (country_dicts[i].Read == "Read") {
            country_div.style.fill = READ_COLOR;
        } else if (country_dicts[i].Read == "Current") {
            let stripes_currently_reading_fg = document.getElementById("stripes_currently_reading_foreground");
            stripes_currently_reading_fg.style.stroke = READ_COLOR;
            let stripes_currently_reading_bg = document.getElementById("stripes_currently_reading_background");
            stripes_currently_reading_bg.style.fill = WANTED_COLOR;
            country_div.style.fill = "url(#stripes_currently_reading)";
        } else if (country_dicts[i].Read == "Wanted") {
            country_div.style.fill = WANTED_COLOR;
        } else {
            country_div.style.fill = OPEN_COLOR;
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
        refreshRate: 30,
        // onUpdatedCTM: details_close,
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
    reset_country_color();
    // Information from DOM Elements
    // let left = parseInt(e.clientX);
    // let top = parseInt(e.clientY);
    // let left = e.clientX + "px";
    // let top = e.clientY + "px";
    current_country = country_id;
    // let country_details = document.getElementById("country_details");
    let country = document.getElementById(country_id);

    let country_name_text = country.getElementsByTagName("title")[0].textContent;
    let country_name = document.getElementById("country_name");
    let book_summary_referrer = document.getElementById("book_summary_referrer");


    // Fill Country Summary
    country_name.textContent = country_name_text;
    country_dict = get_country_dict(country_id);
    if (country_dict.Title !== "") {
        book_title_content.textContent = country_dict.Title;
        book_title_content.href = country_dict.Goodreads;
        book_author.textContent = country_dict.Author;
        book_summary_text.textContent = country_dict.Description;
        book_cover.src = country_dict.Thumbnail;
        book_summary_referrer.style.display = 'none';
        // book_summary_referrer.style.visibility = 'collapse';
    } else {
        book_title_content.textContent = 'No book selected - yet!';
        book_title_content.href = 'https://forms.gle/JFwjQM2dGFusLnJH8';
        book_author.textContent = '';
        book_summary_text.textContent = 'I have not decided on a book to read from this country. Please go on and recommend one for me!';
        book_cover.src = 'https://i.imgur.com/XUOWmPt.jpg';
        book_summary_referrer.style.display = 'block';
        // book_summary_referrer.style.visibility = 'visible';
    }
    set_star_rating(country_dict.Rating);

    // div_width = $('#country_details').width();
    // div_height = $('#country_details').height();

    // max_width = parseInt(window.innerWidth);
    // max_height = parseInt(window.innerHeight);


    // Reset position to appear at Mouse Cursor
    // if (div_width + left < max_width) {
    //     country_details.style.left = left + "px";
    // } else {
    //     country_details.style.left = max_width - div_width - 5 + "px";
    // }
    // if (div_height + top < max_height) {
    //     country_details.style.top = top + "px";
    // } else {
    //     country_details.style.top = max_height - div_height - 5 + "px";
    // }

    // Highlight selected country
    if (country_dict.Read == "Read") {
        country.style.fill = READ_COLOR_HIGHLIGHT;
    } else if (country_dict.Read == "Current") {
        let stripes_currently_reading_fg = document.getElementById("stripes_currently_reading_foreground");
        stripes_currently_reading_fg.style.stroke = READ_COLOR_HIGHLIGHT;
        let stripes_currently_reading_bg = document.getElementById("stripes_currently_reading_background");
        stripes_currently_reading_bg.style.fill = WANTED_COLOR_HIGHLIGHT;
        country.style.fill = "url(#stripes_currently_reading)";
    } else if (country_dict.Read == "Wanted") {
        country.style.fill = WANTED_COLOR_HIGHLIGHT;
    } else {
        country.style.fill = OPEN_COLOR_HIGHLIGHT;
    }
    // let dxt =  document.getElementById("country_details")
    // dxt.style.display = "block";
    // detailModal.style.display = "block";
    $("#country_details").css('display', 'block');
    // $("#country_details").show();
    // $("#invisible_div").show();
    return false;
}

function currently_reading() {
    let total = country_dicts.length;

    let curr_read = "";
    for (let i in country_dicts) {
        if (country_dicts[i].Read == "Current") {
            curr_read = `${country_dicts[i].Country.replaceAll("_"," ")} - ${country_dicts[i].Title} (${country_dicts[i].Author})`;
            break;
        }
    }
    let currently_reading_html = document.getElementById("currently-reading");

    currently_reading_html.innerHTML = curr_read;
};

function calculate_statistc() {
    let total = country_dicts.length;

    let read = 0;
    let planned = 0;
    let open = 0;
    for (let i in country_dicts) {
        if (country_dicts[i].Read == "Read") {
            read++;
        } else if (country_dicts[i].Read == "Current") {
            planned++;
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
};


function isMobileDevice() {
    let isMobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    return isMobile
};

var detailModal = document.getElementById("detail_modal");

function showTable() {
    detailModal.style.display = "block";
};

function closeModal() {
    detailModal.style.display = "none";
}

var countryModal = document.getElementById("country_details");
function closeCountryDetail(){    
    countryModal.style.display = "none";
    reset_country_color();
}

function closeCountryDetailMobile(){
    if (isMobileDevice()){
        closeCountryDetail();
    }
}