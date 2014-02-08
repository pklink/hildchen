$(function() {

    // upload
    $("#dropzone").dropzone({
        url: '/upload',
        acceptedFiles: '.jpg,.jpeg,.gif,.png,image/*',
        previewsContainer: '.preview',
        previewTemplate:
                '<div class="small item visible content">' +
                    '<div class="ui active dimmer">' +
                        '<div class="content">' +
                            '<div class="center">' +
                                '<div class="ui loader"></div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="small image"><img data-dz-thumbnail />' +
                '</div>',
        success: function(file) {
            $(file.previewElement).find('.dimmer').dimmer('hide');
        }
    });

    // show upload modal
    $('#do-upload').click(function() {
        $('#modal-upload').modal('show');
    });

});