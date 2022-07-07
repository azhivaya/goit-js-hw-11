import { Notify } from "notiflix";

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createGalleryMarkup } from './partials/createGalleryMarkup';
import { fetchImages } from './partials/fetchImages';
import { displayGalleryOnPage } from './partials/displayGalleryOnPage';

let lightbox = new SimpleLightbox('.gallery a');


// import axios from "axios";


// const API_KEY = '28388649-5ab5560547093ff481a2cc586';
// // // axios.defaults.baseURL = 'https://pixabay.com/api/'
// const BASE_URL = 'https://pixabay.com/api/';


// const input = document.querySelector('[name="searchQuery"]');
const form = document.querySelector('#search-form');
const btnLoadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

let pageNum = 1;
let objectValue ='';
let cardsPerPage = 40;
let totalCards = 0;


// simpleLightbox options
/* {
  captionsData: 'alt',
  captionDelay: '250',

} */

// при новом сабмите нужно очистить предудіщию разметку

form.addEventListener('submit', onFormSubmit);
// btnLoadMore.addEventListener('click', onBtnLoadMoreClick);

// function onFormSubmit(e) {
//     e.preventDefault();

//   objectValue = e.target.elements.searchQuery.value;
//     // console.log(objectValue);
    
//   resetValues();
  
//     fetchImages(objectValue, cardsPerPage, pageNum)
//     .then(checkQuery)
//     .catch(error => console.log(error));
// };

async function onFormSubmit(e) {
  try{ e.preventDefault();

  objectValue = e.target.elements.searchQuery.value;
    // console.log(objectValue);
    
  resetValues();
  
  const fetchResult = await fetchImages(objectValue, cardsPerPage, pageNum);
    await checkQuery(fetchResult);
  } catch (err) {
    console.log(err);
  }
};


function checkQuery({ data }) {
  const uppercaseQuery = objectValue.toUpperCase();
  console.log('data clg:', data);

  const cards = data.hits;
  totalCards = data.totalHits;

  if (objectValue === '') {
    Notify.warning('Please, enter your query!');
    return;
  };

  if(!totalCards) {
    Notify.failure(`Sorry, there are no images matching your ${uppercaseQuery} query. Please try again.`);
    return;
  };

  Notify.success(`Hooray! We found ${totalCards} images on your ${uppercaseQuery} query.`);
  // loadMoreBtnOn();
  checkLastPage();
  // displayGalleryOnPage(gallery, cards);

  gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(cards));
  lightbox.refresh();
  setTimeout(observerOn, 3000);
};

function displayGalleryOnPage(gallery, cards) {
  gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(cards));
};

function resetValues() {
  // loadMoreBtnOff();
  
  form.reset();
    gallery.innerHTML = '';
  pageNum = 1;
  observerOff();
};

function checkLastPage() {

  if(cardsPerPage * pageNum >= totalCards) {
    // loadMoreBtnOff();

    Notify.warning("We're sorry, but you've reached the end of search results.");
    return true;
    
  } else {
    return false;
  }
};

const optionsForObserver = {
  rootMargin: '350px',
  threshold: 1.0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('yeeeehhhh');

      if (checkLastPage()) {
        return;
      };

      pageNum += 1;
      // displayGalleryOnPage()
      fetchImages(objectValue, cardsPerPage, pageNum).then(({ data }) => gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(data.hits)));
      // data = data.hits
    };
  });
}, optionsForObserver);

// observer.observe(document.querySelector('.scroll-guard'))

function observerOn() {
  observer.observe(document.querySelector('.scroll-guard'));
}

function observerOff() {
  observer.unobserve(document.querySelector('.scroll-guard'));
}

// function onBtnLoadMoreClick(total) {
//     pageNum +=1;

//   fetchImages()
//     .then(data => gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(data.hits)));
  
//   checkLastPage(total);
  
//   // smoothScrolling();
  
// };

// function loadMoreBtnOn() {
//     btnLoadMore.classList.remove('is-hidden');
// }
// function loadMoreBtnOff() {
//     btnLoadMore.classList.add('is-hidden');
  
// }
// console.log(newGal);

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