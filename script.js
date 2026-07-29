/* ==========================================================================
   BlogSphere - Day 4: JavaScript Tasks
   Form Validation, DOM Manipulation, Event Handling & Dynamic Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. INITIALIZE & SEED LOCAL STORAGE POSTS
    // ----------------------------------------------------------------------
    const defaultPosts = [
        {
            id: 101,
            title: "Getting Started with Full Stack Web Development",
            author: "Bhavik Pathak",
            category: "Web Dev",
            imageUrl: "images/web_dev.png",
            excerpt: "Learn how modern frontend interfaces communicate seamlessly with backend REST APIs built using Node.js and Express.",
            content: "Full stack web development spans both client-side user interfaces and server-side backend logic. In this comprehensive guide, we examine how HTML5, CSS3, and Vanilla JavaScript construct responsive user interfaces while Node.js and Express handle routing, middleware processing, and data persistence.",
            date: "July 27, 2026",
            readTime: "5 min read"
        },
        {
            id: 102,
            title: "Building Scalable RESTful APIs with Node.js & Express",
            author: "Bhavik Pathak",
            category: "Express",
            imageUrl: "images/express_backend.png",
            excerpt: "A step-by-step guide to structuring clean routes, middleware handlers, CORS configuration, and JSON endpoint logic.",
            content: "Express.js simplifies Node.js web server development by providing a fast, unopinionated routing framework. Today we explore modular router design, error handling middleware, JSON request body parsing, and status code standards for professional APIs.",
            date: "July 26, 2026",
            readTime: "4 min read"
        },
        {
            id: 103,
            title: "Designing Responsive UI Components with Semantic HTML5",
            author: "Bhavik Pathak",
            category: "Frontend",
            imageUrl: "images/web_dev.png",
            excerpt: "Master semantic markup, navigation structures, and accessible form inputs to craft user-friendly web applications.",
            content: "Semantic HTML5 tags like header, main, nav, section, article, and footer improve document structure, SEO indexing, and screen reader accessibility. Pair them with modern CSS Flexbox and Grid layouts to create responsive components for any viewport.",
            date: "July 25, 2026",
            readTime: "6 min read"
        }
    ];

    // Helper: Retrieve posts from LocalStorage or seed defaults
    function getStoredPosts() {
        const stored = localStorage.getItem('blogsphere_posts');
        if (!stored) {
            localStorage.setItem('blogsphere_posts', JSON.stringify(defaultPosts));
            return defaultPosts;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            return defaultPosts;
        }
    }

    // Helper: Save posts to LocalStorage
    function savePosts(posts) {
        localStorage.setItem('blogsphere_posts', JSON.stringify(posts));
    }

    // ----------------------------------------------------------------------
    // 2. HOMEPAGE BLOG CARDS & CATEGORY FILTERING (DOM & EVENTS)
    // ----------------------------------------------------------------------
    const postsContainer = document.getElementById('posts-container');
    const categoryChips = document.querySelectorAll('.category-chip');

    if (postsContainer) {
        renderBlogCards('All');

        // Attach Click Event Listeners to Category Filter Chips
        categoryChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                // Remove active class from all chips
                categoryChips.forEach(c => c.classList.remove('active'));

                // Add active class to clicked chip
                const target = e.currentTarget;
                target.classList.add('active');

                // Get category name
                const category = target.textContent.trim();
                renderBlogCards(category);
            });
        });
    }

    // Render Blog Cards Dynamically into DOM
    function renderBlogCards(filterCategory = 'All') {
        if (!postsContainer) return;
        const posts = getStoredPosts();
        postsContainer.innerHTML = '';

        const filtered = filterCategory === 'All'
            ? posts
            : posts.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

        if (filtered.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <h3>No Blog Articles Found</h3>
                    <p>No articles found for the "${filterCategory}" category yet.</p>
                    <a href="add-blog.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Create First Article</a>
                </div>
            `;
            return;
        }

        filtered.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            card.id = `blog-card-${post.id}`;

            const initials = post.author.split(' ').map(n => n[0]).join('').toUpperCase() || 'BP';

            card.innerHTML = `
                <div class="card-banner-wrapper">
                    <img src="${post.imageUrl || 'images/web_dev.png'}" alt="${escapeHtml(post.title)}" class="card-banner" onerror="this.src='images/web_dev.png'">
                </div>
                <div class="card-body">
                    <div class="card-meta">
                        <span class="card-tag">${escapeHtml(post.category)}</span>
                        <time datetime="${post.date}">${escapeHtml(post.date)}</time>
                        <span>&bull; ${post.readTime || '4 min read'}</span>
                    </div>
                    <h3 class="card-title">${escapeHtml(post.title)}</h3>
                    <p class="card-excerpt">${escapeHtml(post.excerpt)}</p>
                    <div class="card-footer">
                        <div class="author-info">
                            <div class="author-avatar">${initials}</div>
                            <span class="author-name">${escapeHtml(post.author)}</span>
                        </div>
                        <button class="delete-btn" data-id="${post.id}" title="Delete Post">🗑️</button>
                    </div>
                </div>
            `;

            postsContainer.appendChild(card);
        });

        // Attach event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const postId = parseInt(e.currentTarget.getAttribute('data-id'));
                deletePost(postId, filterCategory);
            });
        });
    }

    function deletePost(id, currentFilter) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            let posts = getStoredPosts();
            posts = posts.filter(p => p.id !== id);
            savePosts(posts);
            renderBlogCards(currentFilter);
            showToast('Blog post deleted successfully', 'info');
        }
    }

    // ----------------------------------------------------------------------
    // 3. DAY 4 TASK: ADD BLOG FORM VALIDATION & INTERACTION
    // ----------------------------------------------------------------------
    const blogForm = document.getElementById('create-blog-form');

    if (blogForm) {
        const titleInput = document.getElementById('blog-title');
        const authorInput = document.getElementById('blog-author');
        const categorySelect = document.getElementById('blog-category');
        const imageInput = document.getElementById('blog-image');
        const excerptInput = document.getElementById('blog-excerpt');
        const contentInput = document.getElementById('blog-content');

        // Add Live Character Counters for Excerpt and Content
        setupCharacterCounter(excerptInput, 150);
        setupCharacterCounter(contentInput, 1500);

        // Real-Time Input Validation Event Listeners
        [titleInput, authorInput, categorySelect, imageInput, excerptInput, contentInput].forEach(field => {
            if (!field) return;

            field.addEventListener('input', () => {
                validateField(field);
            });

            field.addEventListener('blur', () => {
                validateField(field);
            });
        });

        // Form Submission Event Listener
        blogForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Run full form validation
            const isTitleValid = validateField(titleInput);
            const isAuthorValid = validateField(authorInput);
            const isCategoryValid = validateField(categorySelect);
            const isImageValid = validateField(imageInput);
            const isExcerptValid = validateField(excerptInput);
            const isContentValid = validateField(contentInput);

            const isFormValid = isTitleValid && isAuthorValid && isCategoryValid && isImageValid && isExcerptValid && isContentValid;

            if (!isFormValid) {
                showToast('⚠️ Please fix the highlighted errors before submitting.', 'error');
                // Focus first invalid element
                const firstInvalid = blogForm.querySelector('.input-error');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Calculate estimated read time based on word count
            const wordCount = contentInput.value.trim().split(/\s+/).length;
            const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

            // Create New Blog Post Object
            const newPost = {
                id: Date.now(),
                title: titleInput.value.trim(),
                author: authorInput.value.trim(),
                category: categorySelect.value,
                imageUrl: imageInput.value.trim() || 'images/web_dev.png',
                excerpt: excerptInput.value.trim(),
                content: contentInput.value.trim(),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime: `${readTimeMinutes} min read`
            };

            // Save to LocalStorage
            const posts = getStoredPosts();
            posts.unshift(newPost);
            savePosts(posts);

            showToast('🎉 Blog post published successfully! Redirecting...', 'success');

            // Reset form and redirect to home after 1.5s
            blogForm.reset();
            clearValidationStates([titleInput, authorInput, categorySelect, imageInput, excerptInput, contentInput]);

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1400);
        });

        // Form Reset Listener
        blogForm.addEventListener('reset', () => {
            setTimeout(() => {
                clearValidationStates([titleInput, authorInput, categorySelect, imageInput, excerptInput, contentInput]);
                showToast('Form fields cleared', 'info');
            }, 50);
        });
    }

    // ----------------------------------------------------------------------
    // 4. VALIDATION HELPER FUNCTIONS
    // ----------------------------------------------------------------------
    function validateField(field) {
        if (!field) return true;
        const id = field.id;
        const value = field.value.trim();
        let errorMessage = '';

        switch (id) {
            case 'blog-title':
                if (!value) {
                    errorMessage = 'Blog title is required.';
                } else if (value.length < 5) {
                    errorMessage = 'Blog title must be at least 5 characters long.';
                }
                break;

            case 'blog-author':
                if (!value) {
                    errorMessage = 'Author name is required.';
                } else if (value.length < 3) {
                    errorMessage = 'Author name must be at least 3 characters long.';
                }
                break;

            case 'blog-category':
                if (!value) {
                    errorMessage = 'Please select a blog category.';
                }
                break;

            case 'blog-image':
                if (value && !isValidUrlOrPath(value)) {
                    errorMessage = 'Please enter a valid URL (https://...) or image path (images/...).';
                }
                break;

            case 'blog-excerpt':
                if (!value) {
                    errorMessage = 'Short summary / excerpt is required.';
                } else if (value.length < 10) {
                    errorMessage = 'Excerpt must be at least 10 characters long.';
                }
                break;

            case 'blog-content':
                if (!value) {
                    errorMessage = 'Full article content is required.';
                } else if (value.length < 20) {
                    errorMessage = 'Article content must be at least 20 characters long.';
                }
                break;
        }

        if (errorMessage) {
            setFieldError(field, errorMessage);
            return false;
        } else {
            setFieldSuccess(field);
            return true;
        }
    }

    function setFieldError(field, message) {
        field.classList.remove('input-success');
        field.classList.add('input-error');

        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.innerHTML = `⚠️ ${message}`;
    }

    function setFieldSuccess(field) {
        field.classList.remove('input-error');
        field.classList.add('input-success');

        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function clearValidationStates(fields) {
        fields.forEach(field => {
            if (!field) return;
            field.classList.remove('input-error', 'input-success');
            const err = field.parentNode.querySelector('.error-message');
            if (err) err.remove();
            const counter = field.parentNode.querySelector('.char-counter');
            if (counter) counter.textContent = '';
        });
    }

    function isValidUrlOrPath(string) {
        if (string.startsWith('images/') || string.startsWith('./images/')) return true;
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    }

    function setupCharacterCounter(inputElement, maxLen) {
        if (!inputElement) return;

        let counter = inputElement.parentNode.querySelector('.char-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'char-counter';
            inputElement.parentNode.appendChild(counter);
        }

        const updateCount = () => {
            const currentLen = inputElement.value.length;
            counter.textContent = `${currentLen} / ${maxLen} characters`;
            if (currentLen > maxLen) {
                counter.style.color = '#ef4444';
            } else {
                counter.style.color = '#64748b';
            }
        };

        inputElement.addEventListener('input', updateCount);
        updateCount();
    }

    // ----------------------------------------------------------------------
    // 5. TOAST NOTIFICATION BANNER (DOM INTERACTION)
    // ----------------------------------------------------------------------
    function showToast(message, type = 'info') {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        toastContainer.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            dismissToast(toast);
        });

        setTimeout(() => {
            dismissToast(toast);
        }, 4000);
    }

    function dismissToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }

    // Helper: HTML Escape
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
