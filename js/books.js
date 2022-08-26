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
  buttonDelete.classList.add(
    "fa",
    "fa-trash",
    "p-3",
    "rounded-full",
    "hover:bg-corn-200"
  );
  buttonDelete.setAttribute(
    "data-modal-toggle",
    "delete-popup-" + bookObject.id
  );

  createConfirmationDeletePopup(bookObject.id, books);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("flex", "flex-row", "basis-1/4", "justify-end");

  if (bookObject.isComplete) {
    const buttonUndone = document.createElement("button");
    buttonUndone.classList.add(
      "fa",
      "fa-xmark",
      "p-3",
      "rounded-full",
      "hover:bg-corn-200"
    );

    buttonUndone.addEventListener("click", () => {
      undoneBookFromCompleted(bookObject.id, books);
    });

    actionContainer.append(buttonUndone, buttonDelete);
  } else {
    const buttonDone = document.createElement("button");
    buttonDone.classList.add(
      "fa",
      "fa-check",
      "p-3",
      "rounded-full",
      "hover:bg-corn-200"
    );

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

const createConfirmationDeletePopup = (bookId, books) => {
  const modalId = "delete-popup-" + bookId;

  const buttonCancel = document.createElement("button");
  buttonCancel.classList.add(
    "text-gray-500",
    "bg-white",
    "hover:bg-gray-100",
    "focus:ring-4",
    "focus:outline-none",
    "focus:ring-gray-200",
    "rounded-lg",
    "border",
    "border-gray-200",
    "text-sm",
    "font-medium",
    "px-5",
    "py-2.5",
    "hover:text-gray-900",
    "focus:z-10"
  );
  buttonCancel.setAttribute("type", "button");
  buttonCancel.setAttribute("data-modal-toggle", modalId);
  buttonCancel.innerText = "Ngga, batal";

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add(
    "text-white",
    "bg-red-600",
    "hover:bg-red-800",
    "focus:ring-4",
    "focus:outline-none",
    "focus:ring-red-300",
    "font-medium",
    "rounded-lg",
    "text-sm",
    "inline-flex",
    "items-center",
    "px-5",
    "py-2.5",
    "text-center",
    "mr-2"
  );
  buttonDelete.setAttribute("type", "button");
  buttonDelete.setAttribute("data-modal-toggle", modalId);
  buttonDelete.innerText = "Ya, yakin";
  buttonDelete.addEventListener("click", () => {
    removeBookFromCompleted(bookId, books);
  });

  const container = document.createElement("div");
  container.setAttribute("id", modalId);
  container.setAttribute("tabindex", "-1");
  container.classList.add(
    "hidden",
    "overflow-y-auto",
    "overflow-x-hidden",
    "fixed",
    "top-0",
    "right-0",
    "left-0",
    "z-50",
    "md:inset-0",
    "h-modal",
    "md:h-full"
  );

  const popupTemplate = `<div class="relative p-4 w-full max-w-md h-full md:h-auto">
    <div class="relative bg-white rounded-lg shadow">
      <button
        type="button"
        class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
        data-modal-toggle="${modalId}"
      >
        <i class="fa fa-xmark"></i>
        <span class="sr-only">Close modal</span>
      </button>
      <div class="p-6 text-center">
        <i class="fa fa-triangle-exclamation text-5xl p-4"></i>
        <h3
          class="mb-5 text-lg font-normal text-gray-500"
        >
          Apa kamu yakin mau hapus buku ini?
        </h3>
      </div>
    </div>
  </div>`;

  const fragment = document
    .createRange()
    .createContextualFragment(popupTemplate);
  console.log(fragment);
  fragment.children[0].children[0].children[1].append(
    buttonDelete,
    buttonCancel
  );

  container.append(fragment);

  const popupContainer = document.getElementById("popup-container");
  popupContainer.append(container);
};

export { addBook, makeBook, searchBook };
