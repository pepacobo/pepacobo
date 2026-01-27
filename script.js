document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const pagesContainer = document.querySelector('.pages-container');
    const pages = document.querySelectorAll('.page');
    const indicators = document.querySelectorAll('.indicator');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    const menuLinks = document.querySelectorAll('.menu-link');
    const exploreLink = document.querySelector('.explore-link');
    const nextPageLinks = document.querySelectorAll('.next-page-link');
    
    // State
    let currentPage = 0;
    const totalPages = pages.length;
    let isTransitioning = false;
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50;
    
    // Initialize
    initializePages();
    updateArrows();
    updatePageIndicators();
    setupParallax();
    initCarousels();
    initAnimations(); // <-- AÑADIDO: Inicializar animaciones

    function initializePages() {
        pages.forEach((page, index) => {
            page.classList.remove('active', 'left', 'right', 'previous', 'next');
            page.style.transition = '';
            page.style.transform = '';
            
            if (index === 0) {
                page.classList.add('active');
                page.style.transform = 'translateX(0)';
            } else {
                page.classList.add('right');
                page.style.transform = 'translateX(100%)';
            }
        });
    }
    
    // Intersection Observer para animaciones al entrar en pantalla
    function initAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // se activa cuando el 15% del elemento es visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animar el elemento principal
                    entry.target.classList.add('animated');
                    
                    // Si es una sección de contenido, animar elementos hijos con delays
                    if (entry.target.classList.contains('content-section')) {
                        const titles = entry.target.querySelectorAll('.section-title, .numbered-title, .tools-title');
                        titles.forEach((title, index) => {
                            setTimeout(() => {
                                title.classList.add('animated');
                            }, 100 + (index * 50));
                        });
                        
                        const texts = entry.target.querySelectorAll('.section-text');
                        texts.forEach((text, index) => {
                            setTimeout(() => {
                                text.classList.add('animated');
                            }, 200 + (index * 100));
                        });
                        
                        const toolsGrid = entry.target.querySelector('.tools-grid');
                        if (toolsGrid) {
                            setTimeout(() => {
                                toolsGrid.classList.add('animated');
                            }, 400);
                        }
                        
                        // AÑADIDO: Animar elementos de timeline dentro de content-section
                        const timelineItems = entry.target.querySelectorAll('.timeline-item');
                        timelineItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('animated');
                            }, 300 + (index * 150));
                        });
                    }
                    
                    // Animar imágenes dentro de contenedores
                    if (entry.target.classList.contains('full-width-image-container')) {
                        const images = entry.target.querySelectorAll('img');
                        images.forEach((img, index) => {
                            setTimeout(() => {
                                if (img.complete) {
                                    img.parentElement.classList.add('animated');
                                } else {
                                    img.onload = () => {
                                        img.parentElement.classList.add('animated');
                                    };
                                }
                            }, 300);
                        });
                    }
                    
                    // Animar imágenes flotantes
                    if (entry.target.classList.contains('floating-img')) {
                        setTimeout(() => {
                            entry.target.classList.add('animated');
                        }, 200);
                    }

                    // Animar timeline completo
                    if (entry.target.classList.contains('timeline')) {
                        const timelineItems = entry.target.querySelectorAll('.timeline-item');
                        timelineItems.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('animated');
                            }, 200 + (index * 150));
                        });
                    }
                    
                    // Animar elementos de video y soundcloud
                    if (entry.target.classList.contains('video-section') || 
                        entry.target.classList.contains('soundcloud-section')) {
                        const iframes = entry.target.querySelectorAll('iframe');
                        iframes.forEach((iframe, index) => {
                            setTimeout(() => {
                                iframe.parentElement.parentElement.classList.add('animated');
                            }, 300 + (index * 200));
                        });
                    }
                }
            });
        }, observerOptions);
        
        // Elementos a observar
        const elementsToAnimate = document.querySelectorAll(
            '.content-section, .full-width-image-container, .carousel-container, ' +
            '.video-section, .soundcloud-section, .timeline, .page-links, ' +
            '.tools-grid, .floating-img, .section-title, .numbered-title, ' +
            '.tools-title, .section-text, .carousel-img-container, ' +
            '.timeline-item, .vimeo-embed, .soundcloud-wrapper'
        );
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Función para animar elementos cuando cambia de página - CORREGIDA
    function animatePageOnShow(page) {
        // Pequeño delay para que ocurra después de la transición de página
        setTimeout(() => {
            // Inicializar animaciones para la nueva página
            initAnimations();
            
            // Animar elementos de la página activa
            const pageContent = page.querySelector('.page-content');
            if (pageContent) {
                setTimeout(() => {
                    pageContent.style.animation = 'fadeInUp 0.8s ease-out';
                    pageContent.style.opacity = '1';
                }, 300);
            }
            
            // Animar elementos inmediatamente visibles
            const visibleElements = page.querySelectorAll(
                '.content-section, .section-title, .section-text, .timeline'
            );
            
            visibleElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    setTimeout(() => {
                        element.classList.add('animated');
                        
                        // Si es una sección, animar sus elementos hijos
                        if (element.classList.contains('content-section')) {
                            const childTitles = element.querySelectorAll('.section-title, .numbered-title, .tools-title');
                            childTitles.forEach((title, idx) => {
                                setTimeout(() => {
                                    title.classList.add('animated');
                                }, 100 + (idx * 50));
                            });
                            
                            const childTexts = element.querySelectorAll('.section-text');
                            childTexts.forEach((text, idx) => {
                                setTimeout(() => {
                                    text.classList.add('animated');
                                }, 200 + (idx * 100));
                            });
                            
                            const timelineItems = element.querySelectorAll('.timeline-item');
                            timelineItems.forEach((item, idx) => {
                                setTimeout(() => {
                                    item.classList.add('animated');
                                }, 300 + (idx * 150));
                            });
                        }
                        
                        // Si es un timeline, animar sus items
                        if (element.classList.contains('timeline')) {
                            const timelineItems = element.querySelectorAll('.timeline-item');
                            timelineItems.forEach((item, idx) => {
                                setTimeout(() => {
                                    item.classList.add('animated');
                                }, 200 + (idx * 150));
                            });
                        }
                    }, 100 + (index * 50));
                }
            });
        }, 500);
    }
    
    // Navigation functions
