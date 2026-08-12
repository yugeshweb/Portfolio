/* Mobile navigation */
const menuButton = document.querySelector('#menu-icon-js');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navOverlay = document.querySelector('#nav-tc-js');

function closeNav() {
	menuIcon.classList.remove('bx-x');
	navbar.classList.remove('open');
	navOverlay.classList.remove('nav-touch-close-open');
}

if (menuButton) {
	menuButton.addEventListener('click', () => {
		menuIcon.classList.toggle('bx-x');
		navbar.classList.toggle('open');
		navOverlay.classList.toggle('nav-touch-close-open');
	});
}

if (navOverlay) {
	navOverlay.addEventListener('click', closeNav);
}

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && navbar && navbar.classList.contains('open')) {
		closeNav();
	}
});

/* Hide the header on scroll down, reveal it on scroll up */
const header = document.getElementById('header');
let previousScroll = window.pageYOffset;

window.addEventListener('scroll', () => {
	const currentScroll = window.pageYOffset;

	if (currentScroll === 0) {
		header.classList.remove('scrolled');
		header.style.top = '0';
		previousScroll = currentScroll;
		return;
	}

	header.classList.add('scrolled');

	if (!navOverlay.classList.contains('nav-touch-close-open')) {
		header.style.top = previousScroll > currentScroll ? '0' : '-100px';
	}

	previousScroll = currentScroll;
});

/* Contact form — posts to Netlify Forms */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
	const formSection = document.querySelector('.form-section');
	const submitConfirmation = document.querySelector('.contact-submit-after');
	const confirmationButton = document.querySelector('.csa-ok');
	const nameInput = document.getElementById('name');
	const emailInput = document.getElementById('email');
	const messageInput = document.getElementById('message');
	const fieldError = document.querySelector('.error');
	const emailError = document.querySelector('.email-error');
	const sendError = document.querySelector('.send-error');
	const submitSpinner = document.querySelector('.contact-load');
	const submitLabel = document.querySelector('.submit-text');

	const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	function setBusy(busy) {
		submitSpinner.classList.toggle('show', busy);
		submitLabel.classList.toggle('hide', busy);
	}

	function resetForm() {
		submitConfirmation.classList.remove('show');
		formSection.classList.remove('hide');
		setBusy(false);
	}

	function showConfirmation() {
		submitConfirmation.classList.add('show');
		formSection.classList.add('hide');
		setBusy(false);
	}

	async function handleSubmit(event) {
		event.preventDefault();

		const hasName = nameInput.value.trim() !== '';
		const hasMessage = messageInput.value.trim() !== '';
		const emailValue = emailInput.value.trim();

		fieldError.classList.remove('error-show');
		emailError.classList.remove('error-show');
		sendError.classList.remove('error-show');

		if (!hasName || !hasMessage || emailValue === '') {
			fieldError.classList.add('error-show');
			return;
		}

		if (!isValidEmail(emailValue)) {
			emailError.classList.add('error-show');
			return;
		}

		setBusy(true);

		try {
			const response = await fetch('/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(new FormData(contactForm)).toString()
			});

			if (!response.ok) throw new Error('Submission failed: ' + response.status);

			contactForm.reset();
			showConfirmation();
		} catch (error) {
			setBusy(false);
			sendError.classList.add('error-show');
		}
	}

	contactForm.addEventListener('submit', handleSubmit);

	if (confirmationButton) {
		confirmationButton.addEventListener('click', resetForm);
	}
}

/* Gallery lightbox */
const lightbox = document.getElementById('lightbox');

if (lightbox) {
	const lightboxImage = document.querySelector('.lightbox-image');
	const lightboxClose = document.querySelector('.lightbox-close');
	const lightboxPrev = document.querySelector('.lightbox-prev');
	const lightboxNext = document.querySelector('.lightbox-next');
	const galleryItems = document.querySelectorAll('.gallery-item');

	const images = [...galleryItems]
		.map((item) => item.querySelector('img'))
		.filter(Boolean);

	let currentIndex = 0;

	function showImage(index) {
		currentIndex = (index + images.length) % images.length;
		lightboxImage.src = images[currentIndex].src;
		lightboxImage.alt = images[currentIndex].alt;
	}

	function openLightbox(index) {
		showImage(index);
		lightbox.classList.add('show');
		document.body.style.overflow = 'hidden';
	}

	function closeLightbox() {
		lightbox.classList.remove('show');
		document.body.style.overflow = '';
	}

	galleryItems.forEach((item, index) => {
		item.addEventListener('click', () => openLightbox(index));
	});

	lightboxClose.addEventListener('click', closeLightbox);
	lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
	lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) {
			closeLightbox();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (!lightbox.classList.contains('show')) return;

		if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
		else if (event.key === 'ArrowRight') showImage(currentIndex + 1);
		else if (event.key === 'Escape') closeLightbox();
	});
}
