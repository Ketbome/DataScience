import React, { useEffect, useRef } from 'react';

const EmojiRain = () => {
  const containerRef = useRef(null);
  const emoji = ['😞','😭','🥺','😣', '😪'];
  let circles = [];

  useEffect(() => {
    containerRef.current.style.height = `${document.documentElement.scrollHeight}px`;
    containerRef.current.style.width = `${document.documentElement.scrollWidth}px`;

    for (let i = 0; i < 15; i++) {
      addCircle(i * 300, [10 + 0, window.innerWidth], emoji[Math.floor(Math.random() * emoji.length)]);
      addCircle(i * 300, [10 + 0, -window.innerWidth], emoji[Math.floor(Math.random() * emoji.length)]);
      addCircle(i * 300, [10 - 200, -window.innerWidth], emoji[Math.floor(Math.random() * emoji.length)]);
      addCircle(i * 300, [10 + 200, window.innerWidth], emoji[Math.floor(Math.random() * emoji.length)]);
      addCircle(i * 300, [10 - 400, -window.innerWidth], emoji[Math.floor(Math.random() * emoji.length)]);
      addCircle(i * 300, [10 + 400, window.innerWidth], emoji[Math.floor(Math.random() * emoji.length)]);
      addCircle(i * 300, [10 - 600, -window.innerWidth], emoji[Math.floor(Math.random() * emoji.length)]);
      addCircle(i * 300, [10 + 600, window.innerWidth], emoji[Math.floor(Math.random() * emoji.length)]);
    }

    function addCircle(delay, range, color) {
      setTimeout(function() {
        var c = new Circle(range[0] + Math.random() * range[1], -40 + Math.random() * 4, color, {
          x: -0.15 + Math.random() * 0.3,
          y: 1 + Math.random() * 1
        }, range);
        circles.push(c);
      }, delay);
    }

    function Circle(x, y, c, v, range) {
      var _this = this;
      this.x = x;
      this.y = y;
      this.color = c;
      this.v = v;
      this.range = range;
      this.element = document.createElement('span');
      this.element.style.opacity = 0;
      this.element.style.position = 'absolute';
      this.element.style.fontSize = '35px';
      this.element.style.color = 'hsl('+(Math.random()*360|0)+',80%,50%)';
      this.element.innerHTML = c;
      containerRef.current.appendChild(this.element);

      this.update = function() {
        if (_this.y > 800) {
          _this.y = -40 + Math.random() * 4;
          _this.x = _this.range[0] + Math.random() * _this.range[1];
        } else {
          _this.y += _this.v.y;
          _this.x += _this.v.x;
        }
        this.element.style.opacity = 1;
        this.element.style.transform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
        this.element.style.webkitTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
        this.element.style.mozTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
      };
    }

    function animate() {
      for (var i in circles) {
        circles[i].update();
      }
      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh',
        pointerEvents: 'none',
      }} 
    />
  );
}

export default EmojiRain;