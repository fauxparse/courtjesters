(function() {
  $(function() {
    var container;
    container = $("#past .shows");
    return container.imagesLoaded(function() {
      container.append($("<div>", {
        "class": "gutter"
      }));
      return container.packery({
        itemSelector: "article",
        gutter: ".gutter"
      });
    });
  });

}).call(this);
