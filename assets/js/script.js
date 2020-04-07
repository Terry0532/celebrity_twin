var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://nameface.p.rapidapi.com/recognize",
    "method": "POST",
    "headers": {
        "x-rapidapi-host": "nameface.p.rapidapi.com",
        "x-rapidapi-key": "efb61b9c88msh61f702c8cf22df2p177bebjsn84ac4de233ec",
        "content-type": "application/json",
        "accept": "application/json"
    },
    "processData": false,
    "data": "{  \"images\": [    \"https://cdn.vox-cdn.com/thumbor/DD8bzlNVAfCggIXvTTvIiG7m2Xw=/0x0:1200x800/1200x800/filters:focal(396x247:588x439)/cdn.vox-cdn.com/uploads/chorus_image/image/65111486/pewds.0.jpg\",\"https://i.ibb.co/2j8cKjV/headshot-alex1.jpg\"]}"
}

$.ajax(settings).done(function (response) {
    console.log(response);
});