"use strict";

// Constants
const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const POSTS_PER_PAGE = 3;
const UPDATE_INTERVAL = 5000; // 5 seconds

// Variables
const lastFetchedIds = {};
const tabEndpoints = {
    top: 'topstories.json',
    new: 'newstories.json',
    ask: 'askstories.json',
    show: 'showstories.json',
    job: 'jobstories.json',
    poll: 'polls.json'
};
let latestTabItemIds = {
    top: null,
    new: null,
    ask: null,
    show: null,
    job: null,
    poll: null
};

// DOM Elements
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const liveUpdateElement = document.getElementById('live-update-container'); // This should be an element in your HTML

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            const currentContent = document.querySelector('.tab-content.active');
            const newContent = document.getElementById(targetTab);
            const notification = document.getElementById(`notification-${targetTab}`);

            // Remove active class from all tabs and tab contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding tab content
            tab.classList.add('active');
            newContent.classList.add('active');

            // Fetch and display data based on the selected tab
            fetchPosts(targetTab);

            // Clear the notification after showing
            if (notification.textContent) {
                notification.style.display = 'none';
            }
        });
    });

    // Initialize with default tab
    fetchPosts('top');

    // Set up live updates
    setInterval(checkForUpdates, UPDATE_INTERVAL);

    // Add event listeners for "Load More" buttons
    document.querySelectorAll('.load-more-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const tab = event.target.id.replace('load-more-', '');
            loadMorePosts(tab);
        });
    });
});

async function fetchPosts(tab) {
    try {
        const response = await fetch(`${BASE_URL}/${tabEndpoints[tab]}`);
        const ids = await response.json();
        const postsList = document.getElementById(`posts-${tab}`);
        postsList.innerHTML = ''; // Clear previous posts

        const lastId = lastFetchedIds[tab] || 0;
        const newPosts = ids.slice(0, 10).filter(id => id > lastId);

        // Update last fetched ID
        if (newPosts.length > 0) {
            lastFetchedIds[tab] = newPosts[0];
        }

        // Show notification if there are new posts
        const notification = document.getElementById(`notification-${tab}`);
        if (newPosts.length > 0) {
            notification.textContent = newPosts.length;
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000); // Hide notification after 5 seconds
        }

        const postPromises = ids.slice(0, 10).map(id => fetchPost(id));
        const posts = await Promise.all(postPromises);

        posts.forEach(post => {
            if (post) {
                displayPost(post, tab);
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function displayPost(post, tab) {
    const postElement = document.createElement('li');
    postElement.classList.add('post');

    const title = post.title || 'Untitled';
    const url = post.url || `https://news.ycombinator.com/item?id=${post.id}`;
    const author = post.by || 'Anonymous';
    const time = new Date(post.time * 1000).toLocaleString();
    const score = post.score || 0;
    const commentsCount = post.descendants || 0;

    postElement.innerHTML = `
        <h2><a href="${url}" target="_blank">${title}</a></h2>
        <div class="post-info">
            ${score} points by ${author} | ${time} | ${commentsCount} comments
        </div>
        <button class="show-comments-button" data-post-id="${post.id}">
            Show Comments
        </button>
        <div class="comments" id="comments-${post.id}" style="display: none;"></div>
    `;

    const postsContainer = document.getElementById(`posts-${tab}`);
    postsContainer.appendChild(postElement);

    // Add event listener to the "Show Comments" button
    const showCommentsButton = postElement.querySelector('.show-comments-button');
    showCommentsButton.addEventListener('click', () => {
        const commentsContainer = document.getElementById(`comments-${post.id}`);
        if (commentsContainer.style.display === 'none') {
            commentsContainer.style.display = 'block';
            showCommentsButton.textContent = 'Hide Comments';
            loadComments(post.id, post.kids);
        } else {
            commentsContainer.style.display = 'none';
            showCommentsButton.textContent = 'Show Comments';
        }
    });
}

async function loadComments(postId, commentIds) {
    const commentsContainer = document.getElementById(`comments-${postId}`);
    if (commentIds && commentIds.length) {
        // Only load the top 3 comments
        const topComments = commentIds.slice(0, 3);
        const comments = await Promise.all(topComments.map(id => fetchPost(id)));
        comments.forEach(comment => {
            if (comment) {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <p><strong>${comment.by}</strong>: ${comment.text}</p>
                `;
                commentsContainer.appendChild(commentElement);
            }
        });
    }
}

async function fetchPost(id) {
    try {
        const response = await fetch(`${BASE_URL}/item/${id}.json`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching post:', error);
    }
}

async function checkForUpdates() {
    try {
        const response = await fetch(`${BASE_URL}/maxitem.json`);
        const maxItemId = await response.json();

        for (const tab in tabEndpoints) {
            const lastId = latestTabItemIds[tab];
            if (lastId === null) {
                latestTabItemIds[tab] = maxItemId;
                continue;
            }

            if (maxItemId > lastId) {
                const newItems = maxItemId - lastId;
                showNotification(`New items in ${tab}: ${newItems}`);
                latestTabItemIds[tab] = maxItemId;
                // Fetch new posts for the updated tab
                fetchPosts(tab);
            }
        }
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    liveUpdateElement.appendChild(notification);

    setTimeout(() => {
        liveUpdateElement.removeChild(notification);
    }, 5000); // Hide notification after 5 seconds
}

async function loadMorePosts(tab) {
    try {
        const response = await fetch(`${BASE_URL}/${tabEndpoints[tab]}`);
        const ids = await response.json();
        const postsList = document.getElementById(`posts-${tab}`);

        const lastId = lastFetchedIds[tab] || 0;
        const nextPosts = ids.slice(10, 20).filter(id => id > lastId);

        // Update last fetched ID
        if (nextPosts.length > 0) {
            lastFetchedIds[tab] = nextPosts[nextPosts.length - 1];
        }

        const postPromises = nextPosts.map(id => fetchPost(id));
        const posts = await Promise.all(postPromises);

        posts.forEach(post => {
            if (post) {
                displayPost(post, tab);
            }
        });
    } catch (error) {
        console.error('Error loading more posts:', error);
    }
}