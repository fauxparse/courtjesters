(function() {
  var markMissingImage;

  markMissingImage = function() {
    return $(this).closest("figure").addClass("missing-image");
  };

  $(function() {
    return $.getJSON("../jesters.json").done(function(jesters) {
      var article, container, id, jester, label, text, _i, _len, _results;
      container = $(".portraits");
      _results = [];
      for (_i = 0, _len = jesters.length; _i < _len; _i++) {
        jester = jesters[_i];
        id = "jester-" + jester.id;
        article = $("<article>", {
          id: jester.id,
          "data-title": jester.title
        });
        label = $("<label>", {
          "for": id
        }).appendTo(article);
        label.append($("<img>", {
          src: "../assets/img/jesters/" + jester.id + ".jpg"
        }));
        text = $("<div>", {
          "class": "text"
        }).appendTo(label);
        text.append($("<h3>", {
          text: jester.name
        }));
        text.append($("<h4>", {
          html: jester.tag || "&nbsp;"
        }));
        if (jester.title) {
          text.append($("<h5>", {
            html: jester.title
          }));
        }
        _results.push(article.appendTo(container));
      }
      return _results;
    });
  });

}).call(this);
