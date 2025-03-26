console.log("✅ script.js is loaded and running!");

// Ensure JavaScript runs after the DOM loads
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded!");

    // === FILE STORAGE SYSTEM ===
    const filesBtn = document.getElementById("files-btn");
    const fileMenu = document.getElementById("file-menu");
    const fileInput = document.getElementById("file-input");
    const uploadBtn = document.getElementById("upload-btn");
    const fileList = document.getElementById("file-list");
    const noFilesMessage = document.getElementById("no-files-message");

    if (!filesBtn || !fileMenu || !fileInput || !uploadBtn || !fileList) {
        console.error("❌ One or more file elements are missing!");
        return;
    }

    console.log("✅ File elements detected.");

    let menuOpen = false; // Track menu state

    // === Toggle File Library Menu ===
    filesBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents event bubbling issues
        console.log("📁 Files Library button clicked!");

        menuOpen = !menuOpen;
        if (menuOpen) {
            fileMenu.style.display = "block";
            fileMenu.style.height = "auto"; // Ensures it expands fully
            setTimeout(() => {
                fileMenu.style.opacity = "1";
                fileMenu.style.transform = "translateY(0)";
            }, 10);
        } else {
            fileMenu.style.opacity = "0";
            fileMenu.style.transform = "translateY(-10px)";
            setTimeout(() => {
                fileMenu.style.display = "none";
                fileMenu.style.height = "0";
            }, 300);
        }
    });

    // Prevent the menu from closing when clicking inside it
    fileMenu.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Close menu when clicking anywhere else on the document
    document.addEventListener("click", function (event) {
        if (menuOpen && !fileMenu.contains(event.target) && event.target !== filesBtn) {
            console.log("📂 Closing File Menu...");
            menuOpen = false;
            fileMenu.style.opacity = "0";
            fileMenu.style.transform = "translateY(-10px)";
            setTimeout(() => {
                fileMenu.style.display = "none";
                fileMenu.style.height = "0";
            }, 300);
        }
    });

    // === Function to Fetch and Display Files ===
    async function fetchFiles() {
        try {
            const response = await fetch("/files");
            const data = await response.json();

            fileList.innerHTML = ""; // Clear the file list
            if (!data.files || data.files.length === 0) {
                noFilesMessage.style.display = "block";
            } else {
                noFilesMessage.style.display = "none";
                data.files.forEach(file => {
                    const listItem = document.createElement("li");
                    listItem.textContent = file;

                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "❌";
                    deleteBtn.classList.add("delete-btn");

                    deleteBtn.addEventListener("click", async function () {
                        console.log(`🗑️ Deleting file: ${file}`);
                        await fetch(`/delete/${file}`, { method: "DELETE" });
                        fetchFiles(); // Refresh file list
                    });

                    listItem.appendChild(deleteBtn);
                    fileList.appendChild(listItem);
                });
            }
        } catch (error) {
            console.error("❌ Error fetching files:", error);
        }
    }

    fetchFiles(); // Load files when the page starts

    // === Handle File Upload ===
    uploadBtn.addEventListener("click", async function () {
        const file = fileInput.files[0];
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        console.log(`📄 Uploading file: ${file.name}`);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/upload", { method: "POST", body: formData });
            if (!response.ok) throw new Error("Upload failed");

            fetchFiles(); // Refresh file list
            fileInput.value = "";
        } catch (error) {
            console.error("❌ File upload error:", error);
            alert("Failed to upload file.");
        }
    });

    console.log("✅ File Storage System Ready!");

    // === CHATBOT SYSTEM ===
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const messages = document.getElementById("messages");

    if (!chatForm || !chatInput) {
        console.error("❌ Chat elements NOT found!");
        return;
    }

    console.log("✅ Chatbot elements detected.");

    // === Handle Chat Form Submission WITHOUT RELOADING PAGE ===
    chatForm.addEventListener("submit", async function (e) {
        e.preventDefault(); // ✅ Prevents page reload

        const message = chatInput.value.trim();
        if (!message) return;

        addUserMessage(message);
        chatInput.value = ""; // Clear input field

        try {
            const response = await fetch("/api/ask-ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: message }),
            });

            const data = await response.json();
            if (data.reply) {
                addAIMessage(data.reply);
            } else {
                console.error("❌ No reply from AI.");
            }
        } catch (error) {
            console.error("❌ Error communicating with AI:", error);
        }
    });

    // === Function to display user messages ===
    function addUserMessage(message) {
        const userMessage = document.createElement("li");
        userMessage.classList.add("user-message");
        userMessage.textContent = "👤 You: " + message;
        messages.appendChild(userMessage);
    }

    // === Function to display AI messages ===
    function addAIMessage(message) {
        const aiMessage = document.createElement("li");
        aiMessage.classList.add("ai-message");
        aiMessage.textContent = "🤖 AI: " + message;
        messages.appendChild(aiMessage);
    }

    console.log("✅ Chatbot System Ready!");

    // === Intersection Observer for Animations ===
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.transitionDelay = `${entry.target.dataset.delay}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.feature-card, .mockup, .hero-content')
        .forEach(el => observer.observe(el));

    // === Smooth Scroll Implementation ===
    const smoothScroll = new SmoothScroll('a[href*="#"]', {
        speed: 800,
        speedAsDuration: true,
        easing: 'easeInOutCubic'
    });

    // === Custom Cursor Implementation ===
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // === Navbar Scroll Effect ===
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !navbar.classList.contains('scrolled')) {
            navbar.classList.add('scrolled');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scrolled')) {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // === Waitlist Form Handling ===
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', () => {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'waitlist-modal fade-in';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Join the Waitlist</h2>
                    <p>Be among the first to experience Sanitas.AI</p>
                    <form id="waitlist-form">
                        <input type="email" placeholder="Enter your email" required>
                        <button type="submit" class="cta-button">Join Now</button>
                    </form>
                </div>
            `;

            // Add modal to page
            document.body.appendChild(modal);
            setTimeout(() => modal.classList.add('visible'), 10);

            // Close modal functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('visible');
                setTimeout(() => modal.remove(), 300);
            });

            // Form submission
            const form = modal.querySelector('#waitlist-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                
                // Show loading state
                const button = form.querySelector('button');
                const originalText = button.textContent;
                button.innerHTML = '<div class="loading-animation"></div>';
                
                try {
                    // Here you would typically send the email to your backend
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
                    
                    // Show success message
                    modal.querySelector('.modal-content').innerHTML = `
                        <h2>Thank You!</h2>
                        <p>You're on the list! We'll notify you when Sanitas.AI launches.</p>
                        <button class="cta-button close-modal">Close</button>
                    `;
                } catch (error) {
                    button.textContent = originalText;
                    alert('Something went wrong. Please try again.');
                }
            });
        });
    });

    // === Parallax Effect for Hero Section ===
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    }

    // === Dynamic Feature Icon Animation ===
    document.querySelectorAll('.feature-icon').forEach(icon => {
        icon.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // === Add CSS styles for modal ===
    const styles = document.createElement('style');
    styles.textContent = `
        .waitlist-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }

        .waitlist-modal.visible {
            opacity: 1;
        }

        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            position: relative;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }

        .waitlist-modal.visible .modal-content {
            transform: translateY(0);
        }

        .close-modal {
            position: absolute;
            top: 1rem;
            right: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
            border: none;
            background: none;
        }

        #waitlist-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1rem;
        }

        #waitlist-form input {
            padding: 0.8rem;
            border: 2px solid #eee;
            border-radius: 10px;
            font-size: 1rem;
        }

        .loading-animation {
            width: 20px;
            height: 20px;
            border: 2px solid #fff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
    `;

    document.head.appendChild(styles);
});
