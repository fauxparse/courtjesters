markMissingImage = ->
  $(this).closest("figure").addClass("missing-image")

$ ->
  $.getJSON("../jesters.json").done (jesters) ->
    container = $(".portraits")

    for jester in jesters
      id = "jester-#{jester.id}"
      article = $("<article>", id: jester.id, "data-title": jester.title)
      label = $("<label>", for: id).appendTo article
      label.append $("<img>", src: "../assets/img/jesters/#{jester.id}.jpg")
      text = $("<div>", class: "text").appendTo label
      text.append $("<h3>", text: jester.name)
      text.append $("<h4>", html: jester.tag or "&nbsp;")
      if jester.title
        text.append $("<h5>", html: jester.title)
      # article.append $("<input>", type: "checkbox", class: "modal-state", id: id, autocomplete: "off")
      # modal = $("<div>", class: "modal").appendTo(article).wrap("<div class=\"modal-background\">")
      # modal.append $("<label>", class: "modal-close", for: id).append($("<i>", class: "fa fa-times"))
      # modal.append $("<h2>", text: jester.name)
      # content = $("<div>", class: "modal-content").appendTo modal
      # content.append $("<figure>").append($("<img>", src: "/assets/img/jesters/#{jester.id}-full.jpg", on: { error: markMissingImage }))
      # content.append $("<article>", class: "missing-text", text: "Tousled Godard fanny pack, plaid disrupt organic American Apparel sustainable Intelligentsia try-hard whatever fixie actually scenester literally. Selvage hoodie letterpress synth squid pug, mlkshk normcore slow-carb Tonx raw denim put a bird on it Neutra chia butcher. Leggings narwhal meggings, Wes Anderson raw denim viral normcore. XOXO literally direct trade freegan. Kogi you probably haven't heard of them cornhole irony Cosby sweater. Asymmetrical artisan bespoke chillwave bicycle rights fanny pack. Ethical pug ugh tattooed, messenger bag shabby chic pork belly VHS fashion axe fanny pack Etsy.")
      article.appendTo container
