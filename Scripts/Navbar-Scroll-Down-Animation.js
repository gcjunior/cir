// Create the event
var event = new CustomEvent("window_onscroll", { bubbles: true, cancelable: false });

// Add an event listener
document.addEventListener("window_onscroll", function (e) {
    var navbarGetObjByTagName = document.getElementsByTagName("body")[0];
    var navbarClassName = navbarGetObjByTagName.dataset.scrollAnimation;
    var navbarHeight = navbarGetObjByTagName.dataset.navbarHeight;
    //var prevScrollpos = window.pageYOffset;
    window.onscroll = function () {
        var currentScrollPos = window.pageYOffset;
        //if (prevScrollpos > currentScrollPos)
        if (currentScrollPos < navbarHeight) {
            if (navbarGetObjByTagName.classList.contains(navbarClassName)) {
                navbarGetObjByTagName.classList.remove(navbarClassName);
            }
        } else {
            if (!navbarGetObjByTagName.classList.contains(navbarClassName)) {
                navbarGetObjByTagName.classList.add(navbarClassName);
            }
        }
        prevScrollpos = currentScrollPos;
    }

});
// Dispatch/Trigger/Fire the event
document.dispatchEvent(event);