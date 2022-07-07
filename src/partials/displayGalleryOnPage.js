import { createGalleryMarkup } from './createGalleryMarkup';

export function displayGalleryOnPage(gallery, cards) {
  gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(cards));
}