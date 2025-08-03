// API Base URL
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// DOM Elements
const postsContainer = document.getElementById('posts-container');
const usersContainer = document.getElementById('users-container');
const albumsContainer = document.getElementById('albums-container');
const searchResults = document.getElementById('search-results');
const searchInput = document.getElementById('search-input');

// Loading indicators
const postsLoading = document.getElementById('posts-loading');
const usersLoading = document.getElementById('users-loading');
const albumsLoading = document.getElementById('albums-loading');

// Utility Functions
function showLoading(loadingElement) {
    loadingElement.classList.remove('hidden');
}

function hideLoading(loadingElement) {
    loadingElement.classList.add('hidden');
}

function showError(container, message) {
    container.innerHTML = `<div class="error">${message}</div>`;
}

function addFadeInAnimation(element) {
    element.classList.add('fade-in');
}

// API Functions
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Posts Functions
async function fetchPosts() {
    showLoading(postsLoading);
    try {
        const posts = await fetchData('/posts');
        displayPosts(posts.slice(0, 12)); // Show first 12 posts
    } catch (error) {
        showError(postsContainer, 'Failed to load posts. Please try again later.');
    } finally {
        hideLoading(postsLoading);
    }
}

function displayPosts(posts) {
    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="error">No posts found.</div>';
        return;
    }

    const postsHTML = posts.map(post => `
        <div class="post-card">
            <h3>${capitalizeTitle(post.title)}</h3>
            <p>${capitalizeFirstLetter(post.body)}</p>
            <div class="post-meta">Post ID: ${post.id} | User ID: ${post.userId}</div>
        </div>
    `).join('');

    postsContainer.innerHTML = postsHTML;
    
    // Add fade-in animation to each card
    const postCards = postsContainer.querySelectorAll('.post-card');
    postCards.forEach((card, index) => {
        setTimeout(() => addFadeInAnimation(card), index * 100);
    });
}

function clearPosts() {
    postsContainer.innerHTML = '';
}

// Users Functions
async function fetchUsers() {
    showLoading(usersLoading);
    try {
        const users = await fetchData('/users');
        displayUsers(users);
    } catch (error) {
        showError(usersContainer, 'Failed to load users. Please try again later.');
    } finally {
        hideLoading(usersLoading);
    }
}

function displayUsers(users) {
    if (users.length === 0) {
        usersContainer.innerHTML = '<div class="error">No users found.</div>';
        return;
    }

    const usersHTML = users.map(user => `
        <div class="user-card">
            <div class="user-avatar">${getInitials(user.name)}</div>
            <h3>${user.name}</h3>
            <p><strong>Username:</strong> ${user.username}</p>
            <p class="email">${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Website:</strong> ${user.website}</p>
            <p><strong>Company:</strong> ${user.company.name}</p>
            <p><strong>City:</strong> ${user.address.city}</p>
        </div>
    `).join('');

    usersContainer.innerHTML = usersHTML;
    
    // Add fade-in animation to each card
    const userCards = usersContainer.querySelectorAll('.user-card');
    userCards.forEach((card, index) => {
        setTimeout(() => addFadeInAnimation(card), index * 100);
    });
}

function clearUsers() {
    usersContainer.innerHTML = '';
}

// Albums Functions
async function fetchAlbums() {
    showLoading(albumsLoading);
    try {
        const albums = await fetchData('/albums');
        const users = await fetchData('/users');
        displayAlbums(albums.slice(0, 15), users); // Show first 15 albums
    } catch (error) {
        showError(albumsContainer, 'Failed to load albums. Please try again later.');
    } finally {
        hideLoading(albumsLoading);
    }
}

function displayAlbums(albums, users) {
    if (albums.length === 0) {
        albumsContainer.innerHTML = '<div class="error">No albums found.</div>';
        return;
    }

    const usersMap = users.reduce((map, user) => {
        map[user.id] = user.name;
        return map;
    }, {});

    const albumsHTML = albums.map(album => `
        <div class="album-card">
            <h3>${capitalizeTitle(album.title)}</h3>
            <div class="album-meta">
                <p>Album ID: ${album.id}</p>
                <p>Created by: ${usersMap[album.userId] || 'Unknown User'}</p>
            </div>
        </div>
    `).join('');

    albumsContainer.innerHTML = albumsHTML;
    
    // Add fade-in animation to each card
    const albumCards = albumsContainer.querySelectorAll('.album-card');
    albumCards.forEach((card, index) => {
        setTimeout(() => addFadeInAnimation(card), index * 100);
    });
}

