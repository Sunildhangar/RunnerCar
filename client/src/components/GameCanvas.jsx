import React, { useRef, useEffect } from 'react';

const GameCanvas = ({ config, onGameOver, setHUDScore }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Game state
    let isGameOver = false;
    let score = 0;
    let frames = 0;
    
    // Config injected from backend override
    let currentSpeed = config.obstacleSpeed || 5;
    const gravity = config.gravity || 0.6;
    const jumpForce = config.jumpForce || -10;
    const speedMultiplier = config.speedMultiplier || 1.001;

    // Entities
    const player = {
      x: 50,
      y: canvas.height - 50,
      width: 30,
      height: 30,
      dy: 0,
      isGrounded: false,
      draw() {
        ctx.fillStyle = '#ff6b6b';
        ctx.shadowColor = '#ff6b6b';
        ctx.shadowBlur = 15;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0; // reset
      },
      update() {
        this.y += this.dy;
        
        // Gravity
        if (this.y + this.height < canvas.height) {
          this.dy += gravity;
          this.isGrounded = false;
        } else {
          this.dy = 0;
          this.y = canvas.height - this.height;
          this.isGrounded = true;
        }
      },
      jump() {
        if (this.isGrounded) {
          this.dy = jumpForce;
          this.isGrounded = false;
        }
      }
    };

    const obstacles = [];

    const handleInput = (e) => {
      // jump on Space or Up Arrow and ignore repeating events
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !e.repeat) {
        player.jump();
      }
    };
    
    const handleMouseClick = () => {
       player.jump();
    };

    window.addEventListener('keydown', handleInput);
    canvas.addEventListener('mousedown', handleMouseClick);

    const spawnObstacle = () => {
      // Random obstacle height
      const h = Math.random() < 0.5 ? 30 : 50;
      obstacles.push({
        x: canvas.width,
        y: canvas.height - h,
        width: 20,
        height: h,
        passed: false
      });
    };

    const detectCollision = (obs) => {
      return (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
      );
    };

    const gameLoop = () => {
      if (isGameOver) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background floor line
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.strokeStyle = '#4ecaad';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Update and draw player
      player.update();
      player.draw();

      // Spawn obstacles periodically based on frames (simplistic)
      // Adjusting based on current speed
      if (frames % Math.floor(100 / (currentSpeed / 5)) === 0) {
        spawnObstacle();
      }

      // Update, remove, and draw obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= currentSpeed;

        if (detectCollision(obs)) {
          isGameOver = true;
          setTimeout(() => onGameOver(score), 100);
        }

        if (obs.x + obs.width < player.x && !obs.passed) {
          obs.passed = true;
          // You could add bonus points here
        }

        ctx.fillStyle = '#4ecaad';
        ctx.shadowColor = '#4ecaad';
        ctx.shadowBlur = 10;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;

        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
        }
      }

      // Score and difficulty up
      score += 0.1;
      currentSpeed *= speedMultiplier;
      frames++;
      
      // Update HUD via state (throttled to avoid too many renders or just Math.floor)
      if (frames % 10 === 0) {
        setHUDScore(Math.floor(score));
      }

      // Overlay text internally
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '20px Outfit, sans-serif';
      ctx.fillText(`Score: ${Math.floor(score)}`, 20, 30);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleInput);
      canvas.removeEventListener('mousedown', handleMouseClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, onGameOver, setHUDScore]);

  return (
    <div className="game-area">
      <div className="canvas-container">
        <canvas ref={canvasRef} width={800} height={300} />
      </div>
    </div>
  );
};

export default GameCanvas;
