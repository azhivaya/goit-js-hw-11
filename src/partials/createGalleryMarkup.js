import { createCardsMarkup } from './createCardsMarkup';

export function createGalleryMarkup(cards) {
  console.log('createGalleryMarkup: cards: ', cards);
  return cards.map(card => createCardsMarkup(card)).join('');
}