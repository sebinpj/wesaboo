
function component() {
    let element = document.createElement('div');
    let array = [1,2,3].map((e) => e ** 2)
    element.innerHTML = array.join(' ');
    return element;
}

$('.test-div').append(component());

$('.test-div').on('click', function () {
    alert('yup');
})