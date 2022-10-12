var settings = {
  url: "http://api.weatherbit.io/v2.0/forecast/daily?lang=ru&city=Moscow&key=0761688171444e0aa5e120002f7a470d",
  method: "GET",
  timeout: 0,
};

$.ajax(settings).done(function (response, xhr) {
  console.log("Return Code: " + xhr);
  var content = response.data;
  $.each(content, function (i) {
    $("table").append(
      "<tr><td>" +
        content[i].valid_date +
        "</td><td>" +
        content[i].max_temp +
        "</td><td>" +
        content[i].min_temp +
        "</td><td>" +
        content[i].pres +
        "</td><td>" +
        content[i].wind_spd +
        "</td></tr>"
    );
  });
});
