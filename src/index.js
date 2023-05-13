//instalacja bibliotek + importy
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './index.css';

//zmienne żródłowe api
const apiKey = '36226176-54c305785f6ade5e5646ea3c4';

//pobeieranie referencji html
const inputForm = document.getElementById('search-form');
const galleryEl = document.getElementById('gallery');
const submitBtn = document.getElementById('show-more');

let numberPage = 1;
let limitEl = 40;
let counterPage = 0;

const fetchData = async (queryEl, page, limit) => {
  const params = new URLSearchParams({
    key: apiKey,
    q: queryEl,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: limit,
    page: page,
  });

  const response = await axios.get(`https://pixabay.com/api/?${params}`);

  if (response.data.totalHits > 0 && counterPage === 1) {
    Notiflix.Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
  }

  return response.data.hits;
};

const createGalleryItems = async cards => {
  try {
    if (cards.length !== 0 && cards.length < 40) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      submitBtn.setAttribute('disabled', 'true');
    } else if (cards.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    const galleryItems = cards.map(el => {
      return `<div class="photo-card">
              <div class="photo">
                <a href="${el.largeImageURL}">
                  <img src="${el.webformatURL}" title="author : ${el.user}" loading="lazy" />
                </a>
              </div>
              <div class="info">
                <p class="info-item">
                  Likes: <b>${el.likes}</b>
                </p>
                <p class="info-item">
                  Views: <b>${el.views}</b>
                </p>
                <p class="info-item">
                  Comments: <b>${el.comments}</b>
                </p>
                <p class="info-item">
                  Downloads: <b>${el.downloads}</b>
                </p>
              </div>
            </div>`;
    });
    galleryEl.innerHTML += galleryItems.join('');
    new SimpleLightbox('#gallery a', { captionDelay: 500 }).refresh();
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops! Something went wrong. Please try again later.'
    );
  }
};

const handleLoadMore = async () => {
  // kolejne strony
  numberPage += 1;
  const query = inputForm.elements.searchQuery.value.trim();
  const cards = await fetchData(query, numberPage, limitEl);
  await createGalleryItems(cards);
};

submitBtn.addEventListener('click', handleLoadMore);

inputForm.addEventListener('submit', async event => {
  event.preventDefault();
  numberPage = 1;
  submitBtn.removeAttribute('disabled');
  const query = event.target.elements.searchQuery.value.trim();
  const cards = await fetchData(query, numberPage, limitEl);
  galleryEl.innerHTML = '';
  await createGalleryItems(cards);
});

//Lista parametrów treści żądania, które należy podać:
// key - Twój unikalny klucz dostępu do API.
// q - termin, który chcemy wyszukać. W tej aplikacji to treść którą będzie wpisywał użytkownik.
// image_type - typ obrazka. Chcemy tylko zdjęcia, dlatego określ wartość parametru jako photo.
// orientation - orientacja zdjęcia. Określ wartość horizontal.
// safesearch - wyszukiwanie obrazków SFW (Safe For Work). Określ wartość true.
// fvcvcvc
//stworzyć zmienną, która zbiere wszystkie parametry w jeden worek + async/await w featch'u
// fetchData();

// console.log(arrayParams);
//zmienne do wartości elemetów paginacji (parametryzacji)
// {
//     "total": 4692,
//     "totalHits": 500,
//     "hits": [
//         {
//             "id": 195893,
//             "pageURL": "https://pixabay.com/en/blossom-bloom-flower-195893/",
//             "type": "photo",
//             "tags": "blossom, bloom, flower",
//             "previewURL": "https://cdn.pixabay.com/photo/2013/10/15/09/12/flower-195893_150.jpg"
//             "previewWidth": 150,
//             "previewHeight": 84,
//             "webformatURL": "https://pixabay.com/get/35bbf209e13e39d2_640.jpg",
//             "webformatWidth": 640,
//             "webformatHeight": 360,
//             "largeImageURL": "https://pixabay.com/get/ed6a99fd0a76647_1280.jpg",
//             "fullHDURL": "https://pixabay.com/get/ed6a9369fd0a76647_1920.jpg",
//             "imageURL": "https://pixabay.com/get/ed6a9364a9fd0a76647.jpg",
//             "imageWidth": 4000,
//             "imageHeight": 2250,
//             "imageSize": 4731420,
//             "views": 7671,
//             "downloads": 6439,
//             "likes": 5,
//             "comments": 2,
//             "user_id": 48777,
//             "user": "Josch13",
//             "userImageURL": "https://cdn.pixabay.com/user/2013/11/05/02-10-23-764_250x250.jpg",
//         },
//         {
//             "id": 73424,
//             ...
//         },
//         ...
//     ]
//     }

// W odpowiedzi pojawi się tablica obrazów odpowiadających kryteriom parametrów żądania. Każdy obraz opisany jest obiektem, z którego interesują cię tylko następujące właściwości:

// webformatURL - link do małego obrazka.
// largeImageURL - link do dużego obrazka.
// tags - wiersz z opisem obrazka. Będzie pasować do atrybutu alt.
// likes - liczba “lajków”.
// views - liczba wyświetleń.
// comments - liczba komentarzy.
// downloads - liczba pobrań.

{
  /* <div class="photo-card">
  <img src="" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>; */
}
