var Gallery = can.Model.extend({
    findAll: 'GET /galleries',
    findOne: 'GET /galleries/{id}',
    create:  'POST /galleries',
    update:  'PUT /galleries/{id}',
    destroy: 'DELETE /galleries/{id}'
}, {});


var Galleries = can.Control({

    init: function(el, options) {
        var self = this;

        Gallery.findAll({}, function(models) {
            self.element.html(can.view('gallery-list', { models: models }));
        });
    },

    // remove model
    '.item a click': function(el) {
        var gallery = el.parent().data('model');

        gallery.destroy().fail(function() {
            alert('error');
        })
    },

    // redirect to create
    '.create.gallery click': function() {
        window.location.hash = '!galleries/create';
    }

});

var GalleryCreate = can.Control({

    modal: null,

    init: function(el, options) {
        var self = this;

        // append modal to dom
        this.element.append(can.view('gallery-create-modal'));
        this.modal = this.element.find('.modal');

        // init dropdown
        this.modal.find('.dropdown').dropdown();

        // configure and show modal
        this.element.find('.modal').modal({
            transition: 'vertical flip',
            closable:   false,
            onApprove: function() {
                self.save();
            },
            onDeny: function() {
                self.cancel();
            }
        }).modal('show');
    },

    cancel: function() {
        window.location.hash = '!galleries'
    },

    // save model
    save: function() {
        var self       = this;
        var form       = this.modal.find('form');
        var title      = form.find('[name=title]');
        var visibility = form.find('[name=visibility]');

        // create gallery
        var gallery = new Gallery({
            title:      title.val(),
            visibility: visibility.val()
        });

        // save gallery
        gallery.save().done(function(model) {
            window.location.hash = '!galleries';
        })
    }
});

$(function() {

    // run
    can.Control({
        defaults: {
            defaultRoute:    'galleries',
            contentSelector: '#content'
        }
    }, {
        init: function() {
            can.route.ready();
        },

        showGalleries: function() {
            new Galleries(this.options.contentSelector, {});
        },

        showGalleryModal: function() {
            new GalleryCreate(this.options.contentSelector, {});
        },

        // show galleries
        'galleries route': function() {
            this.showGalleries();
        },

        'galleries/create route': function() {
            this.showGalleries();
            this.showGalleryModal();
        },

        // redirect to default route
        'route': function() {
            //window.location.hash = '!' + this.options.defaultRoute;
        }
    })();

});
