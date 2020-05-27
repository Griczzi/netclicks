console.error('hey');
console.warn('waaaay');
console.dir(document);

// menu
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

// открытие звкрытие меню

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

// click внетри меню 'closest - поднимается по элементам пока не найдет нужный элемент'
document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');

        console.log('click outside');
    }
});

// меню выподающее

leftMenu.addEventListener('click', (event) => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        // добавили по клику на иконки открывание меню
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }

    console.log(target.closest('.dropdown'));
})