var website = "Ascent Canmore";
var domain = window.location.protocol + "//" + window.location.hostname + (window.location.port.length > 0 ? ":" + window.location.port : "");
var note = "", consent = "", contactForm = "", page = "", source = "", sourceUrl = "", subject = "";

var latitude = "", longitude = "";

function getLocation() {
    if (navigator.geolocation) {
        var positionOptions = {
            timeout: Infinity,
            maximumAge: 0,
            enableHighAccuracy: true
        }
        navigator.geolocation.getCurrentPosition(showPosition, catchError, positionOptions);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function catchError(positionError) {
    switch (positionError.code) {
        case positionError.TIMEOUT:
            console.log("The request to get user location has aborted as it has taken too long.");
            break;
        case positionError.POSITION_UNAVAILABLE:
            console.log("Location information is not available.");
            break;
        case positionError.PERMISSION_DENIED:
            console.log("Permission to share location information has been denied!");
            break;
        default:
            console.log("An unknown error occurred.");
    }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}

getLocation();


$(document).ready(function () {
    page = document.location.pathname;
    ContactForm();
});


function UpdateModalTitle(modalId, title) {
    $("#" + modalId).find(".modal-header").find("h4").html(title);
}

function UpdateModalStep(modalId, stepName) {

    //Steps can be: 
    // 1) stepName = fill-mandatory-fields                  Detail: Contact form fill manadatory fields like name, email etc 
    // 2) stepName = consent-form-one                       Detail: first consent form 
    // 3) stepName = consent-form-two                       Detail: second consent form 
    // 4) stepName = thank-you-with-additional-fields       Detail: show thank you message with additional fields 
    // 5) stepName = thank-you-msg-only                     Detail: show thank you message only

    $("#" + modalId).attr("data-step", stepName);
}

function ResetVars() {
    note = "";
    consent = "";
    page = "";
    source = "";
    sourceUrl = "";
    subject = "";
    $('#consentPopup').find("input[type=hidden]").val("");
}

function ContactForm() {
    $('#consentPopup').on("hidden.bs.modal", function (e) {
    });

    $('#ModalProjectDetails').on("hidden.bs.modal", function (e) {
        $("body").removeClass("modal-open-1");
    });
    $('#ModalProjectDetails').on("show.bs.modal", function (e) {
        $("body").addClass("modal-open-1");
    });

    $('#consentPopup').on('show.bs.modal', function (event) {
        ResetVars();

        var form_type = $(event.relatedTarget).data("form-type");
        var title = $(event.relatedTarget).data("title");
        var button = $(event.relatedTarget).data("next");
        var next_form = $(event.relatedTarget).data("next-form");

        if ($(event.relatedTarget).attr("data-source") != null) {
            source = $(event.relatedTarget).attr("data-source");
        }

        if ($(event.relatedTarget).attr("data-subject") != null) {
            subject = $(event.relatedTarget).attr("data-subject");
        }

        var hidden_fields = $(event.relatedTarget).data();
        var $consent = $(this);

        if (hidden_fields != undefined && hidden_fields["fields"] != undefined) {

            var exclude_fields = hidden_fields["fields"].toString().toLowerCase().split(",");
            $.each(hidden_fields, function (k, v) {
                if (k != "fields" && $.inArray(k, exclude_fields) != -1) {
                    if ($consent.find(".modal-body").find("input[name=" + k + "]").val() != undefined) {
                        $consent.find(".modal-body").find("input[name=" + k + "]").val(v)
                    } else {
                        $consent.find(".modal-body").append("<input type=\"hidden\" name=\"" + k + "\" value=\"" + v + "\" />");
                    }
                }
            });
        }

        if ($(event.relatedTarget).attr("data-source") != null) {
            source = $(event.relatedTarget).attr("data-source");
        } else if ($consent.find(".modal-body input[name=source]").length > 0) {
            source = $consent.find(".modal-body input[name=source]").data("value");
        }

        if ($(event.relatedTarget).attr("data-subject") != null) {
            subject = $(event.relatedTarget).attr("data-subject");
        } else if ($consent.find(".modal-body input[name=subject]").length > 0) {
            subject = $consent.find(".modal-body input[name=subject]").data("value");
        }

        $("#consentPopup").find("div[data-header-type='title']").css("display", "block");
        $("#consentPopup").find("div[data-header-type='thank-you']").css("display", "none");

        $.each($("#consentPopup").find(".row.form-type"), function () {
            if ($(this).css("display") == "block" && $(this).data("form-type") == "contact-form-fields-1") {
                $("#consentPopup").find("[data-form-type='contact-form-fields-2']").css("display", "none");
                $("#consentPopup").find("[data-form-type='consent-form-one']").css("display", "none");
                $("#consentPopup").find("[data-form-type='consent-form-two']").css("display", "none");
            }
        });

        if (form_type != null) {
            $("#consentPopup").find("[data-form-type='contact-form-fields-1']").css("display", "none");
            $("#consentPopup").find("[data-form-type='contact-form-fields-2']").css("display", "none");
            $("#consentPopup").find("[data-form-type='consent-form-one']").css("display", "none");
            $("#consentPopup").find("[data-form-type='consent-form-two']").css("display", "none");
            $("#consentPopup").find("[data-form-type='" + form_type + "']").css("display", "block");
        }

        if (title != null) {
            UpdateModalTitle("consentPopup", title);
        }

        if (button != null) {
            $(this).find(".modal-body .btn-next-1").off();
            $(this).find(".modal-body .btn-next-1").addClass(button).removeClass("btn-next-1").text("Send");
            if (next_form != null) {
                $(this).find(".modal-body ." + button).attr("data-next-form", next_form);
            }
            $(this).find(".modal-body ." + button).off();
            $(this).find(".modal-body ." + button).on("click", contact_form_fields_2);
        }

        UpdateModalStep("consentPopup", "consent-form-one");

        $(".btn-no, .btn-yes, .btn-submit").attr("disabled", false);
    });

    var contact_form_fields_1 = function () {

        contactForm = $(this).closest(".contact-form");

        var result = ValidateData(contactForm);

        if (Boolean(result)) {

            // Phone Data
            postalCode = $(this).closest(".contact-form").find(".postalcode").val();

            //note = "Source - Popup:  " + $("#consentPopup").find("div[data-header-type='title']").find(".modal-title").text();

            //Update Modal Title
            UpdateModalTitle("consentPopup", "Contact Us");

            // Show Consent Form
            $("#consentPopup").find("div[data-form-type='contact-form-fields-1']").toggle();
            $("#consentPopup").find("div[data-form-type='contact-form-fields-2']").toggle();

        }
    };

    $("#consentPopup .btn-next-1").on('click', function () {
        ResetVars();
        contact_form_fields_1();
    });


    var contact_form_fields_2 = function () {

        contactForm = $(this).closest(".contact-form");
        var next_form = $(this).data("net-form");

        var result = ValidateData(contactForm);

        if (Boolean(result)) {

            //Update Modal Title
            UpdateModalTitle("consentPopup", "Would you like to sign up to receive more information about " + website + "?");

            // Show Consent Form
            $("#consentPopup").find("div[data-form-type='contact-form-fields-1']").css("display", "none");
            $("#consentPopup").find("div[data-form-type='contact-form-fields-2']").css("display", "none");
            $("#consentPopup").find("div[data-form-type='consent-form-one']").css("display", "none");
            $("#consentPopup").find("div[data-form-type='consent-form-two']").css("display", "none");
            if (next_form != null) {
                $("#consentPopup").find("div[data-form-type='" + next_form + "']").toggle();
            } else
                $("#consentPopup").find("div[data-form-type='consent-form-one']").toggle();
        }
    };

    $("#consentPopup .btn-next-2").on('click', function () {
        ResetVars();
        contact_form_fields_2();
    });

    $(".contact-form[data-form-type='contact'] .btn-submit, .contact-form[data-form-type='contact-form-fields-1'] .btn-submit, .contact-form[data-form-type='segment'] .btn-submit").on('click', function () {
        ResetVars();

        contactForm = $(this).closest(".contact-form");

        var form_type = $(this).data("form-type");
        var title = $(this).data("title");

        source = $(contactForm).find("input[name=source]").val();
        if (source != undefined && source.length > 0) {
            $('#consentPopup').find(".modal-body").append("<input type=\"hidden\" name=\"source\" data-value=\"" + source + "\" />");
        }

        subject = $(contactForm).find("input[name=subject]").val();
        if (subject != undefined && subject.length > 0)
            $('#consentPopup').find(".modal-body").append("<input type=\"hidden\" name=\"subject\" data-value=\"" + subject + "\" />");

        var result = ValidateData(contactForm);

        if (Boolean(result)) {
            if ($(contactForm).find("input[name=\"Questions[84800][]\"]") != undefined && $(contactForm).find("input[name=\"Questions[84800][]\"]").length > 0 && $(contactForm).find("input[name=\"Questions[84800][]\"]").prop("checked")) {
                consent = "true";
                $(this).attr("disabled", "disabled");
                $(this).html("<img src='" + domain + "/Images/Icons/load.gif' alt='submitting...' />");
                SubmitContactForm();
                return false;
            }

            // Show Consent Form
            $("#consentPopup").find("div[data-header-type='title']").css("display", "block");
            $("#consentPopup .modal-body").find("div[data-form-type='contact-form-fields-1']").css("display", "none");
            $("#consentPopup .modal-body").find("div[data-form-type='contact-form-fields-2']").css("display", "none");
            $("#consentPopup .modal-body").find("div[data-form-type='consent-form-one']").css("display", "none");
            $("#consentPopup .modal-body").find("div[data-form-type='consent-form-two']").css("display", "none");
            $("#consentPopup").find("div[data-header-type='thank-you']").css("display", "none");

            if (form_type != null) {
                $("#consentPopup .modal-body").find("div[data-form-type='" + form_type + "']").css("display", "block");
            }

            if (title != null) {
                UpdateModalTitle("consentPopup", title);
            } else {
                UpdateModalTitle("consentPopup", "Would you like to sign up to receive more information about " + website + "?");
            }

            $("#consentPopup").modal('show');
        }

    });

    $("#consentPopup div[data-form-type='consent-form-one'] .btn-yes, #consentPopup div[data-form-type='consent-form-two'] .btn-yes").on('click', function () {
        consent = "true";

        $(".btn-no").attr("disabled", "disabled");

        //Submit Request without additional fields        
        $(this).attr("disabled", "disabled");
        $(this).html("<img src='" + domain + "/Images/Icons/load.gif' alt='submitting...' />");
        SubmitContactForm();

    });

    //Consent Form One
    $("#consentPopup div[data-form-type='consent-form-one'] .btn-no").on('click', function () {
        consent = "false";

        //Update Modal Step
        UpdateModalStep("consentPopup", "consent-form-two");

        //Update Modal Title
        UpdateModalTitle("consentPopup", "Are you sure? You did just ask us information.");

        // Show Thank You Form
        $(this).closest("div[data-form-type]").toggle();
        $("#consentPopup").find("div[data-form-type='consent-form-two']").toggle();
    });

    //Consent Form Two
    $("#consentPopup div[data-form-type='consent-form-two'] .btn-no").on('click', function () {

        consent = "false";
        $(".btn-yes").attr("disabled", "disabled");
        $(this).attr("disabled", "disabled");
        $(this).html("<img src='" + domain + "/Images/Icons/load.gif' alt='submitting...' />");
        SubmitContactForm();
    });

    function SubmitContactForm() {

        if (consent === "true") {
            $(contactForm).closest("form").find("input[name=\"Questions[84800][]\"]").prop("checked", true);
        }
        else {
            $(contactForm).closest("form").find("input[name=\"Questions[84800][]\"]").prop("checked", false);
        }

        var lasso_fields = "";
        $.each($(contactForm).find("input[type='text'], input[type='hidden'], input[type='radio'], input[type='checkbox'], input[type='tel'], select, textarea"), function (k, obj) {
            if ($(obj).data("ql-field") !== undefined) {
                eval("" + $(obj).data("ql-field") + "='" + $(obj).val() + "';");
            } else {
                if ($(obj).attr("type") == "radio" || $(obj).attr("type") == "checkbox") {
                    if ($(obj).prop("checked")) {
                        lasso_fields += $(obj).val() + " " + $(obj).prop("checked") + " | ";
                    }
                } else
                    if ($(obj).prop("tagName").toLowerCase() == "select") {
                        lasso_fields += $(obj).attr("name") + " " + $(obj).val() + " | ";
                    } else
                        if (($(obj).val() != undefined && $(obj).val().length > 0)) {
                            lasso_fields += $(obj).attr("name") + " " + ($(obj).attr("type") == "text" || $(obj).attr("type") == "hidden" || $(obj).attr("type") == "textarea" ? $(obj).val() : $(obj).prop("checked")) + " |<br /> ";
                        }
            }
        });

        var Questions = {};

        $.each($(contactForm).find("input[name^='Questions'], select[name^='Questions']"), function (k, obj) {
            if ($(obj).attr("type") !== undefined && $(obj).attr("type").toLowerCase() == "checkbox" && $(obj).prop("checked")) {
                if (Questions[$(obj).data("question-id")] === undefined) {
                    Questions[$(obj).data("question-id")] = new Array();
                }
                Questions[$(obj).data("question-id")].push($(obj).val());
            }
            if ($(obj).prop("tagName") !== undefined && $(obj).prop("tagName").toLowerCase() == "select" && $(obj).val()) {
                if (Questions[$(obj).data("question-id")] === undefined) {
                    Questions[$(obj).data("question-id")] = new Array();
                }
                Questions[$(obj).data("question-id")].push($(obj).val());
            }
        });

        page = document.location.pathname;
        note = "Page: " + page;
        if (comments != "") {
            note += " | " + comments;
        }

        if (comments != "") {
            note += " | " + lasso_fields;
        }

        try {

            sourceUrl = window.location.href;
            var fields = [];

            $(contactForm).find("input:not([type=\"checkbox\"]),textarea,select").each(function (k, v) {
                var $field = $(v);
                var name = $field.attr("name");
                fields[name] = $field.val();
            });

            $(contactForm).find("input[type=checkbox]").each(function (k, v) {
                var $field = $(v);
                var name = $field.attr("name");
                if ($field.prop("checked"))
                    fields[name] = $field.val();

            });

            grecaptcha.ready(function () {
                grecaptcha.execute('6Ldf__sbAAAAAKEc9X6Du1bs9QYZrCZN0CQdNTI5', { action: 'submit' }).then(function (token) {
                    var data = {
                        clientWebId: "10011307",
                        projectWebId: "10000148",
                        titleId: "1",
                        fname: fields["FirstName"],
                        lname: fields["LastName"],
                        email: fields["Emails[Primary]"],
                        postalcode: fields["PostalCode"],
                        phone: fields["Phones[Home]"],
                        //comments: fields["Comments"],
                        comments: note,
                        consent: consent.toString(),
                        isProduction: "true",
                        source: source,
                        sourceUrl: sourceUrl,
                        subject: subject,
                        latitude: latitude,
                        longitude: longitude,
                        g_recaptcha_response: token,
                        Questions: Questions
                    };

                    $.ajax({
                        type: "POST",
                        //url: "https://leads.leyteblair.com/AsyncQuickeleadsExpressWebservicev1.asmx/AddExpressDBLeadWithNewParameters",
                        url: '/WebService.asmx/SubmitLeadWithCaptchaValidation',
                        data: JSON.stringify({ myjson: `${JSON.stringify(data)}` }),
                        contentType: "application/json; charset=utf-8",
                        dataType: 'json',
                        success: function (rs) {
                            //console.log(rs);
                            //if ($(contactForm).find("input[name=builderid]").val() != undefined && $(contactForm).find("input[name=builderid]").val().length > 0) {
                            //    var obj = { builderId: $(contactForm).find("input[name=builderid]").val(), content: note };
                            //    //$.post("/WebService.asmx/SendEmail", obj, function (data) {
                            //    //});
                            //    $.ajax({
                            //        type: "POST",
                            //        url: "/WebService.asmx/SendEmail",
                            //        //data: obj,
                            //        data: JSON.stringify(obj),
                            //        contentType: "application/json; charset=utf-8",
                            //        dataType: 'json',
                            //        success: function (data) { console.log(data); },
                            //        error: function (data) { console.log(data); }
                            //    });
                            //}


                            $(contactForm).closest("form").find("input[type=text], input[type=checkbox],input[type=tel],textarea").val("").prop("checked", false);
                            var $btn = $(contactForm).closest("form").find(".contact-form").find("button, input[type=button]");
                            $btn.html($btn.attr("data-value"));
                            $(contactForm).closest(".contact-form").find("input[type=text], input[type=checkbox],input[type=tel],textarea").val("").prop("checked", false);
                            $(contactForm).closest(".contact-form").find("button, input[type=button]").each(function () {
                                if ($(this).attr("data-value") != undefined) {
                                    $(this).html($(this).attr("data-value"));
                                }
                                $(this).prop("disabled", false);
                            });
                            $("#consentPopup").find("button").each(function () {
                                if ($(this).attr("data-text") != undefined) {
                                    $(this).html($(this).attr("data-text"));
                                }
                            });
                            //// Show Thank You Form
                            $("#consentPopup").find("div.form-type").css("display", "none");
                            $("#consentPopup").find("div[data-header-type='title']").css("display", "none");
                            $("#consentPopup").find("div[data-header-type='thank-you']").css("display", "block");
                            setTimeout(function () { $("#consentPopup").modal("hide"); $("body").removeClass("modal-open"); }, 4000);
                            GoogleGoalConversion();
                            //$(contactForm).closest("form").find("input[type=hidden][name=lassoUID]").val("HQDYASDbd[tbg");
                            //$(contactForm).closest("form").find("input[type=hidden][name^=projectIds]").val("124SD61");                    
                            //$(contactForm).closest("form").submit();
                        },
                        error: function (rs) {
                            $("#consentPopup").modal("hide");
                            $("form .contact-form").find(".btn-submit").text(rs.statusText);
                        }
                    });
                });
            });

        } catch (exception) { }
    }
}


//Modal registration form
function ValidateData(formObject) {

    var required = false;
    var isFormValid = true;

    var $form = $(formObject);

    var $form_required_fields = $form.find("[required=\"required\"],textarea[required=\"required\"]");

    $form_required_fields.each(function (k, v) {
        var $field = $(v);
        var type = $field.attr("type") !== undefined ? $field.attr("type").toLowerCase() : "";
        var tagname = $field.prop("tagName").toLowerCase();
        if (tagname == "textarea") {
            type = tagname;
        }

        if (tagname == "select") {
            type = tagname;
        }

        switch (type) {

            case "select":
                var value = $field.val();
                required = $field.attr("required");
                if (((value == null) || value.length == 0) && required == "required") {
                    $field.addClass("invalid");
                    $field.closest(".form-group").find("span").text(" * Required");
                    $field.focus();
                    isFormValid = false;
                    return false;
                }
                $field.removeClass("invalid");
                $field.closest(".form-group").find("span").text("");
                break;

            case "text":
            case "tel":
            case "textarea":
                var value = $field.val();
                required = $field.attr("required");

                if (((value == null) || (value.length == 0)) && required == "required") {
                    $field.addClass("invalid");
                    $field.closest(".form-group").find("span").text(" * Required");
                    $field.focus();
                    isFormValid = false;
                    return false;
                }
                $field.removeClass("invalid");
                $field.closest(".form-group").find("span").text("");
                break;
            case "email":
                var value = $field.val();
                required = $field.attr("required");

                if (required == "required") {
                    if ((value.length == 0) || (value == null)) {
                        $field.addClass("invalid");
                        $field.closest(".form-group").find("span").text(" * Required");
                        $field.focus();
                        isFormValid = false;
                        return false;
                    }
                    else if (value.length > 0) {
                        if (!IsValidEmail(value)) {
                            $field.closest(".form-group").find("span").text(" * Invalid email");
                            $field.addClass("invalid");
                            $field.focus();
                            isFormValid = false;
                            return false;
                        }
                    }
                }
                $field.removeClass("invalid");
                $field.closest(".form-group").find("span").text("");
                break;
        }

    });

    if (!isFormValid) {
        return false;
    }

    return true;
}

//Utils
function IsValidEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function GoogleGoalConversion() {
    try {
        //ga('send', 'event', 'Lead', 'Submitted');

        //new analytisc tag
        gtag('event', 'submission', {
            'event_category': 'Lead submitted'
        });
        fbq('track', 'Lead');
    } catch (exception) {

    }
}

function FireGoogleEventAndLoadPage(obj) {
    $(obj).prop("disabled", true);

    var linkType = $(obj).attr("data-link-type");
    var googleEvent = $(obj).attr("data-google-event-cta");

    if (googleEvent != undefined && googleEvent != null) {
        for (var i = 0; i < ga_events.length; i++) {
            var event = ga_events[i];
            if (parseInt(event.id) === parseInt(googleEvent)) {
                ga('send', 'event', event.category, event.action);
            }
        }
    }

    if (linkType != undefined && linkType === "popup") {

        if ($(obj).attr("data-title") != undefined) {
            $($(obj).attr("href")).find("div[data-header-type='title']").find(".modal-title").html($(obj).attr("data-title"));
        }

        $($(obj).attr("href")).modal('show');

    }
    else {
        setTimeout(function () {
            document.location.href = $(obj).attr("data-href");
        }, 1000);
    }
}