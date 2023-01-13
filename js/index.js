onload = function () {
    var parent = document.getElementById('fadein');
    var frag = document.createDocumentFragment();
    if (parent !== null) {
        while (parent.children.length) {
            frag.appendChild(
                parent.children[
                    Math.floor(Math.random() * parent.children.length)
                ]
            );
        }
        parent.appendChild(frag);
    }
};

$(window).on('load', function () {
    timeNow();
    setInterval(timeNow, 100);

    onload();
    $(window)
        .scroll(function () {
            var windowBottom = $(this).scrollTop() + $(this).innerHeight();
            $('.image-line').each(function () {
                /* Check the location of each desired element */
                var objectBottom = $(this).offset().top + $(this).outerHeight();

                /* If the element is completely within bounds of the window, fade it in */
                if (objectBottom < windowBottom + 400) {
                    //object comes into view (scrolling down)
                    if ($(this).css('opacity') == 0) {
                        $(this).fadeTo(500, 1);
                    }
                } else {
                    //object goes out of view (scrolling up)
                    if ($(this).css('opacity') == 1) {
                        $(this).fadeTo(500, 0);
                    }
                }
            });
        })
        .scroll(); //invoke scroll-handler on page-load

    setInterval(timeNow, 100);
});

var time, h, m, s;

function timeNow() {
    time = new Date();
    const zeroPad = (num, places) => String(num).padStart(places, '0');

    h = zeroPad(time.getHours(), 2);
    m = zeroPad(time.getMinutes(), 2);
    s = zeroPad(time.getSeconds(), 2);
    document.getElementById('time').innerHTML = h + ':' + m + ':' + s;
}
