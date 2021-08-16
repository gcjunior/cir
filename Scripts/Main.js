var anchor_offset = 0;
var aux_id = "";
var hash = window.location.hash.replace("#", "");
$("navbar").closest("navbar").addClass(hash);

function LoadDiv() {
    $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
    //$(window).on('load', function () {
    //setTimeout(removeLoader, 2000); //wait for page load PLUS two seconds.
    //});    
}

function removeLoader() {
    $("#loadingDiv").fadeOut(500, function () {
        // fadeOut complete. Remove the loading div
        $("#loadingDiv").remove(); //makes page more lightweight 
    });
}

$("navbar .dropdown-menu a").on('click', function (e) {
    // prevent default anchor click behavior
    //e.preventDefault();
    // animate    
    var id = this.hash.replace("#", "");
    $(this).closest("navbar").addClass(id);
    if (id != aux_id)
        $(this).closest("navbar").removeClass(aux_id);
    aux_id = id;

    $('html, body').animate({
        scrollTop: $(this.hash).offset().top - anchor_offset
    }, 300, function () { });
});

var $body = $("body");
$body.find("a[data-gtag]").click(function () {
    try {
        var event_category = $(this).data("gtag");
        gtag('event', 'Click', { event_category: "'" + event_category + "'", 'non_interaction': 1 });
    } catch (ex) { console.log(ex); }
});

