$ ->
  container = $("#past .shows")

  container.imagesLoaded ->
    container.append $("<div>", class: "gutter")
    container.packery
      itemSelector: "article"
      gutter: ".gutter"
