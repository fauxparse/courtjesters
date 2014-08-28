(function() {
  var markMissingImage;

  markMissingImage = function() {
    console.log(this);
    return $(this).closest("figure").addClass("missing-image");
  };

  $(function() {
    return $.getJSON("/jesters.json").done(function(jesters) {
      var article, container, content, id, jester, label, modal, _i, _len, _results;
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
          src: "/assets/img/jesters/" + jester.id + ".jpg"
        }));
        label.append($("<h3>", {
          text: jester.name
        }));
        label.append($("<h4>", {
          html: jester.title || "&nbsp;"
        }));
        article.append($("<input>", {
          type: "checkbox",
          "class": "modal-state",
          id: id,
          autocomplete: "off"
        }));
        modal = $("<div>", {
          "class": "modal"
        }).appendTo(article).wrap("<div class=\"modal-background\">");
        modal.append($("<label>", {
          "class": "modal-close",
          "for": id
        }).append($("<i>", {
          "class": "fa fa-times"
        })));
        modal.append($("<h2>", {
          text: jester.name
        }));
        content = $("<div>", {
          "class": "modal-content"
        }).appendTo(modal);
        content.append($("<figure>").append($("<img>", {
          src: "/assets/img/jesters/" + jester.id + "-full.jpg",
          on: {
            error: markMissingImage
          }
        })));
        content.append($("<article>", {
          "class": "missing-text",
          text: "Tousled Godard fanny pack, plaid disrupt organic American Apparel sustainable Intelligentsia try-hard whatever fixie actually scenester literally. Selvage hoodie letterpress synth squid pug, mlkshk normcore slow-carb Tonx raw denim put a bird on it Neutra chia butcher. Leggings narwhal meggings, Wes Anderson raw denim viral normcore. XOXO literally direct trade freegan. Kogi you probably haven't heard of them cornhole irony Cosby sweater. Asymmetrical artisan bespoke chillwave bicycle rights fanny pack. Ethical pug ugh tattooed, messenger bag shabby chic pork belly VHS fashion axe fanny pack Etsy."
        }));
        _results.push(article.appendTo(container));
      }
      return _results;
    });
  });

}).call(this);