var $floorplans = $("#floorplans");
if ($floorplans.length) {
    LoadDiv();
    $("#contact").addClass("d-none");
    $("footer").addClass("d-none");
    function LoadHomePlans($floorplans) {
        $.ajax({
            type: "GET",
            async: true,
            url: "/WebService.asmx/GetHomePlans",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                var homeplans = JSON.parse(r.d);
                $.each(homeplans, function (k, v) {
                    var div = '<div class="card col-sm-6" data-planid="' + v.id + '" data-bed="' + v.standardBedroom + '" data-bath="' + v.standardBathroom + '" data-den="' + v.standardDen + '"> \
                        <img src = "/Images/Floorplans/' + v.id + '/' + v.standardFloorplanURL + '" class="floorplan card-img-top" /> \
                            <div class="availability d-none"> \
                                <img src="/Images/Floorplans/Availability-Plan.png" class="card-img-top" /> \
                                <div class="units">';
                    $.each(v.suites, function (suiteKey, suiteValue) {
                        div += '<span data-toggle="tooltip" data-placement="top" data-html="true" title="' + v.name + ' - ' + suiteValue.suiteNumber + '<br />' + v.standardBedroom + ' BED ' + v.standardBathroom + ' BATH ' + v.standardArea + ' SQFT " class="unit-' + suiteValue.id + '" style="top: ' + suiteValue.top + '; left: ' + suiteValue.left + ';background-color:' + suiteValue.suiteStatus.bgcolor + '"></span>';
                    });
                    div += '</div> \
                            </div> \
                            <div class="card-body"> \
                                <h4 class="card-title"> \
                                    PLAN <span>' + v.name + '</span> \
                                </h4> \
                                <p class="card-text"> \
                                    ' + v.standardBedroom + ' BED' + (v.standardDen == "1" ? " + DEN" : "") + ', ' + v.standardBathroom + ' BATH <span class="vertical-line"></span> ' + v.standardArea + ' SQFT \
                                    </p> \
                            </div> \
                            <div class="card-footer"> \
                                <ul> \
                                    <li> \
                                        <a href="#consentPopup" class="" data-target="#consentPopup" data-toggle="modal" data-title="INQUIRE" data-form-type="contact-form-fields-1" data-next="btn-next-2" data-next-form="consent-form-two" data-suite="Suite ' + v.name + '" data-fields="suite"><span>INQUIRE</span></a> \
                                    </li> \
                                    <li><a href="#">VIEW AVAILABILITY</a></li> \
                                    <li><a target="_blank" href="/Images/Floorplans/' + v.id + '/' + v.standardFloorplanPDFURL + '">DOWNLOAD FLOORPLAN</a></li> \
                                </ul> \
                            </div> \
                            </div >';
                    $floorplans.find('.content .card-deck').append(div);
                });
                $('[data-toggle="tooltip"]').tooltip()
                $("#contact").removeClass("d-none");
                $("footer").removeClass("d-none");
                LoadFloorplans(null);
                removeLoader();
            },
            error: function (r) {
                $("#contact").removeClass("d-none");
                $("footer").removeClass("d-none");
                alert(r.responseText);
            },
            failure: function (r) {
                $("#contact").removeClass("d-none");
                $("footer").removeClass("d-none");
                alert(r.responseText);
            }
        });
    }

    LoadHomePlans($floorplans);

    function LoadFloorplans(obj) {
        var bedrooms = '0';
        var den = '0';
        var bathrooms = '0';
        if (obj) {
            $(obj).closest("ul").find("a").removeClass("active");
            $(obj).addClass('active');
        }
        var filter = '', filterBed = '', filterBath = '', filterDen = '';
        $floorplans.find(".sidebar .filter-options ul li a.active").each(function () {
            bedrooms = (bedrooms == 0 ? $(this).data("bedrooms") !== undefined ? $(this).data("bedrooms") : '0' : bedrooms);
            den = (den == 0 ? $(this).data("den") !== undefined ? $(this).data("den") : '0' : den);
            bathrooms = (bathrooms == 0 ? $(this).data("bathrooms") !== undefined ? $(this).data("bathrooms") : '0' : bathrooms);
            switch (bedrooms) {
                case '0':
                    break;
                case 0:
                    break;
                default:
                    filter += "[data-bed=" + bedrooms + "]";
                    break;
            }
            switch (den) {
                case '0':
                    break;
                case 0:
                    break;
                default:
                    filter += "[data-den=" + den + "]";
                    break;
            }
            switch (bathrooms) {
                case '0':
                    break;
                case 0:
                    break;
                default:
                    filter += "[data-bath=" + bathrooms + "]";
                    break;
            }
        });
        $floorplans.find(".content .card").addClass("d-none");
        $floorplans.find(".content .card" + filter).removeClass("d-none");
        var hash = '/Floorplans';
        hash = '/Floorplans/' + bedrooms + '/' + bathrooms + '/' + den;
        if (history.pushState) {
            history.pushState(null, null, hash);
        }
        else {
            location.hash = hash;
        }
    }

    $floorplans.find(".sidebar .filter-options ul li a").click(function (e) {
        e.preventDefault();
        LoadFloorplans(this);
    });

    $floorplans.find("#collapseSidebar").on('show.bs.collapse', function () {
        $floorplans.find(".sidebar").removeClass("show-filter-without-options");
    }).on('hide.bs.collapse', function () {
        $floorplans.find(".sidebar").addClass("show-filter-without-options");
    });

    /*
    $floorplans.find(".sidebar .filter-search").click(function () {
        alert(1);
        if ($floorplans.find(".sidebar").hasClass("show-filter-without-options")) {
            $floorplans.find(".sidebar").removeClass("show-filter-without-options");
        } else $floorplans.find(".sidebar").addClass("show-filter-without-options");
    });
    */

    $floorplans.find(".content .card-deck").on('click', '.card-footer ul li:nth-of-type(2) a', function (e) {
        e.preventDefault();
        if ($(this).closest(".card").find(".availability").hasClass("d-none")) {
            $(this).text('VIEW FLOORPLAN');
            $(this).closest(".card").find(".availability").removeClass("d-none");
            $(this).closest(".card").find(".floorplan").addClass("d-none");
        } else {
            $(this).text('VIEW AVAILABILITY');
            $(this).closest(".card").find(".availability").addClass("d-none");
            $(this).closest(".card").find(".floorplan").removeClass("d-none");
        }
    });
}


