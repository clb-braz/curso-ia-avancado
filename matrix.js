// Matrix Rain Effect
class MatrixRain {
    constructor() {
        this.canvas = document.getElementById('matrixRain');
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        
        this.initialize();
        window.addEventListener('resize', () => this.initialize());
    }

    initialize() {
        // Set canvas size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Calculate columns
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        
        // Initialize drops
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.floor(Math.random() * -100);
        }
    }

    draw() {
        // Semi-transparent black background to create fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Green text
        this.ctx.fillStyle = '#0F0';
        this.ctx.font = this.fontSize + 'px monospace';
        
        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            // Random character
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            
            // Draw the character
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            
            // Reset drop to top with random delay if it's at the bottom
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            // Move drop down
            this.drops[i]++;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Matrix Rain effect when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const matrix = new MatrixRain();
    matrix.animate();
}); 