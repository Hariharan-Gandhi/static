$(window).on('load', () => {
    getPods()
    setInterval(getPods, 10 * 1000);
});

function getPods() {
    $.ajax('http://localhost:8002/health', {
        dataType: "json",
        method: "GET",
        success: function (resp) {
            myList = resp
            buildHtmlTable('#tableMain')
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status + ' ' + errorThrown + ' - ' + jqXHR.responseText)
        }
    })
}

function buildHtmlTable(selector) {
    var headerTr$ = $('<tr/>');
    for (k in myList) {
        headerTr$.append($('<th/>').html(k));
    }

    $('#tableHead').append(headerTr$);

    buildHtmlTableRest(selector)
}

function buildHtmlTableRest(selector) {
    const headerTr$ = $('<tr/>');
    for (let node in myList) {
        const $nsRow = $('<td></td>');
        for (let ns in myList[node]) {
            const $card = $('<div class="card mb-3"></div>');
            const $heading = $('<h5 class="card-header">Featured</h5>').text(ns);
            $heading.appendTo($card);

            const $cardBody = $('<div class="card-body"></div>');
            // const $heading = $('<h3 class="card-title"></h3>').text(ns);
            // $heading.appendTo($cardBody);
            $.each(myList[node][ns], function (i, pods) {
                const $pod = $('<span class="badge badge-pill pods"></span>')

                if (pods.startsWith("elastic-data")) {
                    $pod.addClass("badge-danger")
                } else if (pods.startsWith("elastic-master")) {
                    $pod.addClass("badge-info")
                } else if (pods.startsWith("curator")) {
                    return true;
                    $pod.addClass("badge-secondary")
                } else if (pods.startsWith("kibana")) {
                    $pod.addClass("badge-primary")
                } else if (pods.startsWith("fluentd")) {
                    $pod.addClass("badge-success")
                } else if (pods.startsWith("ingress-nginx")) {
                    $pod.addClass("badge-warning")
                } else {
                    $pod.addClass("badge-light")
                }

                $pod.text(pods).appendTo($cardBody)
            });
            $cardBody.appendTo($card);
            $card.appendTo($nsRow);
            headerTr$.append($nsRow);
        }
    }
    $(selector).append(headerTr$);
}