var $availability = $("#availability");
if ($availability.length) {
    LoadDiv();

    var avaialabilityHomePlans = null;

    function LoadHomePlans($availability) {
        $.ajax({
            type: "GET",
            async: true,
            url: "/WebService.asmx/GetHomePlans",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (r) {
                avaialabilityHomePlans = JSON.parse(r.d);
                $.each(avaialabilityHomePlans, function (k, v) {
                    var div = '';
                    $.each(v.suites, function (suiteKey, suiteValue) {
                        div += '<span data-planid="' + v.id + '" data-suiteid="' + suiteValue.id + '" data-bed="' + suiteValue.bedroom + '" data-bath="' + suiteValue.bathroom + '" data-den="' + suiteValue.den + '" data-toggle="tooltip" data-placement="top" data-html="true" title="' + v.name + ' - ' + suiteValue.suiteNumber + '<br />' + v.standardBedroom + ' BED ' + (v.standardDen == "1" ? '+ DEN ' : '') +  v.standardBathroom + ' BATH ' + v.standardArea + ' SQFT " class="unit-' + suiteValue.id + '" style="top: ' + suiteValue.top + '; left: ' + suiteValue.left + ';background-color:' + suiteValue.suiteStatus.bgcolor + '"></span>';
                    });
                    $availability.find('.content .availability .units').append(div);
                });
                $('[data-toggle="tooltip"]').tooltip();
                LoadAvailabilitySuites(null);
                removeLoader();
            },
            error: function (r) {
                alert(r.responseText);
            },
            failure: function (r) {
                alert(r.responseText);
            }
        });
    }

    LoadHomePlans($availability);

    function LoadAvailabilitySuites(obj) {
        var bedrooms = '0';
        var den = '0';
        var bathrooms = '0';
        if (obj) {
            $(obj).closest("ul").find("a").removeClass("active");
            $(obj).addClass('active');
        }
        var filter = '', filterBed = '', filterBath = '', filterDen = '';
        $availability.find(".sidebar .filter-options ul li a.active").each(function () {
            bedrooms = (bedrooms == 0 ? $(this).data("bedrooms") !== undefined ? $(this).data("bedrooms") : '0' : bedrooms);
            den = (den == 0 ? $(this).data("den") !== undefined ? $(this).data("den") : '0' : den);
            bathrooms = (bathrooms == 0 ? $(this).data("bathrooms") !== undefined ? $(this).data("bathrooms") : '0' : bathrooms);

            switch (bedrooms) {
                case '0':
                    break;
                case 0:
                    break;
                default:
                    filterBed = "[data-bed=" + bedrooms + "]";
                    break;
            }
            switch (den) {
                case '0':
                    break;
                case 0:
                    break;
                default:
                    filterDen = "[data-den=" + den + "]";
                    break;
            }
            switch (bathrooms) {
                case '0':
                    break;
                case 0:
                    break;
                default:
                    filterBath = "[data-bath=" + bathrooms + "]";
                    break;
            }
        });
        filter = filterBath + filterBed + filterDen;
        $availability.find(".content .availability .units span").addClass("d-none");
        $availability.find(".content .availability .units span" + filter).removeClass("d-none");
        var hash = '/Availability';
        hash = '/Availability/' + bedrooms + '/' + bathrooms + '/' + den;
        if (history.pushState) {
            history.pushState(null, null, hash);
        }
        else {
            location.hash = hash;
        }
    }

    $availability.find(".sidebar .filter-options ul li a").click(function (e) {
        e.preventDefault();
        LoadAvailabilitySuites(this);
    });

    $availability.find('.content .availability .units').on('click', 'span', function () {
        var homePlanId = $(this).data('planid');
        var homeplan = avaialabilityHomePlans.find(k => k.id == homePlanId);
        var div = '<div class="card" data-planid="3" data-bed="1" data-bath="1" data-den="0">\
            <img src = "/Images/Floorplans/' + homeplan.id + '/' + homeplan.standardFloorplanURL + '" class="floorplan card-img-top" />\
                <div class="card-body">\
                    <h4 class="card-title">\
                        PLAN <span>' + homeplan.name + '</span>\
                    </h4>\
                    <p class="card-text">\
                        ' + homeplan.standardBedroom + ' BED' + (homeplan.standardDen ? " + DEN" : "") + ', ' + homeplan.standardBathroom + ' BATH <span class="vertical-line"></span> ' + homeplan.standardArea + ' SQFT\
                                            </p>\
                </div>\
                <div class="card-footer">\
                    <ul>\
                        <li>\
                            <a href="#consentPopup" class="" data-target="#consentPopup" data-toggle="modal" data-title="INQUIRE" data-form-type="contact-form-fields-1" data-next="btn-next-2" data-next-form="consent-form-two"  data-suite="Suite ' + homeplan.name + '" data-fields="suite"><span>INQUIRE</span></a>\
                        </li>\
                        <li><a target="_blank" href="/Images/Floorplans/' + homeplan.id + '/' + homeplan.standardFloorplanPDFURL + '">DOWNLOAD FLOORPLAN</a></li>\
                    </ul>\
                </div>\
                                    </div>';
        $availability.find('.content .card-deck').html(div);
    });

    $availability.find("#collapseSidebar").on('show.bs.collapse', function () {
        $availability.find(".sidebar").removeClass("show-filter-without-options");
    }).on('hide.bs.collapse', function () {
        $availability.find(".sidebar").addClass("show-filter-without-options");
    });

    /*$availability.find(".sidebar .filter-search").click(function () {
        if ($availability.find(".sidebar").hasClass("show-filter-without-options")) {
            $availability.find(".sidebar").removeClass("show-filter-without-options");
        } else $availability.find(".sidebar").addClass("show-filter-without-options");
    });*/
}


