$(function() {

    $('.dropdown').dropdown();

    // get modal
    var modal = $('#modal-album');

    // show upload modal
    $('.create.album').click(function() {
        modal
            .modal({ selector: { close: '.close' }})
            .modal('show');
    });

    // submit form
    modal.find('.actions .submit').click(function() {
        var form   = modal.find('form');
        var data   = form.serialize();
        var action = form.attr('action');

        // send form
        $.ajax(action, {
            type: 'POST',
            data: data,
            error: function(jqXHR) {
                var code      = jqXHR.responseJSON.code;
                var message   = jqXHR.responseJSON.message;
                var messageEl = modal.find('.error.message')
                messageEl.find('p').text(message);
                messageEl.show();

                // field
                if (code == 1) {
                    $('#name').addClass('error');
                } else if (code == 2 || code == 3) {
                    $('#visibility').addClass('error');
                }
            },
            success: function() {
                location.reload();
            }
        });
    });

});