class Filter extends Spine.Controller
  init: ->
    @_optionsContainer = @$(@constructor.optionsContainerSelector)
    @_list = @$("ol")

  @selector: ".filter"
  @optionsContainerSelector: "> div"
  @hideOptionsClass: "hide-options"

  @enhance: (filters) ->
    $(@selector).each (i, el) =>
      new this({ el }).enhance(filters[i])

  enhance: (data) ->
    @_buildUI data
    @_bindEvents()

  _buildUI: (data) ->
    @_summaryElement = $("<label></label>").addClass("summary").attr("data-role", "summary").prependTo(@_optionsContainer)
    @_clearSelectionButton = $("<button></button>").html("<i class=\"fa fa-times\"></i>").attr("type", "button").insertAfter(@_summaryElement)
    @_optionsContainer.addClass @constructor.hideOptionsClass
    for [value, label] in data.values
      li = $("<li>")
      li.append $("<input>", id: "#{data.id}_#{value}", type: "checkbox", name: data.id, value: value)
      li.append $("<label>", for: "#{data.id}_#{value}", text: label)
      li.appendTo @_list
    @_updateSummary()

  _bindEvents: ->
    @_summaryElement.click @_toggleOptions
    @_clearSelectionButton.click @_clearSelection
    @_checkboxes().change @_updateSummary

    $("body").click (e) =>
      inFilter = $(e.target).closest(".options").length > 0
      @_allOptionsContainers().addClass @constructor.hideOptionsClass unless inFilter

  _toggleOptions: =>
    @_allOptionsContainers().not(@_optionsContainer).addClass @constructor.hideOptionsClass
    @_optionsContainer.toggleClass @constructor.hideOptionsClass

  _updateSummary: =>
    summary = "Show all"
    checked = @_checkboxes().filter(":checked")
    summary = @_labelsFor(checked).join(", ")  if checked.length > 0
    @el.find("button").toggle !!checked.length
    @_summaryElement.text summary
    @el.trigger "update"

  _clearSelection: (e) =>
    @_checkboxes().each ->
      $(this).prop "checked", false
    @_updateSummary()
    $(e.target).closest(".options").addClass @constructor.hideOptionsClass

  _checkboxes: ->
    @el.find ":checkbox"

  _labelsFor: (inputs) ->
    inputs.map(->
      id = $(this).attr("id")
      $("label[for='" + id + "']").text()
    ).get()

  _allOptionsContainers: ->
    $ @constructor.selector + " " + @constructor.optionsContainerSelector

class Product extends Spine.Model
  @configure "Product", "name", "summary", "stats", "filters"

  match: (filters) ->
    for own key, values of filters
      if @filters[key]
        matches = (v for v in @filters[key] when values.indexOf(v) > -1)
        return false if !matches.length
    true

class ProductCard extends Spine.Controller
  init: ->
    @el.addClass "product-wrapper"
    @el.attr "id", @product.id
    @render $("<div>").addClass("product").appendTo(@el)

  render: (el) ->
    $("<img>", src: "../assets/img/products/#{@product.id}.jpg")
      .appendTo(el).wrap("<div class=\"product-image\">")
    title = @product.name.replace(/(\([^\)]*\))/, "<small>$1</small>")
    $("<div>", class: "product-header", html: title).appendTo(el)
    $("<p>", text: @product.summary).appendTo(el).wrap("<div class=\"product-summary\">")
    stats = $("<ul>").appendTo(el).wrap("<div class=\"product-stats\">")
    for [stat, icon] in [["actors", "users"], ["time", "clock-o"], ["price", "dollar"]]
      text = @product.stats[stat]
      text = text.join("–") if $.isArray(text)
      li = $("<li>").appendTo(stats)
      li.append $("<i>", class: "fa fa-#{icon}")
      li.append $("<span>", text: text)

  @filter: (filters) ->
    if $.isEmptyObject(filters)
      $(".product-wrapper").show()
    else
      $(".product-wrapper").each ->
        $(this).toggle Product.find(this.id).match(filters)

$ ->
  Product.on "refresh", (products) ->
    container = $(".products")
    for product in products
      new ProductCard({ product }).appendTo container

    container.imagesLoaded ->
      container.packery
        itemSelector: ".product-wrapper"

  $.getJSON("../products.json")
    .done (data) =>
      Product.refresh data.products
      Filter.enhance data.filters
    .fail ->
      console.log arguments...

  $(".search-tools").on "update", ->
    filters = {}
    $(".search-tools :checked").each ->
      checkbox = $(this)
      (filters[checkbox.attr("name")] ?= []).push checkbox.attr("value")
    ProductCard.filter filters
    $(".products").packery()
