// console.error('hey');
// console.warn('waaaay');
// console.dir(document);

///////////////////////// menu
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = 'd38cc444389c05c6b074467fd263f95f';
const SERVER = 'https://api.themoviedb.org/3';

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
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');
const preloader = document.querySelector('.preloader');
const dropdown = document.querySelectorAll('.dropdown');
const tvShowsHead = document.querySelector('.tv-shows__head');
const posterWrapper = document.querySelector('.poster__wrapper');
const pagination = document.querySelector('.pagination');


// Делаем Loading
const loading = document.createElement('div');
loading.className = 'loading';

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

    getSearchResult = (query) => {
        this.temp = `${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`;
        return this.getData(this.temp);
        //https://api.themoviedb.org/3/search/tv?api_key=<<api_key>>&language=en-US&page=1&query=000&include_adult=false
    }
    getNextPage = (page) => {
        // const url = `${this.url}&page=${page}`;
        // return this.getData(url);
        return this.getData(this.temp + '&page=' + page);
    }


    getTvShow = (id) => {
        return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    }

    getTopRated = () => {
        return this.getData(`${SERVER}/tv/top_rated?api_key=${API_KEY}&language=ru-RU&page=1`);
    }
    getPopular = () => {
        return this.getData(`${SERVER}/tv/popular?api_key=${API_KEY}&language=ru-RU&page=1`);
    }
    getAiringToday = () => {
        return this.getData(`${SERVER}/tv/airing_today?api_key=${API_KEY}&language=ru-RU&page=1`);
    }
    getWeek = () => {
        return this.getData(`${SERVER}/tv/on_the_air?api_key=${API_KEY}&language=ru-RU&page=1`);
    }
}


//console.log(new DBServis().getSearchResult('Папа'));


const renderCard = (responce, target) => {
    //debugger;
    console.log(responce);
    tvShowList.textContent = '';



    if( !responce.total_results ) {  /////////////// ошибка 404 responce.results == '' !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        loading.remove();
        tvShowsHead.innerHTML = `<img class="" src="/img/404page.jpg">`;
        return
    } 
    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска';


    responce.results.forEach(item => {
        const {
            backdrop_path: backdrop,
            name: title,
            poster_path: poster,
            vote_average : vote,
            id
        } = item;


        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = `
        <a href="#" id="${id}" class="tv-card">
            ${voteElem}
            <img class="tv-card__img"
                src="${posterIMG}"
                data-backdrop="${backdropIMG}"
                alt="${title}">
            <h4 class="tv-card__head">${title}</h4>
        </a>
        `;
        loading.remove();
        tvShowList.append(card);
       
    });

    pagination.innerHTML = '';

    // if(responce.total_pages > 1) {
    //     for(let i = 1; i <= responce.total_pages; i++) {
    //         pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
    //     }
    // }
    if (responce.total_pages > 1) {
        const total = responce.total_pages <= 7 ? responce.total_pages : 7;
        const currentPage = responce.page;
        for (let i = 1; i <= total; i++) {
            if (i === currentPage) {
                pagination.innerHTML += `<li><a href="#">${i}</a></li>`
            } else {
                pagination.innerHTML += `<li><a href="#" class="pages" >${i}</a></li>`
            }

        }
    }
};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim(); //trim уберает пробелы в запросе
    if (value) {
        tvShows.append(loading);
        new DBServis().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});

{
tvShows.append(loading);  
new DBServis().getTestData().then(renderCard);
}

///////////////////////// открытие звкрытие меню

const closeDropdown = () => {
    dropdown.forEach(item => {
       item.classList.remove('active');
    })
}

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
});

// click внетри меню 'closest - поднимается по элементам пока не найдет нужный элемент'
document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    }
});

////////////////////////////////// меню выподающее

leftMenu.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        // добавили по клику на иконки открывание меню
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }

    if (target.closest('#top-rated')) {
        new DBServis().getTopRated().then((responce) => {
            renderCard(responce, target);
        });
    }
    if (target.closest('#popular')) {
        new DBServis().getPopular().then((responce) => {
            renderCard(responce, target);
        });
    }

    if (target.closest('#today')) {
        new DBServis().getAiringToday().then((responce) => {
            renderCard(responce, target);
        });
    }

    if (target.closest('#week')) {
        new DBServis().getWeek().then((responce) => {
            renderCard(responce, target);
        });
    }

    if (target.closest('#search')){
        tvShowList.textContent = '';
        tvShowsHead.textContent = ''
        ////// МОЖНО РЕАЛИЗОВАТЬ ЗДЕСЬ ПОИСК
    }
});




// открытие модального окна

tvShowList.addEventListener('click', (event) => {

    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card')

    if (card) {

        preloader.style.display = 'block';

        new DBServis().getTvShow(card.id)
            .then(response => {

                if (response.poster_path) {
                    tvCardImg.src = IMG_URL + response.poster_path;
                    tvCardImg.alt = response.name;
                } else {
                    tvCardImg.src = 'img/no-poster.jpg';
                }

                
                modalTitle.textContent = response.name;
                genresList.textContent = ''; //очищаем что бы правильно показывал жанры.Если не очистить будут показаны все жанры
                for (const item of response.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`
                }
                // genresList.innerHTML = response.genres.reduce((acc, item) => { //через reduce
                //     return `${acc} <li>${item.name}</li>`
                // }, '');

                // response.genres.forEach(item => {                  //через forEach
                //     genresList.innerHTML += `<li>${item.name}</li>`;
                // });

                rating.textContent = response.vote_average;
                description.textContent = response.overview;
                modalLink.href = response.homepage;

                
            })
            .then(() => {

                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .finally(() => {
                preloader.style.display = '';
            });
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

pagination.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('pages')) {
        tvShows.append(loading);
        new DBServis().getNextPage(target.textContent).then(renderCard);
    }
});