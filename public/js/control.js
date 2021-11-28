$(document).ready(function () {
    $('#card-holder').height($('.card-active').outerHeight());
});

$('.login-signup-button').click(function (e) {
    const parent = $(e.target).attr('data-parent');
    console.log(parent)
    $('body').addClass('noscroll');
    $('#' + parent + '-holder').removeClass('d-none');
    $('#signup-box').height($('.signup-active').outerHeight());
    $('#' + parent + '-holder').animate({
        opacity: 1
    }, 400);
    $('#' + parent).removeClass('Modal-close').addClass('Modal-open').css('transform', 'translateY(0)');
});

$(".password-toggle").click(function (e) {
    const ele = $(e.target).attr("data-toggle");
    if ($(ele).attr('type') == 'password') {
        $(e.target).removeClass('fa-eye').addClass('fa-eye-slash');
        $(ele).attr('type', 'text');
    } else {
        $(e.target).removeClass('fa-eye-slash').addClass('fa-eye');
        $(ele).attr('type', 'password');
    }
});

$('.Close').click(function (e) {
    const parent = $(e.target).attr('data-parent');
    $('body').removeClass('noscroll');
    $('#' + parent).removeClass('Modal-open').addClass('Modal-close').css('transform', 'translateY(-100vh)');
    $('#' + parent + '-holder').animate({
        opacity: 0
    }, 700, function () {
        $('#' + parent + '-holder').addClass('d-none');
    });
});

function slideLeft(ele) {
    let next = 'card' + (parseInt(ele.slice(4)) + 1);
    if (next == 'card' + ($('#card-holder >  div').length))
        $('#carousel-nav-right').addClass('d-none');
    $('#card-holder').height($('#' + next).outerHeight());
    $('#' + ele).removeClass('card-active').addClass('slide-left');
    $('#' + next).removeClass('slide-right').addClass('card-active');
    $('#carousel-nav-left').removeClass('d-none');
}

function slideRight(ele) {
    let prev = 'card' + (parseInt(ele.slice(4)) - 1);
    if (prev == 'card1')
        $('#carousel-nav-left').addClass('d-none');
    $('#card-holder').height($('#' + prev).outerHeight());
    $('#' + ele).removeClass('card-active').addClass('slide-right');
    $('#' + prev).removeClass('slide-left').addClass('card-active');
    $('#carousel-nav-right').removeClass('d-none');
}

$('.carousel-nav').click(function (e) {
    let active = $('.card-active').attr('id');
    if (e.target.id == 'carousel-nav-right')
        slideLeft(active);
    else
        slideRight(active);
});

function signupFormCheck() {
    let activeChildren = $('.signup-active :input');
    for (let i = 0; i < activeChildren.length; ++i) {
        if ($(activeChildren[i]).prop('tagName') == 'BUTTON') {
            continue;
        }
        if ($(activeChildren[i]).val().trim() == '') {
            return false;
        } else if ($(activeChildren[i]).attr('type') == 'radio')
            if ($('input[name = ' + $(activeChildren[i]).attr("name") + ']:checked').length == 0) {
                return false;
            }
    }
    return true;
}

function checkPassword() {
    const password = $('#signup-form-password').val(),
        confirmPassword = $('#signup-form-confirmPassword').val();
    if (password != confirmPassword)
        return false;
    return true;
}

$('.signup-next').click(function () {
    const active = $('.signup-active').attr('id');

    $('#signup-box-holder').find('#password-alert').fadeOut();

    if (!signupFormCheck())
        return;
    if (active == 'signup1') {
        if (!checkPassword()) {
            $('#signup-box-holder').prepend(`
                    <div id="password-alert" style="position: relative; width: 100%;"><div class="alert alert-danger mx-auto">
                    <strong class="col-10">Passwords do not match. </strong>
                    </div></div>`);
            return;
        }
    } else if (active == 'signup3')
        return signupFormVerify();

    const next = 'signup' + (parseInt(active.slice(6)) + 1);
    $('#' + active).removeClass('signup-active').addClass('slide-left');
    setTimeout(function () {
        $('#' + next).removeClass('slide-right').addClass('signup-active');
        $('#signup-box').height($('#' + next).outerHeight());
        $('.back-arrow').removeClass('d-none');
    }, 200);
});

$('.back-arrow').click(function () {
    const active = $('.signup-active').attr('id');
    const prev = 'signup' + (parseInt(active.slice(6)) - 1);
    if (prev == 'signup1')
        $('.back-arrow').addClass('d-none');
    $('#' + active).removeClass('signup-active').addClass('slide-right');
    setTimeout(function () {
        $('#' + prev).removeClass('slide-left').addClass('signup-active');
        $('#signup-box').height($('#' + prev).outerHeight());
    }, 200);
});

$('button[form = "login-form"]').click(function (e) {
    $('#login-form').submit(function (e) {
        e.preventDefault();
    });

    const elements = $('input[form="login-form"]'),
        data = {};
    for (let i = 0; i < elements.length; ++i) {
        if ($(elements[i]).val().trim() == '') {
            return;
        }
        data[$(elements[i]).attr('name')] = $(elements[i]).val();
    }

    $.ajax({
        data,
        type: 'POST',
        url: '/login/verify',
        beforeSend: function () {
            $('#login-box').find('.loader').removeClass('d-none');
        },
        success: function (result) {
            $('#login-box').find('.loader').addClass('d-none');
            if (result == 'verified') {
                $('#login-form').unbind('submit').submit();
            } else {
                $('#login-box-holder').prepend(`
                    <div style="position: relative;height: 1px; width: 100%;"><div class="alert alert-primary alert-dismissible mx-auto">
                    <button type="button" class="close px-0 col-2" data-dismiss="alert">&times;</button>
                    <strong class="col-10">${result}</strong>
                    </div></div>`)
            }
        }
    });
});

function signupDataSerialize(form) {
    const elements = $(form).serializeArray();
    let data = {};

    for (let i = 0; i < elements.length; ++i) {
        data[elements[i].name] = elements[i].value;
    }

    return data;
}

function signupFormSubmit() {
    data = {}

    $.extend(data, signupDataSerialize('#signup1-form'));
    $.extend(data, signupDataSerialize('#signup2-form'));
    $.extend(data, signupDataSerialize('#signup3-form'));

    $.ajax({
        data,
        type: 'POST',
        url: '/signup',
        success: function (path) {
            console.log(path);
            window.location.href = path;
        }

    })
}

function signupFormVerify() {
    $.ajax({
        data: signupDataSerialize('#signup1-form'),
        type: 'POST',
        url: '/signup/verify',
        beforeSend: function () {
            $('#signup-box').find('.loader').removeClass('d-none');
        },
        success: function (result) {
            setTimeout(function () {
                $('#signup-box').find('.loader').addClass('d-none');
                if (result == 'verified') {
                    signupFormSubmit();
                } else {
                    $('.back-arrow').click();
                    setTimeout(function () {
                        $('.back-arrow').click();
                    }, 500);
                    setTimeout(function () {
                        $('#signup-box-holder').prepend(`
                        <div style="position: relative;height: 1px; width: 100%;"><div class="alert alert-primary alert-dismissible mx-auto">
                        <button type="button" class="close px-0 col-2" data-dismiss="alert">&times;</button>
                        <strong class="col-10">${result}</strong>
                        </div></div>`)
                    }, 600);
                }
            }, 500);
        }
    });
}