// console.error('hey');
// console.warn('waaaay');
// console.dir(document);

///////////////////////// menu
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'd38cc444389c05c6b074467fd263f95f';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');



// Делаем Loading
const loading = document.createElement('div');
loading.className = 'loading'

/////////////////
const DBServis = class {
    getData = async (url) => {
        const res = await fetch(url);

        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

}

const renderCard = responce => {
    console.log(responce);
    tvShowList.textContent = '';

    responce.results.forEach(item => {

        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average : vote,
        } = item;


        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = `
        <a href="#" class="tv-card">
            ${voteElem}
            <img class="tv-card__img"
                src="${posterIMG}"
                data-backdrop="${backdropIMG}"
                alt="Звёздные войны: Повстанцы">
            <h4 class="tv-card__head">${title}</h4>
        </a>
        `;
        loading.remove();
        tvShowList.append(card);
    });
};

{
tvShows.append(loading);  
new DBServis().getTestData().then(renderCard)
}

///////////////////////// открытие звкрытие меню

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

////////////////////////////////// меню выподающее

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
});

// открытие модального окна

tvShowList.addEventListener('click', (event) => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card')

    if (card) {

        new DBServis().getTestCard()
            .then(response => {
                console.log(response);
                tvCardImg.src = IMG_URL + response.poster_path;
                modalTitle
                genresList
                rating
                description
                modalLink
            })

        //document.body.style.backgroundColor = 'rgba(0, 0, 0, .8)';
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
});

//  закрытие окна
modal.addEventListener('click', event => {
    //console.log(event.target.closest('.cross'));

    if (event.target.closest('.cross') ||
        event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }

})
// смена карточки

const changeImage = (event) => {
    const card = event.target.closest('.tv-shows__item')

    //target.matches('.tv-card__img') matches ищет определённые элементы его нельзя применить на блок
    if (card) {
        const img = card.querySelector('.tv-card__img');
        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }

    }

};

tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);