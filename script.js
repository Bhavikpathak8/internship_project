/* ==========================================================================
   BlogSphere - Day 4 & Day 5: JavaScript & Express API Integration
   Form Validation, DOM Manipulation, Event Handling & Express GET/POST APIs
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Default posts fallback dataset
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

    // Helper: LocalStorage Fallback
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

    function savePosts(posts) {
        localStorage.setItem('blogsphere_posts', JSON.stringify(posts));
    }

    // ----------------------------------------------------------------------
    // 1. HOMEPAGE BLOG CARDS & CATEGORY FILTERING (EXPRESS GET /api/blogs)
    // ----------------------------------------------------------------------
    const postsContainer = document.getElementById('posts-container');
    const categoryChips = document.querySelectorAll('.category-chip');
    const searchInput = document.getElementById('search-input');

    if (postsContainer) {
        fetchAndRenderBlogs('All');

        // Attach Click Event Listeners to Category Filter Chips
        categoryChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                categoryChips.forEach(c => c.classList.remove('active'));
                const target = e.currentTarget;
                target.classList.add('active');

                const category = target.textContent.trim();
                const searchQuery = searchInput ? searchInput.value.trim() : '';
                fetchAndRenderBlogs(category, searchQuery);
            });
        });

        // Day 7 Task: Live Search Event Listener
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                const activeChip = document.querySelector('.category-chip.active');
                const activeCategory = activeChip ? activeChip.textContent.trim() : 'All';

                searchTimeout = setTimeout(() => {
                    fetchAndRenderBlogs(activeCategory, query);
                }, 250);
            });
        }
    }

    // Fetch Posts from Express GET /api/blogs (Day 7 View Blogs Task)
    async function fetchAndRenderBlogs(filterCategory = 'All', searchQuery = '') {
        if (!postsContainer) return;
        postsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⏳</div>
                <h3>Loading Articles from Express Server...</h3>
            </div>
        `;

        try {
            let url = '/api/blogs?';
            if (filterCategory && filterCategory !== 'All') {
                url += `category=${encodeURIComponent(filterCategory)}&`;
            }
            if (searchQuery) {
                url += `search=${encodeURIComponent(searchQuery)}&`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                renderBlogCards(result.data, filterCategory, searchQuery);
                if (!searchQuery && filterCategory === 'All') {
                    savePosts(result.data);
                }
            } else {
                renderBlogCards(getStoredPosts(), filterCategory, searchQuery);
            }
        } catch (error) {
            console.warn('[Frontend API] Express server fetch failed, falling back to LocalStorage:', error);
            renderBlogCards(getStoredPosts(), filterCategory, searchQuery);
        }
    }

    // Render Blog Cards into DOM
    function renderBlogCards(posts, filterCategory = 'All', searchQuery = '') {
        if (!postsContainer) return;
        postsContainer.innerHTML = '';

        let filtered = filterCategory === 'All'
            ? posts
            : posts.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.excerpt.toLowerCase().includes(q) ||
                p.author.toLowerCase().includes(q)
            );
        }

        if (filtered.length === 0) {
            postsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <h3>No Blog Articles Found</h3>
                    <p>No articles found for ${searchQuery ? `search "${searchQuery}"` : `category "${filterCategory}"`}.</p>
                    <a href="add-blog.html" class="btn btn-primary btn-sm" style="margin-top: 1rem;">Create First Article</a>
                </div>
            `;
            return;
        }

        filtered.forEach(post => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            card.id = `blog-card-${post.id}`;

            const initials = post.author ? post.author.split(' ').map(n => n[0]).join('').toUpperCase() : 'BP';

            card.innerHTML = `
                <div class="card-banner-wrapper" data-id="${post.id}" style="cursor: pointer;">
                    <img src="${post.imageUrl || 'images/web_dev.png'}" alt="${escapeHtml(post.title)}" class="card-banner" onerror="this.src='images/web_dev.png'">
                </div>
                <div class="card-body">
                    <div class="card-meta">
                        <span class="card-tag">${escapeHtml(post.category)}</span>
                        <time datetime="${post.date}">${escapeHtml(post.date)}</time>
                        <span>&bull; ${post.readTime || '4 min read'}</span>
                    </div>
                    <h3 class="card-title" data-id="${post.id}" style="cursor: pointer;">${escapeHtml(post.title)}</h3>
                    <p class="card-excerpt">${escapeHtml(post.excerpt)}</p>
                    <div class="card-footer">
                        <div class="author-info">
                            <div class="author-avatar">${initials}</div>
                            <span class="author-name">${escapeHtml(post.author)}</span>
                        </div>
                        <div class="card-actions">
                            <button class="action-btn read-btn read-more-btn" data-id="${post.id}" title="Read Full Article">
                                👁️
                            </button>
                            <a href="add-blog.html?id=${post.id}" class="action-btn edit-btn" title="Edit Article">
                                ✏️
                            </a>
                            <button class="action-btn delete-btn" data-id="${post.id}" title="Delete Article">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            `;

            postsContainer.appendChild(card);
        });

        // Day 7 View Blogs Task: Open Article Modal on Card Title / Banner / Read button click
        document.querySelectorAll('.card-title, .card-banner-wrapper, .read-more-btn').forEach(elem => {
            elem.addEventListener('click', (e) => {
                const postId = parseInt(e.currentTarget.getAttribute('data-id'));
                if (postId) openArticleModal(postId, posts);
            });
        });

        // Delete event handler
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const postId = parseInt(e.currentTarget.getAttribute('data-id'));
                deletePost(postId, filterCategory);
            });
        });
    }

    // Day 7 View Blogs Task: Article Reader Modal Functionality
    const articleModal = document.getElementById('article-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalContentWrapper = document.getElementById('modal-content-wrapper');

    async function openArticleModal(id, currentPostsList) {
        if (!articleModal || !modalContentWrapper) return;

        let article = currentPostsList ? currentPostsList.find(p => p.id === id) : null;

        if (!article) {
            try {
                const response = await fetch(`/api/blogs/${id}`);
                const result = await response.json();
                if (result.success) article = result.data;
            } catch (_) { }
        }

        if (!article) return;

        const initials = article.author ? article.author.split(' ').map(n => n[0]).join('').toUpperCase() : 'BP';

        modalContentWrapper.innerHTML = `
            <div class="modal-article-header">
                <span class="modal-article-tag">${escapeHtml(article.category)}</span>
                <h2 class="modal-article-title">${escapeHtml(article.title)}</h2>
                <div class="modal-article-meta">
                    <div class="author-avatar" style="width: 28px; height: 28px; font-size: 0.75rem;">${initials}</div>
                    <span><strong>${escapeHtml(article.author)}</strong></span>
                    <span>&bull;</span>
                    <time>${escapeHtml(article.date)}</time>
                    <span>&bull;</span>
                    <span>${escapeHtml(article.readTime || '4 min read')}</span>
                </div>
            </div>
            <img src="${article.imageUrl || 'images/web_dev.png'}" alt="${escapeHtml(article.title)}" class="modal-article-image" onerror="this.src='images/web_dev.png'">
            <div class="modal-article-body">
                ${escapeHtml(article.content || article.excerpt)}
            </div>
        `;

        articleModal.classList.add('active');
        articleModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeArticleModal() {
        if (!articleModal) return;
        articleModal.classList.remove('active');
        articleModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeArticleModal);
    }

    if (articleModal) {
        articleModal.addEventListener('click', (e) => {
            if (e.target === articleModal) closeArticleModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && articleModal && articleModal.classList.contains('active')) {
            closeArticleModal();
        }
    });

    async function deletePost(id, currentFilter) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            try {
                // Send DELETE HTTP Request to Express Server API
                const response = await fetch(`/api/blogs/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    showToast('🗑️ Blog post deleted successfully!', 'info');
                } else {
                    console.warn(`[Frontend API] Delete request returned status ${response.status}`);
                }
            } catch (err) {
                console.warn('[Frontend API] Express DELETE failed, updating LocalStorage state:', err);
            }

            // Sync LocalStorage state
            let posts = getStoredPosts();
            posts = posts.filter(p => p.id !== id);
            savePosts(posts);

            // Re-render blog cards
            fetchAndRenderBlogs(currentFilter);
        }
    }

    // ----------------------------------------------------------------------
    // 2. DAY 4/5/8 ADD & EDIT BLOG FORM VALIDATION & EXPRESS API ROUTE
    // ----------------------------------------------------------------------
    const blogForm = document.getElementById('create-blog-form');

    if (blogForm) {
        const titleInput = document.getElementById('blog-title');
        const authorInput = document.getElementById('blog-author');
        const categorySelect = document.getElementById('blog-category');
        const imageInput = document.getElementById('blog-image');
        const excerptInput = document.getElementById('blog-excerpt');
        const contentInput = document.getElementById('blog-content');

        // Check if editing existing post via URL query parameter ?id=... (Day 8 Task)
        const urlParams = new URLSearchParams(window.location.search);
        const editPostId = urlParams.get('id') ? parseInt(urlParams.get('id'), 10) : null;

        if (editPostId) {
            setupEditMode(editPostId);
        }

        async function setupEditMode(id) {
            const formHeaderTitle = document.querySelector('.form-header h2');
            const formHeaderDesc = document.querySelector('.form-header p');
            const submitBtn = blogForm.querySelector('button[type="submit"]');

            if (formHeaderTitle) formHeaderTitle.innerHTML = '✏️ Edit Blog Post';
            if (formHeaderDesc) formHeaderDesc.innerHTML = 'Modify article details below and click update to save changes.';
            if (submitBtn) submitBtn.innerHTML = '💾 Save & Update Article';

            try {
                const response = await fetch(`/api/blogs/${id}`);
                const result = await response.json();

                if (result.success && result.data) {
                    const post = result.data;
                    titleInput.value = post.title || '';
                    authorInput.value = post.author || '';
                    categorySelect.value = post.category || '';
                    imageInput.value = post.imageUrl || '';
                    excerptInput.value = post.excerpt || '';
                    contentInput.value = post.content || '';
                } else {
                    // LocalStorage fallback pre-fill
                    const posts = getStoredPosts();
                    const post = posts.find(p => p.id === id);
                    if (post) {
                        titleInput.value = post.title || '';
                        authorInput.value = post.author || '';
                        categorySelect.value = post.category || '';
                        imageInput.value = post.imageUrl || '';
                        excerptInput.value = post.excerpt || '';
                        contentInput.value = post.content || '';
                    }
                }
            } catch (err) {
                console.warn('[Frontend API] Could not fetch post for editing from Express server:', err);
            }
        }

        // Character Counters
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
        blogForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Client-side validation check
            const isTitleValid = validateField(titleInput);
            const isAuthorValid = validateField(authorInput);
            const isCategoryValid = validateField(categorySelect);
            const isImageValid = validateField(imageInput);
            const isExcerptValid = validateField(excerptInput);
            const isContentValid = validateField(contentInput);

            const isFormValid = isTitleValid && isAuthorValid && isCategoryValid && isImageValid && isExcerptValid && isContentValid;

            if (!isFormValid) {
                showToast('⚠️ Please fix the highlighted errors before submitting.', 'error');
                const firstInvalid = blogForm.querySelector('.input-error');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const submitBtn = blogForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : (editPostId ? '💾 Save & Update Article' : '🚀 Publish Article');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = editPostId ? '⏳ Updating Article...' : '⏳ Publishing to Express API...';
            }

            const blogPayload = {
                title: titleInput.value.trim(),
                author: authorInput.value.trim(),
                category: categorySelect.value,
                imageUrl: imageInput.value.trim() || 'images/web_dev.png',
                excerpt: excerptInput.value.trim(),
                content: contentInput.value.trim()
            };

            try {
                const targetUrl = editPostId ? `/api/blogs/${editPostId}` : '/api/blogs';
                const httpMethod = editPostId ? 'PUT' : 'POST';

                // Send POST or PUT Request to Express Server Route (Day 5 & Day 8 Tasks)
                const response = await fetch(targetUrl, {
                    method: httpMethod,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(blogPayload)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    const msg = editPostId
                        ? '🎉 Blog post updated successfully! Redirecting...'
                        : '🎉 Blog post published successfully to Express API! Redirecting...';
                    showToast(msg, 'success');

                    // Also sync with LocalStorage
                    let posts = getStoredPosts();
                    if (editPostId) {
                        posts = posts.map(p => p.id === editPostId ? { ...p, ...result.data } : p);
                    } else {
                        posts.unshift(result.data);
                    }
                    savePosts(posts);

                    blogForm.reset();
                    clearValidationStates([titleInput, authorInput, categorySelect, imageInput, excerptInput, contentInput]);

                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1400);
                } else {
                    const errorMsg = result.message || (result.errors ? result.errors.join(' ') : 'Failed to save post');
                    showToast(`⚠️ Server Validation Error: ${errorMsg}`, 'error');
                }
            } catch (err) {
                console.warn('[Frontend API] Express API request failed, saving to LocalStorage fallback:', err);

                // Fallback to client-side creation/update if backend offline
                let posts = getStoredPosts();
                if (editPostId) {
                    posts = posts.map(p => p.id === editPostId ? { ...p, ...blogPayload } : p);
                } else {
                    const fallbackPost = {
                        id: Date.now(),
                        ...blogPayload,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        readTime: '4 min read'
                    };
                    posts.unshift(fallbackPost);
                }
                savePosts(posts);

                showToast('🎉 Article saved locally! Redirecting...', 'success');
                blogForm.reset();

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1400);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });

        // Reset Event Listener
        blogForm.addEventListener('reset', () => {
            setTimeout(() => {
                clearValidationStates([titleInput, authorInput, categorySelect, imageInput, excerptInput, contentInput]);
                showToast('Form fields cleared', 'info');
            }, 50);
        });
    }

    // ----------------------------------------------------------------------
    // 3. VALIDATION HELPER FUNCTIONS
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
    // 4. TOAST NOTIFICATION BANNER
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
