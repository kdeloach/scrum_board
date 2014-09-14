define(['bacon', './class', './layouts/flow',
        'tmpl!./templates/region', 'tmpl!./templates/hregion', 'tmpl!./templates/vregion'],
  function(Bacon, Class, FlowLayout,
           regionTmpl, hRegionTmpl, vRegionTmpl) {

    var getPercentFromTop = function(e) {
        var $el = $(e.toElement),
            parentHeight = $el.parent().height(),
            offsetTop = $el.position().top,
            p = offsetTop / parentHeight;
        p = Math.min(0.9, Math.max(0.1, p));
        return p;
    };
    
    var getPercentFromLeft = function(e) {
        var $el = $(e.toElement),
            parentWidth = $el.parent().width(),
            offsetLeft = $el.position().left,
            p = offsetLeft / parentWidth;
        p = Math.min(0.9, Math.max(0.1, p));
        return p;
    };

    var Region = Class.extend({
        defaults: {
            $el: null,
            parent: null,
            name: '',
            layout: null,
            splitStream: null
        },

        init: function(options) {
            this._super(options);
            this.cards = [];
            this.layout = this.layout || new FlowLayout();
        },
        
        children: function() {
            return null;
        },
        
        findRegion: function(regionId) {
            return this.getFullPath() == regionId ? this : null;
        },
        
        setPosition: function(x, y) {
            this.$el.css({
                top: Math.round(y * 100) + '%',
                left: Math.round(x * 100) + '%'
            });
        },

        setSize: function(w, h) {
            this.$el.css({
                width: Math.round(w * 100) + '%',
                height: Math.round(h * 100) + '%'
            });
        },

        getFullPath: function() {
            return this.parent ?
                this.parent.getFullPath() + '-' + this.name :
                this.name;
        },

        update: function() {
        },
        
        render: function() {
            if (!this.$el) {
                this.$el = $(regionTmpl({
                    cssId: this.getFullPath(),
                    name: this.name,
                }));
            }
            return this.$el;
        }
    });

    var HRegion = Region.extend({
        defaults: {
            $el: null,
            parent: null,
            name: '',
            topRegion: null,
            bottomRegion: null,
            topHeight: 0.5
        },
        
        children: function() {
            return [this.topRegion, this.bottomRegion];
        },

        findRegion: function(regionId) {
            return this.topRegion.findRegion(regionId) ||
                   this.bottomRegion.findRegion(regionId);
        },
        
        setTopRegion: function(region) {
            region.parent = this;
            this.topRegion = region;
        },

        setBottomRegion: function(region) {
            region.parent = this;
            this.bottomRegion = region;
        },

        update: function() {
            this.topRegion.setPosition(0, 0);
            this.topRegion.setSize(1, this.topHeight);
            this.bottomRegion.setPosition(0, this.topHeight);
            this.bottomRegion.setSize(1, 1 - this.topHeight);
            this.getSepEl().css({
                top: Math.round(this.topHeight * 100) + '%'
            });
            this.topRegion.update();
            this.bottomRegion.update();
        },

        getSepEl: function() {
            return this.$el.find('> .sep');
        },

        render: function() {
            var self = this;

            if (!this.$el) {
                this.$el = $(hRegionTmpl({
                    cssId: this.getFullPath(),
                    name: this.name,
                }));

                this.$el.prepend(
                    this.topRegion.render(),
                    this.bottomRegion.render()
                );

                this.update();

                this.getSepEl()
                    .draggable({
                        axis: 'y',
                        containment: 'parent',
                        helper: 'clone',
                        opacity: 0.35
                    })
                    .asEventStream('dragstop')
                    .map(getPercentFromTop)
                    .doAction(function(p) {
                        self.topHeight = p;
                    })
                    .onValue(_.bind(this.update, this));
            }
            return this.$el;
        }
    });

    var VRegion = Region.extend({
        defaults: {
            $el: null,
            parent: null,
            name: '',
            leftRegion: null,
            rightRegion: null,
            leftWidth: 0.5
        },
        
        children: function() {
            return [this.leftRegion, this.rightRegion];
        },
        
        findRegion: function(regionId) {
            return this.leftRegion.findRegion(regionId) ||
                   this.rightRegion.findRegion(regionId);
        },

        setLeftRegion: function(region) {
            region.parent = this;
            this.leftRegion = region;
        },

        setRightRegion: function(region) {
            region.parent = this;
            this.rightRegion = region;
        },

        update: function() {
            this.leftRegion.setPosition(0, 0);
            this.leftRegion.setSize(this.leftWidth, 1);
            this.rightRegion.setPosition(this.leftWidth, 0);
            this.rightRegion.setSize(1 - this.leftWidth, 1);
            this.getSepEl().css({
                left: Math.round(this.leftWidth * 100) + '%'
            });
        },

        getSepEl: function() {
            return this.$el.find('> .sep');
        },

        render: function() {
            var self = this;

            if (!this.$el) {
                this.$el = $(vRegionTmpl({
                    cssId: this.getFullPath(),
                    name: this.name,
                }));

                this.$el.prepend(
                    this.leftRegion.render(),
                    this.rightRegion.render()
                );

                this.update();

                this.getSepEl()
                    .draggable({
                        axis: 'x',
                        containment: 'parent',
                        helper: 'clone',
                        opacity: 0.35
                    })
                    .asEventStream('dragstop')
                    .map(getPercentFromLeft)
                    .doAction(function(p) {
                        self.leftWidth = p;
                    })
                    .onValue(_.bind(this.update, this));
            }
            return this.$el;
        }
    });

    return {
        Region: Region,
        HRegion: HRegion,
        VRegion: VRegion
    };
});