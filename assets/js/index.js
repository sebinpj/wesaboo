
import $ from 'jquery';

function component() {
    let element = document.createElement('div');
    let array = [1,2,3].map((e) => e ** 2)
    element.innerHTML = join(array, ' ');

    return element;
}

$('.test-div').append(component());

$('.test-div').on('click', function () {
    alert('yup');
})