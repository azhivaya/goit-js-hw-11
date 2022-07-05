import { Notify } from "notiflix";

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a');

// import axios from "axios";


const API_KEY = '28388649-5ab5560547093ff481a2cc586';
// // axios.defaults.baseURL = 'https://pixabay.com/api/'
const BASE_URL = 'https://pixabay.com/api/';


// const input = document.querySelector('[name="searchQuery"]');
const form = document.querySelector('#search-form');
const btnLoadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let pageNum = 1;
let objectValue ='';
let perPage = 40;


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

function checkQuery({hits: cards, totalHits: totalCards}) {
  const uppercaseQuery = objectValue.toUpperCase();
// if(data.totalHits === 0) {
    if(!totalCards){
          Notify.failure(`Sorry, there are no images matching your ${uppercaseQuery} query. Please try again.`);
          return;
      };
      Notify.success(`Hooray! We found ${totalCards} images on your ${uppercaseQuery} query.`);
        // loadMoreBtnToggle();
  gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(cards));
  lightbox.refresh();
};



// function btnLoadMoreSwitch() {
//     if(perPage * pageNum >= total) {
//       // loadMoreBtnToggle();
//       setTimeout(() => {
//   Notify.warning("We're sorry, but you've reached the end of search results.");
//       }, 2000)

//   };
  
// };

function createGalleryMarkup(cards) {
return cards.map(card => imagesMarkup(card)).join('');
}

function imagesMarkup({webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `

<div class="photo-card">
<a class='gallery__link href='${largeImageURL}'>
<img class='gallery__image' src='${webformatURL}' alt="${tags}" loading="lazy" />


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
</a>
</div>
`
};

function fetchImages() {
const options = new URLSearchParams({
    q: objectValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
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