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
  textTitle.classList.add("text-corn-900");
  textTitle.innerText = bookObject.title;

  const labelDescription = document.createElement("p");
  labelDescription.classList.add("text-xs", "text-corn-700");
  labelDescription.innerText = bookObject.author + " - " + bookObject.year;

  const labelContainer = document.createElement("div");
  labelContainer.classList.add("flex", "flex-col", "basis-3/4");
  labelContainer.append(textTitle, labelDescription);

  const container = document.createElement("li");
  container.classList.add(
    "flex",
    "flex-row",
    "items-center",
    "p-3",
    "text-base",
    "font-bold",
    "text-corn-900",
    "bg-corn-50",
    "rounded-lg",
    "hover:bg-corn-100",
    "group",
    "hover:shadow"
  );
  container.append(labelContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("fa", "fa-trash", "p-3", "rounded-full", "hover:bg-corn-200");

  buttonDelete.addEventListener("click", () => {
    removeBookFromCompleted(bookObject.id, books);
  });

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("flex", "flex-row", "basis-1/4", "justify-end");

  if (bookObject.isComplete) {
    const buttonUndone = document.createElement("button");
    buttonUndone.classList.add("fa", "fa-xmark", "p-3", "rounded-full", "hover:bg-corn-200");

    buttonUndone.addEventListener("click", () => {
      undoneBookFromCompleted(bookObject.id, books);
    });

    actionContainer.append(buttonUndone, buttonDelete);
  } else {
    const buttonDone = document.createElement("button");
    buttonDone.classList.add("fa", "fa-check", "p-3", "rounded-full", "hover:bg-corn-200");

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
  document.dispatchEvent(
    new CustomEvent(SEARCH_EVENT, { detail: filterBooks })
  );
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
