document.addEventListener('DOMContentLoaded', function() {
    const bookForm = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchBook');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    const searchBookTitle = document.getElementById('searchBookTitle');
    const searchResult = document.getElementById('searchResult');
    const clearSearchButton = document.getElementById('clearSearch')
    const inputBookIsComplete = document.getElementById('inputBookIsComplete');
    const bookSubmitButton = document.getElementById('bookSubmit');
    const bookSubmitButtonText = bookSubmitButton.querySelector('span');
  
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let bookToDelete = null;
  
    const saveBooks = () => {
      localStorage.setItem('books', JSON.stringify(books));
    };
  
    const generateBookItem = (book) => {
        const bookItem = document.createElement('article');
        bookItem.classList.add('book_item');
      
        const titleElem = document.createElement('h3');
        titleElem.textContent = book.title;
        bookItem.appendChild(titleElem);
      
        const authorElem = document.createElement('p');
        authorElem.textContent = `Penulis: ${book.author}`;
        bookItem.appendChild(authorElem);
      
        const yearElem = document.createElement('p');
        yearElem.textContent = `Tahun: ${book.year}`;
        bookItem.appendChild(yearElem);
      
        const actionDiv = document.createElement('div');
        actionDiv.classList.add('action');
      
        const toggleButton = document.createElement('button');
        toggleButton.classList.add('green');
        toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
        toggleButton.addEventListener('click', () => {
          book.isComplete = !book.isComplete;
          renderBooks();
        });
        actionDiv.appendChild(toggleButton);
      
        const editButton = document.createElement('button');
        editButton.classList.add('yellow');
        editButton.textContent = 'Edit Buku';
        editButton.addEventListener('click', () => {
          editBook(book);
        });
        actionDiv.appendChild(editButton);
      
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.textContent = 'Hapus buku';
        deleteButton.addEventListener('click', () => {
          bookToDelete = book;
          if (confirm("Are you sure you want to delete this book?")) {
            books = books.filter(b => b.id !== bookToDelete.id);
            renderBooks();
          }
        });
        actionDiv.appendChild(deleteButton);
      
        bookItem.appendChild(actionDiv);
      
        return bookItem;
      };
      
  
    const renderBooks = () => {
      incompleteBookshelfList.innerHTML = '';
      completeBookshelfList.innerHTML = '';
  
      books.forEach(book => {
        const bookItem = generateBookItem(book);
        if (book.isComplete) {
          completeBookshelfList.appendChild(bookItem);
        } else {
          incompleteBookshelfList.appendChild(bookItem);
        }
      });
  
      saveBooks();
    };
  
    const renderSearchResult = (searchText) => {
      searchResult.innerHTML = '';
  
      const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchText.toLowerCase()));
  
      if (filteredBooks.length === 0) {
        const notFoundMessage = document.createElement('p');
        notFoundMessage.textContent = 'Tidak ada buku yang ditemukan';
        searchResult.appendChild(notFoundMessage);
        searchResult.style.border = 'none';
      } else {
        filteredBooks.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('search_item');

            const titleElem = document.createElement('h3');
            titleElem.textContent = book.title;
            bookItem.appendChild(titleElem);
            
            const authorElem = document.createElement('p');
            authorElem.textContent = `Penulis: ${book.author}`;
            bookItem.appendChild(authorElem)
            
            const yearElem = document.createElement('p');
            yearElem.textContent = `Tahun: ${book.year}`;
            bookItem.appendChild(yearElem);

            const statusElem = document.createElement('p');
            statusElem.textContent = book.isComplete ? 'Rak: Selesai dibaca' : 'Rak: Belum selesai dibaca';
            bookItem.appendChild(statusElem);

            const goToShelfButton = document.createElement('button');
            goToShelfButton.textContent = 'Pergi ke Rak';
            goToShelfButton.classList.add('goToShelf');
            goToShelfButton.addEventListener('click', () => {
                const shelf = book.isComplete ? completeBookshelfList : incompleteBookshelfList;
                const bookElement = Array.from(shelf.children).find(child => child.querySelector('h3').textContent === book.title);
                if (bookElement) {
                  bookElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
            bookItem.appendChild(goToShelfButton);

            searchResult.appendChild(bookItem);
        });

        searchResult.style.border = '1px solid black';
      }
    };
  
    const editBook = (book) => {
      const title = prompt('Edit Judul', book.title);
      const author = prompt('Edit Penulis', book.author);
      const year = prompt('Edit Tahun', book.year);
  
      if (title && author && year) {
        book.title = title;
        book.author = author;
        book.year = parseInt(year);
        renderBooks();
      }
    };
  
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const title = document.getElementById('inputBookTitle').value;
      const author = document.getElementById('inputBookAuthor').value;
      const year = parseInt(document.getElementById('inputBookYear').value);
      const isComplete = document.getElementById('inputBookIsComplete').checked;
  
      const newBook = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
      };
  
      books.push(newBook);
      renderBooks();
      bookForm.reset();
      bookSubmitButtonText.textContent = 'Belum selesai dibaca';
    });
  
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchText = searchBookTitle.value.trim().toLowerCase();
      renderSearchResult(searchText);
    });

    clearSearchButton.addEventListener('click', () => {
        searchResult.innerHTML = '';
        searchBookTitle.value = '';
        searchResult.style.border = 'none';
    })
  
    inputBookIsComplete.addEventListener('change', () => {
      if (inputBookIsComplete.checked) {
        bookSubmitButtonText.textContent = 'Selesai dibaca';
      } else {
        bookSubmitButtonText.textContent = 'Belum selesai dibaca';
      }
    });
  
    renderBooks();
  });
  