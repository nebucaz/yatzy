import { Component, OnInit, Input, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
// HostListener

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss']
})
export class ConfettiComponent implements OnInit {
  @Input() bgColor: string;
  @Input() start: boolean;
  @Output() confettiStatus = new EventEmitter<any>();

  //private canvas: ElementRef
  private ctx: any; //! : CanvasRenderingContext2D;
  private canvas: any;
  private animReq: any;
  private cx = 0;
  private cy = 0;

  private confetti: any[] = [];
  private confettiCount = 300;
  private gravity = 0.7;
  private terminalVelocity = 5;
  private drag = 0.075;

  /*
  private colors = [
      { front: 'red', back: 'darkred' },
      { front: 'green', back: 'darkgreen' },
      { front: 'blue', back: 'darkblue' },
      { front: 'yellow', back: 'darkyellow' },
      { front: 'orange', back: 'darkorange' },
      { front: 'pink', back: 'darkpink' },
      { front: 'purple', back: 'darkpurple' },
      { front: 'turquoise', back: 'darkturquoise' }];
*/
private colors = [
   // { front: '#FFD700', back: '#DAA520' }, // gold:
    { front: '#c0c0c0', back: '#A9A9A9' }, // silver
    { front: '#eeeeee', back: '#D3D3D3' }, // white
    { front: 'pink', back: 'darkpink' },
    { front: '#F5DEB3', back: '#D2B48C' }, // wheat/tan
    { front: '#DEB887', back: '#A0522D' }, //  	burlywood/sienna

   // { front: 'red', back: 'darkred' },
   // { front: 'green', back: 'darkgreen' },
    { front: '#FA8072', back: '#FFA07A' } // salmon
    ]

  constructor(private el: ElementRef) {
      this.bgColor = 'white';
      this.start = false;
  }

  ngOnInit(): void {
      //console.log("oninit");
      //console.log(this.el.nativeElement.style);

      this.canvas = document.createElement("canvas");
      this.canvas.id = "confetti";
      //this.canvas.className = 'confetti-canvas';
      //this.canvas.style.border = '2px solid blue';
      //this.canvas.style.backgroundColor = 'blue';
      //this.canvas.style.zIndex = "20";
      //canvas.style.position = "absolute";
      //this.canvas.style.top = "0";

      this.el.nativeElement.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
      this.initConfetti();
      this.render();
  }

  resizeCanvas = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.cx = this.ctx.canvas.width / 2;
      this.cy = this.ctx.canvas.height / 2;
    };

  /*
  @HostListener('mouseenter') onMouseEnter() {
      this.highlight('red');
  }

  @HostListener('mouseleave') onMouseLeave() {
      this.highlight('white');
  }
*/

  @HostListener('click') onMouseClick() {
      //this.initConfetti();
      //this.render();
        window.cancelAnimationFrame(this.animReq);
        this.confettiStatus.emit({done: true});
  }


  private highlight(color: string) {
      //this.el.nativeElement.style.backgroundColor = color;
      this.el.nativeElement.style.border = color;
  }

  private initConfetti() {
      this.confetti = [];
      this.cx = this.ctx.canvas.width / 2;
      this.cy = this.ctx.canvas.height / 2;
      const randomRange = (min: number, max: number ) => { return Math.random() * (max - min) + min };

      for (let i = 0; i < this.confettiCount; i++) {
          this.confetti.push({
            color: this.colors[Math.floor(randomRange(0, this.colors.length))],
            dimensions: {
              x: randomRange(10, 20),
              y: randomRange(10, 30) },

            position: {
              x: randomRange(0, this.canvas.width),
              y: this.canvas.height - 1 },

            rotation: randomRange(0, 2 * Math.PI),
            scale: {
              x: 1,
              y: 1 },

            velocity: {
              x: randomRange(-25, 25),
              y: randomRange(0, -50) } });
        }
  }

  private render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      //this.ctx.drawImage(image1, (canvas.width - 1024)/2, 0, 1024, 360);
      //this.ctx.drawImage(image2, (canvas.width - 970)/2, 361, 970, 434);

      this.confetti.forEach((confetto, index) => {
          let width = confetto.dimensions.x * confetto.scale.x;
          let height = confetto.dimensions.y * confetto.scale.y;

          // Move canvas to position and rotate
          this.ctx.translate(confetto.position.x, confetto.position.y);
          this.ctx.rotate(confetto.rotation);

          // Apply forces to velocity
          confetto.velocity.x -= confetto.velocity.x * this.drag;
          confetto.velocity.y = Math.min(confetto.velocity.y + this.gravity, this.terminalVelocity);
          confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

          // Set position
          confetto.position.x += confetto.velocity.x;
          confetto.position.y += confetto.velocity.y;

          // Delete confetti when out of frame
          if (confetto.position.y >= this.canvas.height) this.confetti.splice(index, 1);

          // Loop confetto x position
          if (confetto.position.x > this.canvas.width) confetto.position.x = 0;
          if (confetto.position.x < 0) confetto.position.x = this.canvas.width;

          // Spin confetto by scaling y
          confetto.scale.y = Math.cos(confetto.position.y * 0.1);
          this.ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

          // Draw confetto
          this.ctx.fillRect(-width / 2, -height / 2, width, height);

          // Reset transform matrix
          this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      // Fire off another round of confetti
      // if (this.confetti.length <= 10) this.initConfetti();
      //this.animReq = window.requestAnimationFrame(this.render.bind(this));

      if (this.confetti.length > 0) {
          this.animReq = window.requestAnimationFrame(this.render.bind(this));
      }
      else {
          window.cancelAnimationFrame(this.animReq);
          this.confettiStatus.emit({done: true});
      }
  };

}
