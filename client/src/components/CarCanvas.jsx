import React, { useRef, useEffect } from 'react';

const CarCanvas = ({ config, onGameOver, setHUDScore }) => {
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
    const speedMultiplier = config.speedMultiplier || 1.001;

    // Road configuration
    const lanes = 3;
    const laneWidth = canvas.width / lanes;

    // Player Entity (Car)
    const player = {
      lane: 1, // 0 = left, 1 = middle, 2 = right
      width: 40,
      height: 70,
      draw() {
        const x = (this.lane * laneWidth) + (laneWidth / 2) - (this.width / 2);
        const y = canvas.height - this.height - 20;

        // Draw car body
        ctx.fillStyle = '#00d2ff';
        ctx.shadowColor = '#00d2ff';
        ctx.shadowBlur = 15;
        ctx.fillRect(x, y, this.width, this.height);
        ctx.shadowBlur = 0;

        // Draw car windshield
        ctx.fillStyle = '#1e5799';
        ctx.fillRect(x + 5, y + 15, this.width - 10, 15);
      },
      moveLeft() {
        if (this.lane > 0) this.lane--;
      },
      moveRight() {
        if (this.lane < lanes - 1) this.lane++;
      }
    };

    const obstacles = [];

    const handleInput = (e) => {
      if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && !e.repeat) {
        player.moveLeft();
      } else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && !e.repeat) {
        player.moveRight();
      }
    };

    window.addEventListener('keydown', handleInput);

    const spawnObstacle = () => {
      const obstacleLane = Math.floor(Math.random() * lanes);
      obstacles.push({
        lane: obstacleLane,
        y: -100, // spawn off screen
        width: 40,
        height: 70,
        passed: false
      });
    };

    const detectCollision = (obs, playerX, playerY) => {
      const obsX = (obs.lane * laneWidth) + (laneWidth / 2) - (obs.width / 2);
      return (
        playerX < obsX + obs.width &&
        playerX + player.width > obsX &&
        playerY < obs.y + obs.height &&
        playerY + player.height > obs.y
      );
    };

    const drawRoad = () => {
      // Background
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lane dividers
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 5;
      ctx.setLineDash([20, 20]);
      
      for (let i = 1; i < lanes; i++) {
        ctx.beginPath();
        // Moving dash effect
        ctx.lineDashOffset = -(frames * currentSpeed) % 40;
        ctx.moveTo(i * laneWidth, 0);
        ctx.lineTo(i * laneWidth, canvas.height);
        ctx.stroke();
      }
      ctx.setLineDash([]); // reset
    };

    const gameLoop = () => {
      if (isGameOver) return;

      // Draw environment
      drawRoad();

      // Update and draw player
      player.draw();
      const playerX = (player.lane * laneWidth) + (laneWidth / 2) - (player.width / 2);
      const playerY = canvas.height - player.height - 20;

      // Spawn obstacles periodically based on frames (simplistic)
      if (frames % Math.floor(80 / (currentSpeed / 5)) === 0) {
        spawnObstacle();
      }

      // Update, remove, and draw obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += currentSpeed;

        if (detectCollision(obs, playerX, playerY)) {
          isGameOver = true;
          setTimeout(() => onGameOver(score), 100);
        }

        if (obs.y > playerY + player.height && !obs.passed) {
          obs.passed = true;
        }

        // Draw obstacle car (red)
        const obsX = (obs.lane * laneWidth) + (laneWidth / 2) - (obs.width / 2);
        ctx.fillStyle = '#ff4757';
        ctx.shadowColor = '#ff4757';
        ctx.shadowBlur = 10;
        ctx.fillRect(obsX, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;

        if (obs.y > canvas.height) {
          obstacles.splice(i, 1);
        }
      }

      // Score and difficulty up
      score += 0.1;
      currentSpeed *= speedMultiplier;
      frames++;
      
      // Update HUD via state
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
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, onGameOver, setHUDScore]);

  return (
    <div className="game-area car-runner">
      <div className="canvas-container">
        <canvas ref={canvasRef} width={400} height={500} style={{ borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }} />
      </div>
      <p style={{ marginTop: '10px', color: '#fff', textAlign: 'center' }}>Use Left / Right Arrows to steer</p>
    </div>
  );
};

export default CarCanvas;
