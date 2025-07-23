 let currentSection = 'home';
   let currentRating = 0;
   let isMobileMenuOpen = false;

  
   const loader = document.querySelector('.starms-loader');
   const sections = document.querySelectorAll('.starms-section');
   const navLinks = document.querySelectorAll('.starms-nav-link');
   const mobileNavLinks = document.querySelectorAll('.starms-nav-mobile-link');
   const mobileMenuBtn = document.querySelector('.starms-nav-mobile-btn');
   const mobileMenu = document.querySelector('.starms-nav-mobile');

    function showToast(message) {
     alert(message);
    }

    function showLoader(callback) {
     loader.classList.add('active');
      setTimeout(() => {
       callback();
        loader.classList.remove('active');
      }, 1000);
    }

    
    async function saveReview(review) {
      const formData = new FormData();
      formData.append("entry.608345727", review.Name);     
      formData.append("entry.1159487446", review.Rating); 
      formData.append("entry.1638391418", review.Comment); 

      try {
        const response = await fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLScfnyY0lFySpdxq9Q2m355eQ-3_a5TDjQxeShnJ-FiNnnpFxA/formResponse", {
          method: "POST",
          mode: "no-cors", 
          body: formData
        });
        return true; 
      } catch (err) {
        console.error("Error submitting review:", err);
        return false;
      }
    }

    async function getReviews() {
      try {
        const response = await fetch("https://opensheet.elk.sh/12tv0KTQO0LXiNyl6ku6FdqBFL4KguFVMoGeHNRCBZnc/Form%20Responses%202");
        const reviews = await response.json();
        return reviews.map(review => ({
         name: review.Name || "Anonymous",
         rating: parseInt(review.Rating || 0),
         comment: review.Comment || "",
         date: review.Timestamp || ""
        }));
      } catch (error) {
        console.error("Error getting reviews:", error);
        return [];
      }
    } 
   
    async function getReviews() {
      try {
        const response = await fetch("https://opensheet.elk.sh/12tv0KTQO0LXiNyl6ku6FdqBFL4KguFVMoGeHNRCBZnc/Form%20Responses%202");
        const reviews = await response.json();
        return reviews.map(review => ({
         name: review.Name || "Anonymous",
         rating: parseInt(review.Rating || 0),
         comment: review.Comment || "",
         date: review.Timestamp || ""
        }));
      } catch (error) {
        console.error("Error getting reviews:", error);
        return [];
      }
    } 
   
    function saveSubscription(email) {
      try {
       const subscriptions = JSON.parse(localStorage.getItem('starms-subscriptions') || '[]');
       if (subscriptions.includes(email)) return false;
       subscriptions.push(email);
       localStorage.setItem('starms-subscriptions', JSON.stringify(subscriptions));
       return true;
      } catch {
        return false;
      }
    }

    function closeMobileMenu() {
      mobileMenu.style.display = 'none';
      isMobileMenuOpen = false;
    }

    function navigateToSection(sectionId) {
      showLoader(() => {
        sections.forEach(section => section.classList.remove('active'));

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          targetSection.classList.add('active');
        }

        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }

        currentSection = sectionId;
        window.location.hash = sectionId;

        closeMobileMenu();
        window.scrollTo(0, 0);

        if (sectionId === 'reviews') {
          loadReviews();
        }
      });
    }

    function toggleMobileMenu() {
      isMobileMenuOpen = !isMobileMenuOpen;
      mobileMenu.style.display = isMobileMenuOpen ? 'block' : 'none';
    }

    async function loadReviews() {
      const reviewsList = document.getElementById('reviews-list');
      const reviews = await getReviews();

      if (reviews.length === 0) {
        reviewsList.innerHTML = `
          <div class="starms-no-reviews">
            <i class="fas fa-comments"></i>
            <h4>No Reviews Yet</h4>
            <p>Be the first to share your experience with STARMS Catering!</p>
          </div>`;
        return;
      }

      reviewsList.innerHTML = reviews.map(review => {
        const stars = Array.from({ length: 5 }, (_, i) =>
          `<i class="fas fa-star ${i < review.rating ? '' : 'inactive'}"></i>`
        ).join('');

        return `
          <div class="starms-review">
            <div class="starms-review-header">
              <span class="starms-review-author">${escapeHtml(review.name)}</span>
              <span class="starms-review-date">${review.date}</span>
            </div>
            <div class="starms-review-rating">${stars}</div>
            <p class="starms-review-comment">${escapeHtml(review.comment)}</p>
          </div>`;
      }).join('');
    }
  

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function handleReviewSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const name = formData.get('name');
      const comment = formData.get('comment');

      if (currentRating === 0) {
        showToast("Please select a rating before submitting your review.");
        return;
      }
  
      const review = {
        name,
        rating: currentRating,
        comment,
        date: new Date().toLocaleDateString()
      };

      if (saveReview(review)) {
        showToast("Thank you for your feedback!");
        event.target.reset();
        currentRating = 0;
        updateStarRating();
        loadReviews();
      } else {
        showToast("Sorry, there was an error saving your review. Please try again.");
      }
    }

    function updateStarRating() {
      const stars = document.querySelectorAll('#star-rating i');
      stars.forEach((star, index) => {
        star.classList.toggle('active', index < currentRating);
      });
    }

    function toggleFaq(faqItem) {
      faqItem.classList.toggle('active');
    }

    document.getElementById('contact-form').addEventListener('submit', async function (e) { e.preventDefault();

    const form = e.target;
    const data = new FormData(form);
    const action = "https://formspree.io/f/mkgbvynj"; 

    try {
      const response = await fetch(action, {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showToast("Thanks! Your message was sent.");
        form.reset();
      } else {
         showToast("Oops! Something went wrong.");
      }
      } catch (error) {
        showToast("Error sending message. Check internet.");
      }
    });

  
    function handleNewsletterSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const email = formData.get('email');

      const success = saveSubscription(email);
      if (success) {
        showToast("Thank you for subscribing to our newsletter!");
        event.target.reset();
      } else {
        showToast("You are already subscribed to our newsletter.");
      }
    }

    document.addEventListener('DOMContentLoaded', function () {
      navLinks.forEach(link => {
        link.addEventListener('click', e => {
          const sectionId = e.target.dataset.section;
          navigateToSection(sectionId);
        });
      });

      mobileNavLinks.forEach(link => {
        link.addEventListener('click', e => {
          const sectionId = e.target.dataset.section;
          navigateToSection(sectionId);
        });
      });

      const gallery = document.getElementById("gallery-items");
      const totalImages = 22;
      const folder = "images/"; // Folder where your images are stored

      for (let i = 1; i <= totalImages; i++) {
        const div = document.createElement("div");
        div.className = "starms-gallery-item";
        div.setAttribute("data-aos", "fade-up");
  
        const img = document.createElement("img");
        img.src = `${folder}event${i}.jpg`;
        img.alt = `Event ${i}`;
        img.loading = "lazy";

        div.appendChild(img);
        gallery.appendChild(div);
      }

      AOS.init({
        duration: 800,
      });

      AOS.refresh();

      const eventTypeSelect = document.getElementById("event-type");
      const otherEventGroup = document.getElementById("other-event-group");
      const otherEventInput = document.getElementById("other-event-type");

      eventTypeSelect.addEventListener("change", function () {
        if (this.value === "other") {
          otherEventGroup.style.display = "block";
        } else {
          otherEventGroup.style.display = "none";
          otherEventInput.value = "";
        }
      });

      // Restore section from hash if available
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(hash)) {
        navigateToSection(hash);
      } else {
        navigateToSection('home'); // default
      }
    });

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    document.querySelectorAll('[data-section]').forEach(button => {
      button.addEventListener('click', e => {
        const sectionId = e.target.dataset.section || e.target.closest('[data-section]').dataset.section;
        if (sectionId) navigateToSection(sectionId);
      });
    });

    document.querySelectorAll('.starms-footer-links button').forEach(button => {
      button.addEventListener('click', e => {
       const sectionId = e.target.dataset.section;
        if (sectionId) navigateToSection(sectionId);
      });
    });

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', handleReviewSubmit);
    }

    const starRating = document.getElementById('star-rating');
    if (starRating) {
      starRating.addEventListener('click', e => {
        if (e.target.tagName === 'I') {
          currentRating = parseInt(e.target.dataset.rating);
          updateStarRating();
        }
      });

      starRating.addEventListener('mouseover', e => {
        if (e.target.tagName === 'I') {
          const hoverRating = parseInt(e.target.dataset.rating);
          const stars = starRating.querySelectorAll('i');
          stars.forEach((star, index) => {
            star.classList.toggle('active', index < hoverRating);
          });
        }
      });

      starRating.addEventListener('mouseleave', () => {
        updateStarRating();
      });
    }

    document.querySelectorAll('.starms-faq-question').forEach(question => {
      question.addEventListener('click', () => {
       const faqItem = question.closest('.starms-faq-item');
        toggleFaq(faqItem);
      });
    });

    document.addEventListener('click', e => {
      if (isMobileMenuOpen && !e.target.closest('.starms-nav')) {
        closeMobileMenu();
      }
    });

    loadReviews();

    const eventDateInput = document.getElementById('event-date');
    if (eventDateInput) {
      const today = new Date().toISOString().split('T')[0];
      eventDateInput.min = today;
    }