function goToPage(pageIndex) {
    if (isTransitioning || pageIndex === currentPage || pageIndex < 0 || pageIndex >= totalPages) {
        return;
    }
    
    isTransitioning = true;
    

    document.body.classList.add('transitioning');
    

    const direction = pageIndex > currentPage ? 'right' : 'left';
    

    const currentActivePage = pages[currentPage];
    const animatedElements = currentActivePage.querySelectorAll('.animated');
    animatedElements.forEach(el => {
        el.classList.remove('animated');
    });
    

    pages.forEach(page => {
        page.classList.remove('left', 'right', 'active');
    });
    

    if (direction === 'right') {
      
        pages[currentPage].classList.add('left');
        pages[pageIndex].classList.add('right');
    } else {
        
        pages[currentPage].classList.add('right');
        pages[pageIndex].classList.add('left');
    }
    

    setTimeout(() => {

        pages[currentPage].style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        pages[pageIndex].style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        

        if (direction === 'right') {
            pages[currentPage].style.transform = 'translateX(-100%)';
            pages[pageIndex].style.transform = 'translateX(0)';
        } else {
            pages[currentPage].style.transform = 'translateX(100%)';
            pages[pageIndex].style.transform = 'translateX(0)';
        }
    }, 10);
    
    // Update current page
    const oldPage = currentPage;
    currentPage = pageIndex;
    
    // Update UI
    updateArrows();
    updatePageIndicators();
    
    // Reset parallax
    resetParallax();
    
    // Reset carousels
    initCarousels();
    
    // Después de la animación, limpiar y activar nueva página
    setTimeout(() => {
        // Limpiar todas las clases y estilos
        pages.forEach(page => {
            page.classList.remove('left', 'right', 'active');
            page.style.transition = '';
            page.style.transform = '';
        });
        
        // Activar nueva página
        pages[pageIndex].classList.add('active');
        
        // Permitir scroll nuevamente
        document.body.classList.remove('transitioning');
        
        // Trigger animations for new page
        animatePageOnShow(pages[pageIndex]);
        
        // Reset transition lock
        isTransitioning = false;
    }, 500);
}
    
    function nextPage() {
        if (currentPage < totalPages - 1) {
            goToPage(currentPage + 1);
        }
    }
    
    function prevPage() {
        if (currentPage > 0) {
            goToPage(currentPage - 1);
        }
    }
    
    function updateArrows() {
        // Hide left arrow on landing page
        if (currentPage === 0) {
            leftArrow.style.opacity = '0';
            leftArrow.style.pointerEvents = 'none';
        } else {
            leftArrow.style.opacity = '1';
            leftArrow.style.pointerEvents = 'auto';
        }
        
        // Hide right arrow on last page
        if (currentPage === totalPages - 1) {
            rightArrow.style.opacity = '0';
            rightArrow.style.pointerEvents = 'none';
        } else {
            rightArrow.style.opacity = '1';
            rightArrow.style.pointerEvents = 'auto';
        }
        
        // Update arrow background colors
        updateArrowColors();
    }
    
    function updateArrowColors() {
        const currentBgColor = getComputedStyle(pages[currentPage]).backgroundColor;
        
        // Convert RGB to hex
        const rgbToHex = (rgb) => {
            const values = rgb.match(/\d+/g);
            const hex = values.map(x => {
                const hex = parseInt(x).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            });
            return '#' + hex.join('');
        };
        
        const bgColor = rgbToHex(currentBgColor);
        
        // Update arrow background lines
        document.querySelectorAll('.arrow .bg-line').forEach(line => {
            line.style.backgroundColor = bgColor;
        });
    }
    
    function updatePageIndicators() {
        indicators.forEach((indicator, index) => {
            if (index === currentPage) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Parallax effect
    function setupParallax() {
        window.addEventListener('scroll', handleParallax);
        window.addEventListener('resize', handleParallax);
        handleParallax();
    }
    
    function handleParallax() {
        if (!pages[currentPage]) return;
        
        const scrollTop = pages[currentPage].scrollTop;
        const layers = pages[currentPage].querySelectorAll('.parallax-layer');
        
        layers.forEach(layer => {
            const speed = parseFloat(layer.getAttribute('data-speed')) || 0.05;
            const yPos = -(scrollTop * speed);
            layer.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    function resetParallax() {
        // Scroll to top of new page
        pages[currentPage].scrollTop = 0;
        
        // Trigger parallax update
        setTimeout(handleParallax, 10);
    }
    
    // Carousel initialization
    function initCarousels() {
        // Carruseles de texto
        const carousels = document.querySelectorAll('.carousel-line');
        
        carousels.forEach((carousel, index) => {
            // Reset animation
            carousel.style.animation = 'none';
            
            setTimeout(() => {
                if (index === 0) {
                    // Línea 1: slideLeft 30s
                    carousel.style.animation = 'slideLeft 30s linear infinite';
                } else if (index === 1) {
                    // Línea 2: slideRight 25s
                    carousel.style.animation = 'slideRight 25s linear infinite';
                } else if (index === 2) {
                    // Línea 3: slideLeft 40s (más lento que línea 1)
                    carousel.style.animation = 'slideLeft 40s linear infinite';
                }
            }, 10);
        });
        
        // Carruseles de imágenes
        const imgCarousels = document.querySelectorAll('.carousel-img-track');
        
        imgCarousels.forEach((carousel) => {
            // Reset animation
            carousel.style.animation = 'none';
            
            setTimeout(() => {
                if (carousel.classList.contains('carousel-img-top')) {
                    carousel.style.animation = 'slideLeft 30s linear infinite';
                } else if (carousel.classList.contains('carousel-img-bottom')) {
                    carousel.style.animation = 'slideRight 25s linear infinite';
                }
            }, 10);
        });
    }
    
    // Swipe/touch navigation
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        if (!startX) return;
        endX = e.touches[0].clientX;
    }
    
    function handleTouchEnd() {
        if (!startX || !endX) return;
        
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // Swipe left - go to next page
                nextPage();
            } else {
                // Swipe right - go to previous page
                prevPage();
            }
        }
        
        startX = 0;
        endX = 0;
    }
    
    // Keyboard navigation
    function handleKeyDown(e) {
        if (isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                prevPage();
                break;
            case 'ArrowRight':
                nextPage();
                break;
            case 'Home':
                goToPage(0);
                break;
            case 'End':
                goToPage(totalPages - 1);
                break;
            case '1':
                goToPage(0);
                break;
            case '2':
                goToPage(1);
                break;
            case '3':
                goToPage(2);
                break;
            case '4':
                goToPage(3);
                break;
            case '5':
                goToPage(4);
                break;
        }
    }
    
    // Event Listeners
    leftArrow.addEventListener('click', prevPage);
    rightArrow.addEventListener('click', nextPage);
    
    // Menu links
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = parseInt(link.getAttribute('data-target'));
            goToPage(targetPage);
        });
    });
    
    // Explore link
    if (exploreLink) {
        exploreLink.addEventListener('click', (e) => {
            e.preventDefault();
            goToPage(1);
        });
    }
    
    // Next page links
    nextPageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = parseInt(link.getAttribute('data-target'));
            goToPage(targetPage);
        });
    });
    
    // Indicators (for direct navigation)
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToPage(index);
        });
        indicator.style.pointerEvents = 'auto';
    });
    
    // Touch events for swipe navigation
    pagesContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    pagesContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    pagesContainer.addEventListener('touchend', handleTouchEnd);
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyDown);
    
    // Initialize first page animations
    setTimeout(() => {
        animatePageOnShow(pages[0]);
    }, 300);
    
    // Add scroll event to each page for parallax
    pages.forEach(page => {
        page.addEventListener('scroll', handleParallax);
    });
    
    // Re-inicializar animaciones cuando cambia el tamaño de la ventana
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initAnimations();
        }, 250);
    });
    
    // Handle page load with hash
    if (window.location.hash) {
        const pageHash = window.location.hash.substring(1);
        const pageMap = {
            'uiux': 1,
            'graphic': 2,
            'sound': 3,
            'mas': 4
        };
        
        if (pageMap[pageHash] !== undefined) {
            setTimeout(() => goToPage(pageMap[pageHash]), 100);
        }
    }
});