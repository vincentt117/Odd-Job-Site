! function (t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], t) : t(window.jQuery || window.Zepto)
}(function (t) {
    "use strict";

    function i(i, s) {
        if (this.el = t(i), this.options = s || {}, this.options.start = this.options.start || this.el.data("crossfade-start"), this.options.end = this.options.end || this.el.data("crossfade-end"), !this.options.start || !this.options.end) throw new Error("crossfade.js requires two images.");
        var e = this.options.backgroundPosition.split(" ");
        this.options.backgroundPositionX = e[0], this.options.backgroundPositionY = e[1], this.width = this.el.width(), this.height = this.el.height(), this.canvas = t("<canvas>").css({
            position: "absolute"
            , top: "0"
            , left: "0"
            , width: this.width
            , height: this.height
        }), this.canvas.appendTo(this.el), this.paintbrush = this.canvas[0].getContext("2d");
        var o = t.proxy(this.onScroll, this)
            , h = t.proxy(this.onResize, this);
        this.preload(function () {
            t(window).on("scroll", o).trigger("scroll"), t(window).on("resize", h).trigger("resize")
        })
    }
    i.prototype.preload = function (i) {
        var s, e, o;
        this.start = t("<img>").attr({
            src: this.options.start
        }), this.end = t("<img>").attr({
            src: this.options.end
        }), s = [this.start, this.end], e = s.length, o = function () {
            e--, 0 === e && "function" == typeof i && i()
        };
        for (var h = 0; h < s.length; h++) s[h].on("load", o), s[h].prop("complete") && s[h].trigger("load")
    }, i.prototype.resize = function () {
        this.needsResize = !1, this.canvas[0].width = this.width, this.canvas[0].height = this.height, this.canvas.css({
            width: this.width
            , height: this.height
        })
    }, i.prototype.draw = function () {
        var t;
        this.needsResize && this.resize(), t = this.getDrawDimensions(this.start[0].width, this.start[0].height, this.width, this.height), this.paintbrush.drawImage(this.start[0], t.offset.x, t.offset.y, t.width, t.height), this.paintbrush.globalAlpha = this.visibility, this.paintbrush.drawImage(this.end[0], t.offset.x, t.offset.y, t.width, t.height), this.paintbrush.globalAlpha = 1, this.ticking = !1
    }, i.prototype.getDrawDimensions = function (t, i, s, e) {
        var o = {}
            , h = i / t
            , n = e / s;
        switch (n > h ? (o.width = parseInt(e / h), o.height = parseInt(e)) : (o.width = parseInt(s), o.height = parseInt(s * h)), o.offset = {}, this.options.backgroundPositionY) {
        case "top":
            o.offset.y = 0;
            break;
        case "bottom":
            o.offset.y = -1 * (o.height - e);
            break;
        case "center":
        default:
            o.offset.y = (o.height - e) / -2
        }
        switch (this.options.backgroundPositionX) {
        case "left":
            o.offset.x = 0;
            break;
        case "right":
            o.offset.x = -1 * (o.width - s);
            break;
        case "center":
        default:
            o.offset.x = (o.width - s) / -2
        }
        return o
    }, i.prototype.onScroll = function () {
        var i, s = t(window).scrollTop()
            , e = this.el.offset().top
            , o = this.el.height();
        i = e > s ? 0 : s > e + o ? 1 : (s - e) / (o * this.options.threshold), this.visibility = i, this.requestTick()
    }, i.prototype.onResize = function () {
        this.needsResize = !0, this.width = this.el.width(), this.height = this.el.height(), this.requestTick()
    }, i.prototype.requestTick = function () {
        var t = this;
        this.ticking || window.requestAnimFrame(function () {
            t.draw()
        }), this.ticking = !0
    }, t.extend(t.fn, {
        crossfade: function (s) {
            var e = t.extend({}, t.fn.crossfade.defaults, s);
            return this.each(function () {
                return t(this).data("crossfade", new i(this, e)), this
            })
        }
    }), t.fn.crossfade.defaults = {
        backgroundPosition: "center center"
        , threshold: .5
    }, window.requestAnimFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (t) {
            window.setTimeout(t, 1e3 / 60)
        }
    }()
});