$('#top-header').onScreen({
    container: window,
    direction: 'vertical',
    doIn: function () {
        // Do something to the matched elements as they come in
        $("navbar").addClass('top-header');
        if ($("navbar").hasClass("about-us"))
            $("navbar").removeClass('about-us');
    },
    doOut: function () {
        // Do something to the matched elements as they get off scren
        $("navbar").removeClass('top-header');
        $("navbar").addClass('about-us');
    },
    tolerance: 350,
    throttle: 50,
    toggleClass: 'onScreen',
    lazyAttr: null,
    lazyPlaceholder: '',
    debug: false
});

$('#about-us').onScreen({
    container: window,
    direction: 'vertical',
    doIn: function () {
        // Do something to the matched elements as they come in
        if ($("navbar").hasClass("our-work")) {
            $("navbar").addClass('about-us');
            $("navbar").removeClass("our-work")
        }

        if (!$("navbar").hasClass("our-work")) {
            $("navbar").addClass('about-us');
        }

    },
    doOut: function () {
        // Do something to the matched elements as they get off scren
        $("navbar").removeClass('about-us');
    },
    tolerance: 0,
    throttle: 50,
    toggleClass: 'onScreen',
    lazyAttr: null,
    lazyPlaceholder: '',
    debug: false
});

$('#our-work').onScreen({
    container: window,
    direction: 'vertical',
    doIn: function () {
        // Do something to the matched elements as they come in
        if (!$("navbar").hasClass("about-us"))
            $("navbar").addClass('our-work');

        $("navbar").removeClass('our-services');
        $("navbar").removeClass('contact-us');
    },
    doOut: function () {
        // Do something to the matched elements as they get off scren
        $("navbar").removeClass('our-work');
    },
    tolerance: 0,
    throttle: 50,
    toggleClass: 'onScreen',
    lazyAttr: null,
    lazyPlaceholder: '',
    debug: false
});

$('#our-services').onScreen({
    container: window,
    direction: 'vertical',
    doIn: function () {
        // Do something to the matched elements as they come in
        $("navbar").addClass('our-services');
    },
    doOut: function () {
        // Do something to the matched elements as they get off scren
        $("navbar").removeClass('our-services');
    },
    tolerance: -$("navbar").find('#our-work').height() + 200,
    throttle: 50,
    toggleClass: 'onScreen',
    lazyAttr: null,
    lazyPlaceholder: '',
    debug: false
});

$('#contact-us').onScreen({
    container: window,
    direction: 'vertical',
    doIn: function () {
        // Do something to the matched elements as they come in
        if ($("navbar").length == 1)
            $("navbar").addClass('contact-us');
    },
    doOut: function () {
        // Do something to the matched elements as they get off scren
        $("navbar").removeClass('contact-us');
    },
    tolerance: 0,
    throttle: 50,
    toggleClass: 'onScreen',
    lazyAttr: null,
    lazyPlaceholder: '',
    debug: false
});

