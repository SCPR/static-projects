
EventTracking = (function() {

  EventTracking.prototype.chooser = ".track-event";

  function EventTracking() {
    var link, _i, _len, _ref;
    _ref = $(this.chooser);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      link = _ref[_i];
      new EventTrackingLink($(link));
    }
  }

  return EventTracking;

})();

EventTrackingLink = (function() {

  EventTrackingLink.prototype.attributes = {
    category: "data-ga-category",
    action: "data-ga-action",
    label: "data-ga-label",
    nonInteraction: "data-non-interaction"
  };

  EventTrackingLink.prototype.defaults = {
    nonInteraction: 1
  };

  function EventTrackingLink(el) {
    var _this = this;
    this.el = el;
    this.category = this.el.attr(this.attributes.category);
    this.action = this.el.attr(this.attributes.action);
    this.label = this.el.attr(this.attributes.label);
    this.nonInteraction = this.el.attr(this.attributes.nonInteraction) || this.defaults.nonInteraction;
    this.el.on({
      click: function() {
        return _this._gapush();
      }
    });
  }

  EventTrackingLink.prototype._gapush = function() {
    return _gaq.push(["_trackEvent", this.category, this.action, this.label, this.nonInteraction]);
  };

  return EventTrackingLink;

})();
