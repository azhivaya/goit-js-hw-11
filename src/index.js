import './sass/index.scss'
import { Notify } from "notiflix";


// import axios from "axios";

import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const API_KEY = '28388649-5ab5560547093ff481a2cc586';
// // axios.defaults.baseURL = 'https://pixabay.com/api/'
const BASE_URL = 'https://pixabay.com/api/';


const input = document.querySelector('[name="searchQuery"]');
console.log(input);
const form = document.querySelector('#search-form');
const btnLoadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const simpleLightbox = new SimpleLightbox('.gallery a');


let pageNum = 1;
let objectValue ='';
let perPage = 40;
// const dataForSc = data;

// simpleLightbox options
/* {
  captionsData: 'alt',
  captionDelay: '250',

} */

// при новом сабмите нужно очистить предудіщию разметку

form.addEventListener('submit', onFormSubmit);
// btnLoadMore.addEventListener('click', onBtnLoadMoreClick);

function onFormSubmit(e) {
    e.preventDefault();

  objectValue = e.target.elements.searchQuery.value;
  
  
    
    console.log(objectValue);
  form.reset();
  gallery.innerHTML = '';

    fetchImages()
    .then(checkQuery)
    .catch(error => console.log(error));
};

function fetchImages() {
const options = new URLSearchParams({
    q: objectValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: perPage,
    page: pageNum,
});

    
    return fetch(`${BASE_URL}?key=${API_KEY}&${options}`)
    .then(response => {
        if(!response.ok) {
            throw new Error(response.status)
        }
        return response.json();
    });
};

function checkQuery(data) {
  const uppercaseQuery = objectValue.toUpperCase();
if(data.totalHits === 0) {
          Notify.failure(`Sorry, there are no images matching your ${uppercaseQuery} query. Please try again.`);
          return;
      };
      Notify.success(`Hooray! We found ${data.totalHits} images on your ${uppercaseQuery} query.`);
        // loadMoreBtnToggle();
      gallery.insertAdjacentHTML('beforeend', createGallery(data));
};

function imagesMarkup({webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `

<div class="photo-card">
<a class='gallery__link href='${largeImageURL}'>
<img class='gallery__image' src='${webformatURL}' alt="${tags}" loading="lazy" /></a>

  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>

</div>
`
};

function createGallery({ hits: cards, totalHits: total }) {
    if(perPage * pageNum >= total) {
      // loadMoreBtnToggle();
      setTimeout(() => {
  Notify.warning("We're sorry, but you've reached the end of search results.");
      }, 2000)

    }
  return cards.map(card => imagesMarkup(card)).join('');
  
};

// function onBtnLoadMoreClick() {
//     pageNum +=1;

//   fetchImages().then(data => gallery.insertAdjacentHTML('beforeend', createGallery(data)));
//   // smoothScrolling();
  
// };

// function loadMoreBtnToggle() {
//     btnLoadMore.classList.toggle('is-hidden');
// }
// console.log(newGal);

// const optionsForObserver = {
//   rootMargin: '200px',
//   threshold:1.0,
// };

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       console.log('yeeeehhhh');
      
//       // if (!dataForSc.hits.length === 0) {
//       //   fetchImages().then(data => gallery.insertAdjacentHTML('beforeend', createGallery(dataForSc.hits, dataForSc.totalHits)));
//       // pageNum += 1;
//       // }
//       // return;
//   }
// })
// }, optionsForObserver)

// observer.observe(document.querySelector('.scroll-guard'))

// function smoothScrolling() {
//   const { height: cardHeight } = document
//   .querySelector(".gallery")
//   .firstElementChild.getBoundingClientRect();

//   console.log(cardHeight);

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: "smooth",
// });
// }


// // В ответе будет массив изображений удовлетворивших критериям параметров запроса. Каждое изображение описывается объектом, из которого тебе интересны только следующие свойства:

// // webformatURL - ссылка на маленькое изображение для списка карточек.
// // largeImageURL - ссылка на большое изображение.
// // tags - строка с описанием изображения. Подойдет для атрибута alt.
// // likes - количество лайков.
// // views - количество просмотров.
// // comments - количество комментариев.
// // downloads - количество загрузок.

// function fetchImages(images) {
// return fetch(url, options).then(r=>r.json()).then(console.log);
// }

// fetchImages('image').then(image => {console.log(image)})
// input.addEventListener('input', () => {
//     search = input.value;
//     console.log(search);
// })

// // btn.addEventListener('click', onBtnClick);

// form.addEventListener('submit', onFormSubmit);

// function imagesMarkup(images) {
// return images.map(({webformatURL,largeImageURL, tags, likes, views, comments, downloads}) => `<div class="photo-card">
//   <img src='${webformatURL}' alt="" loading="lazy" />
//   <div class="info ${tags}">
//     <p class="info-item">
//       <b>Likes ${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views ${views}</b>
//     </p>
//     <p class="info-item">
//       <b>Comments ${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads ${downloads}</b>
//     </p>
//   </div>
// </div>`).join('');

// }

// function addImagesToGallery(images) {
// gallery.insertAdjacentHTML('beforeend', imagesMarkup());
// };

// console.log(gallery);