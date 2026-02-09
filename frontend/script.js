document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       GET CURRENT PAGE
    ========================= */
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    /* =========================
       DARK MODE TOGGLE
    ========================= */
    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
        });
    }

    /* =========================
       LOGIN HANDLER (login.html)
    ========================= */
    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            const userInput = document.getElementById("username");
            const passInput = document.getElementById("password");
            const message = document.getElementById("loginMessage");
            const loader = document.getElementById("loader");

            if (!userInput || !passInput || !message || !loader) return;

            const user = userInput.value.trim();
            const pass = passInput.value.trim();

            message.style.display = "none";
            loader.style.display = "none";

            if (user === "Abhishek" && pass === "0514") {
                message.textContent = "Logging in...";
                message.className = "login-message success";
                message.style.display = "block";
                loader.style.display = "block";

                localStorage.setItem("loggedInUser", user);

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } else {
                message.textContent = "Invalid username or password";
                message.className = "login-message error";
                message.style.display = "block";
            }
        });
    }

    /* =========================
       ACTIVE NAV LINK
    ========================= */
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    /* =========================
       SHOW USERNAME + LOGOUT
    ========================= */
    const loggedInUser = localStorage.getItem("loggedInUser");
    const userArea = document.getElementById("userArea");

    if (loggedInUser && userArea) {
        userArea.innerHTML = `
            <span style="margin-right:10px;">Welcome, ${loggedInUser}</span>
            <a href="#" id="logoutBtn">Logout</a>
        `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }

    /* =========================
       PAGE PROTECTION
    ========================= */
    if (
        ["index.html", "books.html", "favorites.html"].includes(currentPage) &&
        !localStorage.getItem("loggedInUser")
    ) {
        window.location.href = "login.html";
    }

    /* =========================
       SHARED BOOK DATA
    ========================= */
    const books = [
        {
            title: "Atomic Habits",
            author: "James Clear",
            category: "science",
            description: "A practical guide to building good habits and breaking bad ones."
        },
        {
            title: "Clean Code",
            author: "Robert C. Martin",
            category: "technology",
            description: "A handbook of agile software craftsmanship."
        },
        {
            title: "The Alchemist",
            author: "Paulo Coelho",
            category: "literature",
            description: "A philosophical story about following your dreams."
        },
        {
            title: "Brief History of Time",
            author: "Stephen Hawking",
            category: "science",
            description: "An exploration of cosmology and the universe."
        }
    ];

    function getFavorites() {
        return JSON.parse(localStorage.getItem("favorites")) || [];
    }

    function toggleFavorite(title) {
        let favorites = getFavorites();
        favorites = favorites.includes(title)
            ? favorites.filter(f => f !== title)
            : [...favorites, title];

        localStorage.setItem("favorites", JSON.stringify(favorites));
        highlightFavorites();
    }

    function highlightFavorites() {
        const favorites = getFavorites();
        document.querySelectorAll(".fav-btn").forEach(btn => {
            btn.textContent = favorites.includes(btn.dataset.title) ? "❤️" : "🤍";
            btn.classList.toggle("active", favorites.includes(btn.dataset.title));
        });
    }

    /* =========================
       BOOKS PAGE (books.html)
    ========================= */
    const booksGrid = document.getElementById("booksGrid");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const resultInfo = document.getElementById("resultInfo");

    const modal = document.getElementById("bookModal");
    const closeModal = document.getElementById("closeModal");

    if (booksGrid && searchInput && categoryFilter) {

        function displayBooks(list) {
            booksGrid.innerHTML = "";

            if (list.length === 0) {
                booksGrid.innerHTML = `<p class="no-results">No books found 📚</p>`;
                if (resultInfo) resultInfo.textContent = "Showing 0 books";
                return;
            }

            if (resultInfo) resultInfo.textContent = `Showing ${list.length} book(s)`;

            list.forEach(book => {
                booksGrid.innerHTML += `
                    <div class="book-card" data-title="${book.title}">
                        <h3>${book.title}</h3>
                        <p>${book.author}</p>
                        <small>${book.category}</small>
                        <button class="fav-btn" data-title="${book.title}">🤍</button>
                    </div>
                `;
            });

            highlightFavorites();
        }

        function filterBooks() {
            const searchText = searchInput.value.toLowerCase();
            const category = categoryFilter.value;

            const filtered = books.filter(book =>
                (book.title.toLowerCase().includes(searchText) ||
                 book.author.toLowerCase().includes(searchText)) &&
                (category === "all" || book.category === category)
            );

            displayBooks(filtered);
        }

        booksGrid.addEventListener("click", function (e) {

            if (e.target.classList.contains("fav-btn")) {
                toggleFavorite(e.target.dataset.title);
                return;
            }

            const card = e.target.closest(".book-card");
            if (!card) return;

            const book = books.find(b => b.title === card.dataset.title);
            if (!book) return;

            document.getElementById("modalTitle").textContent = book.title;
            document.getElementById("modalAuthor").textContent = book.author;
            document.getElementById("modalCategory").textContent = book.category;
            document.getElementById("modalDescription").textContent = book.description;

            modal.classList.add("show");
        });

        closeModal?.addEventListener("click", () => modal.classList.remove("show"));
        modal?.addEventListener("click", e => {
            if (e.target === modal) modal.classList.remove("show");
        });

        displayBooks(books);
        searchInput.addEventListener("input", filterBooks);
        categoryFilter.addEventListener("change", filterBooks);
    }

    /* =========================
       FAVORITES PAGE (favorites.html)
    ========================= */
    const favoritesGrid = document.getElementById("favoritesGrid");

    if (favoritesGrid) {
        const favorites = getFavorites();

        if (favorites.length === 0) {
            favoritesGrid.innerHTML = `<p class="no-results">No favorites yet ❤️</p>`;
        } else {
            books
                .filter(book => favorites.includes(book.title))
                .forEach(book => {
                    favoritesGrid.innerHTML += `
                        <div class="book-card">
                            <h3>${book.title}</h3>
                            <p>${book.author}</p>
                            <small>${book.category}</small>
                            <button class="fav-btn active">❤️</button>
                        </div>
                    `;
                });
        }
    }

});
