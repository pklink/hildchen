var Gallery = can.Model.extend({
    findAll: 'GET /galleries',
    findOne: 'GET /galleries/{id}',
    create:  'POST /galleries',
    update:  'PUT /galleries/{id}',
    destroy: 'DELETE /galleries/{id}'
}, {});


var Galleries = can.Control({

    models: null,

    init: function(el, options) {
        var self = this;

        // init modals dropdown
        this.element.find('.modal .dropdown').dropdown();

        Gallery.findAll({}, function(models) {
            self.models = models;
            self.element.html(can.view('galleries', { models: models }));
        });
    },

    // remove model
    '.item a click': function(el) {
        var gallery = el.parent().data('model');

        gallery.destroy().fail(function() {
            alert('error');
        })
    },

    // show create modal
    '.create.gallery click': function() {
        var modal = this.element.find('.modal:first');

        modal.modal({
            detachable: false
        });

        modal.modal('show');
    },

    // save model
    '.modal .submit.button click': function() {
        var self       = this;
        var form       = self.element.find('form');
        var title      = form.find('[name=title]');
        var visibility = form.find('[name=visibility]');

        // create gallery
        var gallery = new Gallery({
            title:      title.val(),
            visibility: visibility.val()
        });

        // save gallery
        gallery.save().done(function(model) {
            // add model to Gallery.List
            self.models.push(model);

            // empty input field
            title.val('');
        })
    }

});

$(function() {
    new Galleries('#content', {});
});
