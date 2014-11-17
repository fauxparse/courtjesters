(function() {
  var Filter, Product, ProductCard, _ref, _ref1, _ref2,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Filter = (function(_super) {
    __extends(Filter, _super);

    function Filter() {
      this._clearSelection = __bind(this._clearSelection, this);
      this._updateSummary = __bind(this._updateSummary, this);
      this._toggleOptions = __bind(this._toggleOptions, this);
      _ref = Filter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Filter.prototype.init = function() {
      this._optionsContainer = this.$(this.constructor.optionsContainerSelector);
      return this._list = this.$("ol");
    };

    Filter.selector = ".filter";

    Filter.optionsContainerSelector = "> div";

    Filter.hideOptionsClass = "hide-options";

    Filter.enhance = function(filters) {
      var _this = this;
      return $(this.selector).each(function(i, el) {
        return new _this({
          el: el
        }).enhance(filters[i]);
      });
    };

    Filter.prototype.enhance = function(data) {
      this._buildUI(data);
      return this._bindEvents();
    };

    Filter.prototype._buildUI = function(data) {
      var label, li, value, _i, _len, _ref1, _ref2;
      this._summaryElement = $("<label></label>").addClass("summary").attr("data-role", "summary").prependTo(this._optionsContainer);
      this._clearSelectionButton = $("<button></button>").html("<i class=\"fa fa-times\"></i>").attr("type", "button").insertAfter(this._summaryElement);
      this._optionsContainer.addClass(this.constructor.hideOptionsClass);
      _ref1 = data.values;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _ref2 = _ref1[_i], value = _ref2[0], label = _ref2[1];
        li = $("<li>");
        li.append($("<input>", {
          id: "" + data.id + "_" + value,
          type: "checkbox",
          name: data.id,
          value: value
        }));
        li.append($("<label>", {
          "for": "" + data.id + "_" + value,
          text: label
        }));
        li.appendTo(this._list);
      }
      return this._updateSummary();
    };

    Filter.prototype._bindEvents = function() {
      var _this = this;
      this._summaryElement.click(this._toggleOptions);
      this._clearSelectionButton.click(this._clearSelection);
      this._checkboxes().change(this._updateSummary);
      return $("body").click(function(e) {
        var inFilter;
        inFilter = $(e.target).closest(".options").length > 0;
        if (!inFilter) {
          return _this._allOptionsContainers().addClass(_this.constructor.hideOptionsClass);
        }
      });
    };

    Filter.prototype._toggleOptions = function() {
      this._allOptionsContainers().not(this._optionsContainer).addClass(this.constructor.hideOptionsClass);
      return this._optionsContainer.toggleClass(this.constructor.hideOptionsClass);
    };

    Filter.prototype._updateSummary = function() {
      var checked, summary;
      summary = "Show all";
      checked = this._checkboxes().filter(":checked");
      if (checked.length > 0) {
        summary = this._labelsFor(checked).join(", ");
      }
      this.el.find("button").toggle(!!checked.length);
      this._summaryElement.text(summary);
      return this.el.trigger("update");
    };

    Filter.prototype._clearSelection = function(e) {
      this._checkboxes().each(function() {
        return $(this).prop("checked", false);
      });
      this._updateSummary();
      return $(e.target).closest(".options").addClass(this.constructor.hideOptionsClass);
    };

    Filter.prototype._checkboxes = function() {
      return this.el.find(":checkbox");
    };

    Filter.prototype._labelsFor = function(inputs) {
      return inputs.map(function() {
        var id;
        id = $(this).attr("id");
        return $("label[for='" + id + "']").text();
      }).get();
    };

    Filter.prototype._allOptionsContainers = function() {
      return $(this.constructor.selector + " " + this.constructor.optionsContainerSelector);
    };

    return Filter;

  })(Spine.Controller);

  Product = (function(_super) {
    __extends(Product, _super);

    function Product() {
      _ref1 = Product.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Product.configure("Product", "name", "summary", "stats", "filters");

    Product.prototype.match = function(filters) {
      var key, matches, v, values;
      for (key in filters) {
        if (!__hasProp.call(filters, key)) continue;
        values = filters[key];
        if (this.filters[key]) {
          matches = (function() {
            var _i, _len, _ref2, _results;
            _ref2 = this.filters[key];
            _results = [];
            for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
              v = _ref2[_i];
              if (values.indexOf(v) > -1) {
                _results.push(v);
              }
            }
            return _results;
          }).call(this);
          if (!matches.length) {
            return false;
          }
        }
      }
      return true;
    };

    return Product;

  })(Spine.Model);

  ProductCard = (function(_super) {
    __extends(ProductCard, _super);

    function ProductCard() {
      _ref2 = ProductCard.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ProductCard.prototype.init = function() {
      this.el.addClass("product-wrapper");
      this.el.attr("id", this.product.id);
      return this.render($("<div>").addClass("product").appendTo(this.el));
    };

    ProductCard.prototype.render = function(el) {
      var icon, li, stat, stats, text, title, _i, _len, _ref3, _ref4, _results;
      $("<img>", {
        src: "../assets/img/products/" + this.product.id + ".jpg"
      }).appendTo(el).wrap("<div class=\"product-image\">");
      title = this.product.name.replace(/(\([^\)]*\))/, "<small>$1</small>");
      $("<div>", {
        "class": "product-header",
        html: title
      }).appendTo(el);
      $("<p>", {
        text: this.product.summary
      }).appendTo(el).wrap("<div class=\"product-summary\">");
      stats = $("<ul>").appendTo(el).wrap("<div class=\"product-stats\">");
      _ref3 = [["actors", "users"], ["time", "clock-o"], ["price", "dollar"]];
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        _ref4 = _ref3[_i], stat = _ref4[0], icon = _ref4[1];
        text = this.product.stats[stat];
        if ($.isArray(text)) {
          text = text.join("–");
        }
        li = $("<li>").appendTo(stats);
        li.append($("<i>", {
          "class": "fa fa-" + icon
        }));
        _results.push(li.append($("<span>", {
          text: text
        })));
      }
      return _results;
    };

    ProductCard.filter = function(filters) {
      if ($.isEmptyObject(filters)) {
        return $(".product-wrapper").show();
      } else {
        return $(".product-wrapper").each(function() {
          return $(this).toggle(Product.find(this.id).match(filters));
        });
      }
    };

    return ProductCard;

  })(Spine.Controller);

  $(function() {
    var _this = this;
    Product.on("refresh", function(products) {
      var container, product, _i, _len;
      container = $(".products");
      for (_i = 0, _len = products.length; _i < _len; _i++) {
        product = products[_i];
        new ProductCard({
          product: product
        }).appendTo(container);
      }
      return container.imagesLoaded(function() {
        return container.packery({
          itemSelector: ".product-wrapper"
        });
      });
    });
    $.getJSON("../products.json").done(function(data) {
      Product.refresh(data.products);
      return Filter.enhance(data.filters);
    }).fail(function() {
      return console.log.apply(console, arguments);
    });
    return $(".search-tools").on("update", function() {
      var filters;
      filters = {};
      $(".search-tools :checked").each(function() {
        var checkbox, _name;
        checkbox = $(this);
        return (filters[_name = checkbox.attr("name")] != null ? filters[_name = checkbox.attr("name")] : filters[_name] = []).push(checkbox.attr("value"));
      });
      ProductCard.filter(filters);
      return $(".products").packery();
    });
  });

}).call(this);
