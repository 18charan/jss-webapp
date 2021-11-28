$(document).ready(function() {
    const inputs = $('.food-quantity').toArray();

    inputs.forEach(function(each){
        const id = $(each).attr('data-answer-id'),
        width = $(`span[data-input-id=${id}]`).outerWidth() + 3;
        if(width){
            $(each).css('padding-right', width);
        }
    });

    // const q = $('.disable-sub-question');
    // if(q.length == 0)
    // return;

    // const id = q.attr('data-id');
    // $("div[data-main-question='"+id+"']").addClass('disable-input');
});

$('input').click(function(e){
    const q = $('.disable-sub-question');
    if(q.length == 0)
    return;


    const id = q.attr('data-id'), a = $(e.target), value = $("label[for="+a.attr('id')+"]").text();

    if(id == a.attr('name'))
    if(value == 'Yes'){
    $("div[data-main-question='"+id+"']").removeClass('disable-input');
    $("div[data-main-question='"+id+"'] input").val('').prop('required', true);
    }
    else{
    $("div[data-main-question='"+id+"']").addClass('disable-input');
    $("div[data-main-question='"+id+"'] input").val(0).removeAttr('required');
    }
    
});

$('.myCheckbox').click(function(e) {
    const id = $(e.target).attr('id');

    if(e.target.checked){
        $(`input[data-answer-id=${id}]`).removeClass('remove-input');
        $(`span[data-input-id=${id}]`).removeClass('remove-input');
    }else{
        $(`input[data-answer-id=${id}]`).addClass('remove-input');
        $(`span[data-input-id=${id}]`).addClass('remove-input');
    }
});

function alertDisplay(target, message){
    $('html, body').animate({
        scrollTop: $(target).offset().top - $('.Nav').outerHeight() - 20
    }, 500);
    setTimeout(function(){
        $(`<div class="myAlert" style="z-index: 5000;position: sticky; top: 0;height: 1px;"><div class="alert alert-danger alert-dismissible mx-auto">
        <button type="button" class="close px-0 col-2" data-dismiss="alert">&times;</button>
        <strong class="col-10">${message}</strong>
        </div></div>`).hide().prependTo(target).fadeIn();
    }, 400);
}

function getCheckedElements(){
    const diets = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'], elements = [];

    for(let i = 0; i < 4; ++i){
        const checked = $(`#${diets[i]} input[type=checkbox]:checked`);

        for(let j = 0; j < checked.length; ++j){
            elements.push($(checked[j]).attr('id'));
        }
    }  
    return elements;
}

function dietCheck(){
    $('.myAlert').remove();
    const diets = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

    for(let i = 0; i < 4; ++i)
        if($(`#${diets[i]} input[type=checkbox]:checked`).length == 0){
            alertDisplay(`#${diets[i]}`, 'Select atleast 1 item.')
            return false;
        }

    return true;
}

$('form').submit(function(e){
    e.preventDefault();

    if(!dietCheck())
        return;

    const diets = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
    checkedElements = getCheckedElements();
    let dietaryRecall = {};
    diets.forEach(each => {
        dietaryRecall[each] = {}
    });
    for(let i = 0; i < checkedElements.length; ++i){
        const ans = $(`input[data-answer-id=${checkedElements[i]}]`).val(),
        dietType = checkedElements[i].split('-');
        if(ans.trim() == ''){
            alertDisplay(`#${dietType[0]}`, 'Enter quantity for selected items.');
            return;
        }
        dietaryRecall[dietType[0]][dietType[1]] = ans;
    }
    let answers = {};
    $('form').serializeArray().forEach(each => {
        answers[each.name] = each.value
    });

    $.ajax({
        data: {userAnswers: answers, dietaryRecall},
        type: 'POST',
        url: '/registration',
        beforeSend: function(){
            $('body').addClass('noscroll');
            $('.loader').removeClass('d-none');
        },
        success: function (path){
            window.location.href = path;
            return;
        }
    })
});