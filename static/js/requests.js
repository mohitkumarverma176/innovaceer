function get_playlist(){
     $.get('get_playlist').done(function (data, _status, xhr) {
            if (handle_logouts(xhr, data)) {
                return;
            }
            $('#playlist').html(data);
        });

}

function create_playlist(){

}


function handle_logouts(xhr, data) {
    let ct = xhr.getResponseHeader("content-type") || "";
    if (ct.indexOf('html') > -1) {
        if ($('#login', data).length > 0) {
            window.location.href = '/login';
            return true;
        }
    }
    return false;
}

function change_file_name(element) {
    let filename_id = (element.id === 'json-data-file') ? '#json-data-filename' : '#paid-list-filename';
    let default_text = (element.id === 'json-data-file') ? 'Select JSON FILE' : 'Select Paid List';
    if (element.files.length === 0) {
        $(filename_id).html(default_text);
        return;
    }
    let filename = element.files[0].name;
    let splits = filename.split('.');
    let text = default_text;
    if (splits.length === 0 || (splits[splits.length - 1] !== 'json' )) {
        show_warning_message('only json formats are allowed');
        element.value = '';
    } else {
        text = element.files[0].name;
    }
    $(filename_id).html(text);
}

function upload_json_data() {
    let file_id = '#json-data-file';
    let button_id = '#upload-json-data-button';
    upload_file(button_id, file_id);
}





function upload_file(button_id, file_id) {
    let filename = $(file_id).val();
    if (filename === '') {
        show_warning_message('Please selected a file before uploading');
        return;
    }
    add_loading(button_id);
    let form_data = new FormData();
    form_data.append('file', $(file_id)[0].files[0]);
    $.ajax({
        url: `/upload_file`,
        data: form_data,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        },
        contentType: false,
        processData: false,
        type: 'post',
        success: function (data) {
            generic_ajax_success_handler(data, button_id);
        },
        error: function (xhr, _text_status, _error) {
            generic_ajax_error_handler(xhr, button_id);
        }
    }).then(() => {
        let filename_id = (file_id === '#customer-details-file') ? '#customer-details-filename' : '#paid-list-filename';
        let default_text = (file_id === '#customer-details-file') ? 'Select Customer Details' : 'Select Paid List';
        $(file_id).val("");
        $(filename_id).html(default_text);
    });
}

function generic_ajax_success_handler(data, button_id, success_fun, fail_fun) {
    button_id && remove_loading(button_id);
    if ($('button#login', data).length > 0) {
        window.location.href = '/login';
        return;
    }
    if (data && data.status && data.status.toLowerCase() === 'success') {
        if (data.message && typeof (data.message) === 'string') {
            show_success_message(data.message);
        }
        success_fun && success_fun();
    } else {
        if (data && data.message && typeof (data.message) == 'string') {
            if (data.message === 'logged out') {
                window.location.href = '/login';
                return;
            }
            show_warning_message(data.message);
        } else {
            show_warning_message('Unknown Error Occurred');
        }
        fail_fun && fail_fun();
    }
}


function generic_ajax_error_handler(xhr, button_id) {

    show_warning_message((xhr.responseJSON && xhr.responseJSON.message) || 'Unknown Error occurred');
}


function show_success_message(message) {
    show_message(message, 'is-success', 0.8);
}

function show_warning_message(message) {
    show_message(message, 'is-danger', 0.8);
}

function show_message(message, type, opacity) {
    bulmaToast.toast({
        message: message,
        duration: 3000,
        position: 'top-center',
        queue: true,
        opacity: opacity,
        dismissible: true,
        type: type
    });
}

function add_loading(button_id) {
    $(button_id).addClass('is-loading');
}

function remove_loading(button_id) {
    setTimeout(() => {
        $(button_id).removeClass('is-loading');
    }, 1000);
}
