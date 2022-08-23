import { saveData } from "./localstorage.js";
import { RENDER_EVENT, SEARCH_EVENT } from "./constant.js";

const generateId = () => {
  return +new Date();
};

const generateBookObject = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

const findBook = (bookId, books) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
};

const findBookIndex = (bookId, books) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

const findBookName = (keyword, books) => {
  return books.filter((item) => item.title.toLowerCase().includes(keyword));
};

const addBook = (books) => {
  const titleBook = document.getElementById("inputBookTitle").value;
  const authorBook = document.getElementById("inputBookAuthor").value;
  const yearBook = Number(document.getElementById("inputBookYear").value);
  const isCompleteBook = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    titleBook,
    authorBook,
    yearBook,
    isCompleteBook
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(books);
};

const makeBook = (bookObject, books) => {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute("id", `book-${bookObject.id}`);

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("red");
  buttonDelete.innerText = "Hapus buku";

  buttonDelete.addEventListener("click", () => {
    removeBookFromCompleted(bookObject.id, books);
  });

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  if (bookObject.isComplete) {
    const buttonUndone = document.createElement("button");
    buttonUndone.classList.add("green");
    buttonUndone.innerText = "Belum selesai di Baca";

    buttonUndone.addEventListener("click", () => {
      undoneBookFromCompleted(bookObject.id, books);
    });

    actionContainer.append(buttonUndone, buttonDelete);
  } else {
    const buttonDone = document.createElement("button");
    buttonDone.classList.add("green");
    buttonDone.innerText = "Selesai dibaca";

    buttonDone.addEventListener("click", () => {
      addBookToCompleted(bookObject.id, books);
    });

    actionContainer.append(buttonDone, buttonDelete);
  }
  container.append(actionContainer);

  return container;
};

const searchBook = (filtered_books, keyword) => {
  if (keyword == "") {
    document.dispatchEvent(new Event(RENDER_EVENT));
    return;
  }

  const filterBooks = findBookName(keyword, filtered_books);
  document.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: filterBooks }));
};

const addBookToCompleted = (bookId, books) => {
  const bookTarget = findBook(bookId, books);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(books);
};

const removeBookFromCompleted = (bookId, books) => {
  const bookTarget = findBookIndex(bookId, books);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(books);
};

const undoneBookFromCompleted = (bookId, books) => {
  const bookTarget = findBook(bookId, books);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData(books);
};

export { addBook, makeBook, searchBook };
