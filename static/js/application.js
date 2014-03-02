var GalleryModel = can.Model.extend({
    findAll: 'GET /galleries',
    findOne: 'GET /galleries/{id}',
    create:  'POST /galleries',
    update:  'PUT /galleries/{id}',
    destroy: 'DELETE /galleries/{id}'
}, {});


var Galleries = can.Control({

    init: function(el, options) {
        var self = this;

        GalleryModel.findAll({}, function(models) {
            self.element.html(can.view('gallery-list', { models: models }));
        });
    },

    // redirect to create
    '.create.gallery click': function() {
        window.location.hash = '!galleries/create';
    },

    '.show.gallery click': function(el) {
        var model  = el.data('model');
        window.location.hash = '!galleries/' + data.attr('id');
    }

});

var Gallery = can.Control({

        default: {
            id: null
        }

    }, {

    init: function(el, options) {
        var self = this;

        GalleryModel.findOne({id: this.options.id}, function(model) {
            self.element.html(can.view('gallery', model));
        });
    },

    // redirect to create
    '.create.gallery click': function() {
        window.location.hash = '!galleries/create';
    },

    '.show.gallery click': function(el) {
        var model  = el.data('model');
        window.location.hash = '!galleries/' + data.attr('id');
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
            onApprove: function(a, b, c) {
                self.save();
                return false;
            },
            onDeny: function() {
                self.cancel();
            },
            onHide: function() {

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
        var buttons    = this.modal.find('.button');

        // disable buttons
        buttons.addClass('disabled');

        // create gallery
        var gallery = new GalleryModel({
            title:      title.val(),
            visibility: visibility.val()
        });

        // save gallery
        gallery.save().
            done(function(model) {
                window.location.hash = '!galleries/' + model.attr('id');
                self.modal.modal('hide');
            })
            .fail(function() {
                buttons.removeClass('disabled');
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

        ' route': function() {
            window.location.hash = '!galleries'
        },

        // show galleries
        'galleries route': function() {
            this.showGalleries();
        },

        // show create modal for galleries
        'galleries/create route': function() {
            this.showGalleries();
            this.showGalleryModal();
        },

        'galleries/:id route': function(data) {
            new Gallery(this.options.contentSelector, {id: data.id});
        }

    })();

});
