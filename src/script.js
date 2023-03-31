import { searchTypes } from './modules/search-types-module.js';
import { FormDataHelper } from './helpers/form-data-helper.js';
import { useFetch } from './helpers/use-fetch.js';

const searchTypesSelect = document.getElementById('search-types');
// carrega as opções de busca
searchTypes.forEach(({ id, name }) => {
  const searchTypeOption = document.createElement('option');
  searchTypeOption.value = id;
  searchTypeOption.innerText = name;
  searchTypesSelect.appendChild(searchTypeOption);
});

// form search
document.getElementById('search-form').onsubmit = async function(event) {
  event.preventDefault();
  
  const { type: searchTypeId, search } = new FormDataHelper(this).json();
  const searchType = searchTypes.find(type => type.id == searchTypeId);

  const books = await requestGoogleApi({ search, searchType });

  const booksHTML = document.getElementById('books');
  booksHTML.innerHTML = '';

  for(const {volumeInfo: book} of books) 
    booksHTML.innerHTML += assembleBookCard(book);
};

async function requestGoogleApi({search, searchType}){
  let url = `https://www.googleapis.com/books/v1/volumes?q=${search}`;

  if(searchType.name != 'titulo') 
    url = `https://www.googleapis.com/books/v1/volumes?q=${searchType.keyword}:${search}`;

  const { items } = await useFetch({ url });

  return items;
};

function assembleBookCard(book) {
  return `
    <div class="book">
      <img 
        src="${
          book.imageLinks ? 
          book.imageLinks.smallThumbnail : 
          "./assets/no_image.jpg"
        }" 
        alt="${book.title}"
      />
      <h4>${book.title}</h4>
    </div>
  `;
}