function clearAlbums() {
    albumsContainer.innerHTML = '';
}

// Search Functions
async function searchPosts(query) {
    if (!query.trim()) {
        searchResults.innerHTML = '<div class="error">Please enter a search term.</div>';
        return;
    }

    try {
        const posts = await fetchData('/posts');
        const filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredPosts.length === 0) {
            searchResults.innerHTML = `<div class="error">No posts found matching "${query}".</div>`;
        } else {
            displaySearchResults(filteredPosts);
        }
    } catch (error) {
        showError(searchResults, 'Search failed. Please try again later.');
    }
}

function displaySearchResults(posts) {
    const resultsHTML = posts.map(post => `
        <div class="post-card">
            <h3>${capitalizeTitle(post.title)}</h3>
            <p>${capitalizeFirstLetter(post.body)}</p>
            <div class="post-meta">Post ID: ${post.id} | User ID: ${post.userId}</div>
        </div>
    `).join('');

    searchResults.innerHTML = resultsHTML;
    
    // Add fade-in animation to each card
    const resultCards = searchResults.querySelectorAll('.post-card');
    resultCards.forEach((card, index) => {
        setTimeout(() => addFadeInAnimation(card), index * 50);
    });
}

// Utility Helper Functions
function capitalizeTitle(title) {
    return title.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

function capitalizeFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
}

// Smooth Scrolling for Navigation
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Posts Event Listeners
    document.getElementById('fetch-posts').addEventListener('click', fetchPosts);
    document.getElementById('clear-posts').addEventListener('click', clearPosts);

    // Users Event Listeners
    document.getElementById('fetch-users').addEventListener('click', fetchUsers);
    document.getElementById('clear-users').addEventListener('click', clearUsers);

    // Albums Event Listeners
    document.getElementById('fetch-albums').addEventListener('click', fetchAlbums);
    document.getElementById('clear-albums').addEventListener('click', clearAlbums);

    // Search Event Listeners
    document.getElementById('search-btn').addEventListener('click', function() {
        const query = searchInput.value;
        searchPosts(query);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            searchPosts(query);
        }
    });

    // Navigation Event Listeners
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });

    // Auto-load posts on page load for demonstration
    setTimeout(() => {
        fetchPosts();
    }, 1000);
});

// Advanced Features

// Function to get random posts
async function getRandomPosts(count = 5) {
    try {
        const posts = await fetchData('/posts');
        const shuffled = posts.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    } catch (error) {
        console.error('Error fetching random posts:', error);
        return [];
    }
}

// Function to get posts by user
async function getPostsByUser(userId) {
    try {
        const posts = await fetchData(`/posts?userId=${userId}`);
        return posts;
    } catch (error) {
        console.error('Error fetching posts by user:', error);
        return [];
    }
}

// Function to get comments for a post
async function getPostComments(postId) {
    try {
        const comments = await fetchData(`/posts/${postId}/comments`);
        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}

// Function to get photos from an album
async function getAlbumPhotos(albumId) {
    try {
        const photos = await fetchData(`/albums/${albumId}/photos`);
        return photos;
    } catch (error) {
        console.error('Error fetching album photos:', error);
        return [];
    }
}

// Error handling and retry mechanism
async function fetchWithRetry(endpoint, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fetchData(endpoint);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}

// Performance monitoring
function measurePerformance(operation, data) {
    const startTime = performance.now();
    return {
        data,
        duration: performance.now() - startTime,
        operation
    };
}

console.log('🚀 API Integration Demo Loaded Successfully!');
console.log('📊 Available endpoints: /posts, /users, /albums, /comments, /photos');
console.log('🔍 Features: Search, Dynamic loading, Error handling, Responsive design');