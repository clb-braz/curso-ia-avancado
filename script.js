// Modal functionality
function showContact() {
    const modal = document.getElementById('contact-modal');
    modal.style.display = 'block';
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function hideContact() {
    const modal = document.getElementById('contact-modal');
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('contact-modal');
    if (event.target === modal) {
        hideContact();
    }
}

// Parallax effect
document.addEventListener('mousemove', (e) => {
    const parallaxBg = document.getElementById('parallax-bg');
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const moveX = (mouseX - windowWidth / 2) * 0.02;
    const moveY = (mouseY - windowHeight / 2) * 0.02;
    
    parallaxBg.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

// Fade in animations on scroll
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Initial check
});

// Neural network background animation
document.addEventListener('DOMContentLoaded', function() {
    const background = document.querySelector('.neural-background');
    
    // Create neural network effect
    function createNeuralEffect() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.opacity = '0.3';
        
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resize);
        resize();
        
        const nodes = [];
        const numNodes = 50;
        
        // Create nodes
        for (let i = 0; i < numNodes; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw nodes
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                
                // Bounce off walls
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
                
                // Draw connections
                nodes.forEach(otherNode => {
                    const dx = otherNode.x - node.x;
                    const dy = otherNode.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(otherNode.x, otherNode.y);
                        ctx.strokeStyle = `rgba(153, 51, 255, ${1 - distance / 200})`;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                });
                
                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#ff3366';
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        return canvas;
    }
    
    background.appendChild(createNeuralEffect());
});

// Add hover effects to cards
document.querySelectorAll('.card').forEach((card, index) => {
    // Efeito de entrada sequencial
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 100);

    // Efeito de hover 3D
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${-rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-10px)
            scale(1.02)
        `;
    });
    
    // Reset da transformação
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        }, 100);
    });
});

// Carousel auto-scroll
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.showcase-carousel');
    let isScrolling = false;
    let scrollInterval;

    function startAutoScroll() {
        if (!isScrolling) {
            scrollInterval = setInterval(() => {
                carousel.scrollBy({
                    left: 320,
                    behavior: 'smooth'
                });

                // Reset to start when reaching the end
                if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
                    setTimeout(() => {
                        carousel.scrollTo({
                            left: 0,
                            behavior: 'smooth'
                        });
                    }, 1000);
                }
            }, 4000);
            isScrolling = true;
        }
    }

    function stopAutoScroll() {
        clearInterval(scrollInterval);
        isScrolling = false;
    }

    // Start auto-scroll
    startAutoScroll();

    // Pause on hover or touch
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
    carousel.addEventListener('touchstart', stopAutoScroll);
    carousel.addEventListener('touchend', startAutoScroll);
});

// Parallax effect for showcase items
document.addEventListener('mousemove', (e) => {
    const showcaseItems = document.querySelectorAll('.showcase-content');
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    showcaseItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemX = rect.left + rect.width / 2;
        const itemY = rect.top + rect.height / 2;

        const moveX = (mouseX - itemX) * 0.01;
        const moveY = (mouseY - itemY) * 0.01;

        item.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Video placeholders click effect
document.querySelectorAll('.video-item').forEach(video => {
    video.addEventListener('click', () => {
        video.classList.add('video-clicked');
        setTimeout(() => {
            video.classList.remove('video-clicked');
        }, 200);
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Efeito de glow que segue o mouse nos cards especiais
document.querySelectorAll('.special-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
        
        // Efeito 3D suave
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((e.clientX - rect.left - centerX) / centerX) * 10;
        const rotateX = -((e.clientY - rect.top - centerY) / centerY) * 10;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-15px)
            scale(1.03)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
    
    // Adiciona classe de animação com delay
    setTimeout(() => {
        card.classList.add('card-animated');
    }, 500);
});

// Efeito de revelação suave dos detalhes
document.querySelectorAll('.special-card').forEach(card => {
    const details = card.querySelector('.card-details');
    
    card.addEventListener('mouseenter', () => {
        details.style.display = 'block';
        setTimeout(() => {
            details.style.opacity = '1';
            details.style.transform = 'translateY(0)';
        }, 50);
    });
    
    card.addEventListener('mouseleave', () => {
        details.style.opacity = '0';
        details.style.transform = 'translateY(10px)';
        setTimeout(() => {
            details.style.display = 'none';
        }, 300);
    });
});

// Cyber Intro Animations
document.addEventListener('DOMContentLoaded', () => {
    const cyberIntro = document.querySelector('.cyber-intro');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.cyber-text').forEach((text, index) => {
                    text.style.animationDelay = `${index * 0.2}s`;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    if (cyberIntro) {
        observer.observe(cyberIntro);
    }

    // Glitch effect on hover
    const glitchTitle = document.querySelector('.glitch');
    if (glitchTitle) {
        glitchTitle.addEventListener('mouseover', () => {
            glitchTitle.style.animation = 'none';
            glitchTitle.offsetHeight; // Trigger reflow
            glitchTitle.style.animation = null;
        });
    }

    // Parallax effect for circuit lines
    const circuitLines = document.querySelector('.circuit-lines');
    if (circuitLines) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const moveX = (clientX - innerWidth / 2) / innerWidth * 20;
            const moveY = (clientY - innerHeight / 2) / innerHeight * 20;
            
            circuitLines.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    // Binary overlay animation
    const binaryOverlay = document.querySelector('.binary-overlay');
    if (binaryOverlay) {
        let binaryString = '';
        for (let i = 0; i < 100; i++) {
            binaryString += Math.random() > 0.5 ? '1' : '0';
        }
        binaryOverlay.setAttribute('data-binary', binaryString);
    }
}); 
