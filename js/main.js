import { isStorageExist, loadDataFromStorage } from "./localstorage.js";
import { addBook, makeBook, searchBook } from "./books.js";
import {
  RENDER_EVENT,
  SAVED_EVENT,
  SEARCH_EVENT,
  STORAGE_KEY,
} from "./constant.js";

let books = [];
let filtered_books = [];

const isCompleteBook = document.getElementById("inputBookIsComplete");
const addBookTo = document.getElementById("addBookTo");
isCompleteBook.addEventListener("change", () => {
  const isChecked = isCompleteBook.checked;
  if (isChecked) {
    addBookTo.innerText = "Selesai dibaca";
  } else {
    addBookTo.innerText = "Belum selesai dibaca";
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const uncompletedBOOKList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBOOKList.innerHTML = "";

  const completedBOOKList = document.getElementById("completeBookshelfList");
  completedBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem, books);
    if (!bookItem.isComplete) {
      uncompletedBOOKList.append(bookElement);
    } else {
      completedBOOKList.append(bookElement);
    }
  }
});

document.addEventListener(SEARCH_EVENT, (event) => {
  const uncompletedBOOKList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBOOKList.innerHTML = "";

  const completedBOOKList = document.getElementById("completeBookshelfList");
  completedBOOKList.innerHTML = "";
  
  console.log(event.detail);
  filtered_books = event.detail;
  for (const bookItem of filtered_books) {
    const bookElement = makeBook(bookItem, books);
    if (!bookItem.isComplete) {
      uncompletedBOOKList.append(bookElement);
    } else {
      completedBOOKList.append(bookElement);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const inputForm = document.getElementById("inputBook");
  inputForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook(books);
    console.log(books)
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = document.getElementById("searchBookTitle").value;
    filtered_books = books;
    searchBook(filtered_books, keyword);
  });

  if (isStorageExist()) {
    loadDataFromStorage(books);
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});
