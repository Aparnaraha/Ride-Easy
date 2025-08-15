// Global variables
let selectedService = ""
let currentTestimonial = 0
let testimonialInterval

// DOM elements
const header = document.getElementById("header")
const bookingModal = document.getElementById("booking-modal")
const navLinks = document.querySelectorAll(".nav-link")
const sections = document.querySelectorAll(".section")

// Initialize the website
document.addEventListener("DOMContentLoaded", () => {
  initializeScrollEffects()
  initializeNavigation()
  initializeTestimonialCarousel()
  initializeAnimations()
  setMinDate()
})

// Header scroll effect
function initializeScrollEffects() {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    updateActiveNavLink()
    animateOnScroll()
  })
}

// Navigation functionality
function initializeNavigation() {
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Update active navigation link
function updateActiveNavLink() {
  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("data-section") === current) {
      link.classList.add("active")
    }
  })
}

// Animate sections on scroll
function animateOnScroll() {
  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const windowHeight = window.innerHeight
    const scrollY = window.scrollY

    if (scrollY + windowHeight > sectionTop + 100) {
      section.classList.add("visible")
    }
  })
}

// Testimonial carousel
function initializeTestimonialCarousel() {
  showTestimonial(0)

  testimonialInterval = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % 3
    showTestimonial(currentTestimonial)
  }, 5000)
}

function showTestimonial(index) {
  const testimonials = document.querySelectorAll(".testimonial-card")
  const dots = document.querySelectorAll(".dot")

  testimonials.forEach((testimonial, i) => {
    testimonial.classList.toggle("active", i === index)
  })

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index)
  })

  currentTestimonial = index
}

// Initialize animations
function initializeAnimations() {
  // Trigger initial animation check
  setTimeout(() => {
    animateOnScroll()
  }, 100)
}

// Set minimum date for booking form
function setMinDate() {
  const today = new Date().toISOString().split("T")[0]
  const dateInputs = document.querySelectorAll('input[type="date"]')
  dateInputs.forEach((input) => {
    input.setAttribute("min", today)
  })
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu")
  navMenu.classList.toggle("active")
}

// Booking modal functions
function openBookingModal() {
  bookingModal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeBookingModal() {
  bookingModal.classList.remove("active")
  document.body.style.overflow = "auto"
  selectedService = ""
  updateServiceSelection()
}

// Service selection
function selectService(service) {
  selectedService = service
  openBookingModal()
  updateServiceSelection()
}

function selectModalService(service) {
  selectedService = service
  updateServiceSelection()
}

function updateServiceSelection() {
  const serviceButtons = document.querySelectorAll(".service-selection .service-btn")
  serviceButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-service") === selectedService)
  })
}

// FAQ functionality
function toggleFaq(index) {
  const faqItems = document.querySelectorAll(".faq-item")
  const targetItem = faqItems[index]

  // Close all other FAQs
  faqItems.forEach((item, i) => {
    if (i !== index) {
      item.classList.remove("active")
    }
  })

  // Toggle the clicked FAQ
  targetItem.classList.toggle("active")
}

// Form submissions
function handleBookingSubmit(event) {
  event.preventDefault()

  if (!selectedService) {
    alert("Please select a service")
    return
  }

  const formData = new FormData(event.target)
  const bookingData = {
    service: selectedService,
    name: formData.get("name"),
    mobile: formData.get("mobile"),
    pickup: formData.get("pickup"),
    drop: formData.get("drop"),
    date: formData.get("date"),
    time: formData.get("time"),
  }

  const message = `New Booking Request:
Service: ${bookingData.service}
Name: ${bookingData.name}
Mobile: ${bookingData.mobile}
Pickup: ${bookingData.pickup}
Drop: ${bookingData.drop}
Date: ${bookingData.date}
Time: ${bookingData.time}`

  // Open WhatsApp with the booking details
  window.open(`https://wa.me/919755536829?text=${encodeURIComponent(message)}`, "_blank")

  // Close modal and reset form
  closeBookingModal()
  event.target.reset()

  // Show success message
  showNotification("Booking request sent! We will contact you shortly.", "success")
}

function handleContactSubmit(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const contactData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  }

  // Simulate form submission
  console.log("Contact form submitted:", contactData)

  // Reset form
  event.target.reset()

  // Show success message
  showNotification("Thank you for your message! We will get back to you soon.", "success")
}

// Notification system
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `

  // Add notification styles if not already present
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style")
    styles.id = "notification-styles"
    styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
                z-index: 3000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                border-left: 4px solid #10b981;
            }
            .notification-success {
                border-left-color: #10b981;
            }
            .notification-error {
                border-left-color: #ef4444;
            }
            .notification-content {
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: #64748b;
                cursor: pointer;
                font-size: 1rem;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `
    document.head.appendChild(styles)
  }

  // Add to page
  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove()
    }
  }, 5000)
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === bookingModal) {
    closeBookingModal()
  }
})

// Keyboard navigation
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && bookingModal.classList.contains("active")) {
    closeBookingModal()
  }
})

// Smooth scroll polyfill for older browsers
if (!("scrollBehavior" in document.documentElement.style)) {
  const smoothScrollPolyfill = document.createElement("script")
  smoothScrollPolyfill.src = "https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js"
  document.head.appendChild(smoothScrollPolyfill)
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Apply throttling to scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
    updateActiveNavLink()
    animateOnScroll()
  }, 16),
) // ~60fps
