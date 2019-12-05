class AP {
  constructor(absc, ord, radius) {
    this.absc = absc;
    this.ord = ord;
    this.radius = radius;
  }
}

class obstacle {
  constructor(absc, ord, owidth, oheigth) {
    this.absc = absc;
    this.ord = ord;
    this.owidth = owidth;
    this.oheight = oheigth;
  }
}

// Choosing material
let material;
let materials = document.querySelectorAll("img"); // Return a nodeList (can apply array method)

for (var i in materials) {
  materials[i].onclick = function () {
    selectMaterial(this);
    canvas.style.cursor = "crosshair";
  };
}

function selectMaterial(e) {
  material = e.id;
  console.log(material);
}

//! Drawing
let obstacles = [];
let disableAddObstacle = 0;
initDraw(document.getElementById('canvas'));

function initDraw(canvas) {
  function setMousePosition(e) {
    var ev = e || window.event;
    /*  --pageX pageY :Output the coordinates (according to the document) of the mouse pointer when the mouse button is clicked on an element
          --The clientX read-only property of the MouseEvent interface provides the horizontal coordinate within the application's client area
           at which the event occurred (as opposed to the coordinate within the page).
          For example, clicking on the left edge of the client area will always result in a mouse event with a clientX value of 0,
          regardless of whether the page is scrolled horizontally. 
    */
    if (ev.pageX) {
      mouse.x = ev.pageX + window.pageXOffset;
      mouse.y = ev.pageY + window.pageYOffset;
    } else if (ev.clientX) {
      mouse.x = ev.clientX + document.body.scrollLeft;
      mouse.y = ev.clientY + document.body.scrollTop;
    }
  }

  var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0
  };
  var element = null;
  let width;
  let height;
  canvas.onmousemove = function (e) {
    setMousePosition(e);
    if ((element !== null) && (!disableAddObstacle)) {
      element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
      width = element.style.width;
      element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
      height = element.style.height;
      element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x - 250 + 'px' : mouse.startX - 250 + 'px';
      element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
    }
  }

  canvas.onclick = function (e) {
    if (element !== null) {
      element = null;
      canvas.style.cursor = "default";
    } else {
      mouse.startX = mouse.x;
      mouse.startY = mouse.y;
      element = document.createElement('div');
      element.className = `${material}`;
      element.style.left = mouse.x + 'px';
      element.style.top = mouse.y + 'px';
      canvas.appendChild(element)
      canvas.style.cursor = "crosshair";
      obstacles.push(new obstacle(mouse.x, mouse.y, width, height));
    }
  }

}

//! Add access point
let disableAddAP = 0;
const addBtn = document.querySelector('#addAccessBtn');
let accessPoints = [];
let c = document.getElementById("innerCanvas");
// Intializing Canvas
let ctx = c.getContext("2d");
// Make inner canvas full width and heigth
c.width = document.body.clientWidth;
c.height = document.body.clientHeight;
addBtn.addEventListener('click', addAccessPoint);
function addAccessPoint() {
  // change cursor
  let canvas = document.querySelector('#canvas');
  let radius = document.querySelector('#APradius').value; // Reading radius value from input field

  // Changing the cursor to an image
  canvas.addEventListener('mouseenter', (e) => {
    canvas.style.cursor = "url('/images/ap.png'), auto";
  });

  canvas.addEventListener('click', (e) => {
    if (disableAddAP == 0) {
      radius = Number(radius);
      ctx.beginPath(); // Creates the 2D path
      ctx.arc(e.clientX - 250, e.clientY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      //calculating colors
      let x = e.clientX;
      let y = e.clientY;
      // Radii of the white glow.
      let innerRadius = radius * 0.04;
      let outerRadius = radius * 1.25;
      let gradient = ctx.createRadialGradient(x - 250, y, innerRadius, x - 250, y, outerRadius);
      gradient.addColorStop(0, 'rgba(4, 255, 0,0.7)');
      gradient.addColorStop(1, 'rgba(0, 191, 255,0.6)');
      ctx.arc(x - 250, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
      disableAddObstacle = 1;
      accessPoints.push(new AP(e.clientX, e.clientY, radius));

      // create text on a circle
      let txt = document.createElement('div');
      txt.innerHTML = `AP${accessPoints.length}`;
      txt.style.position = 'absolute';
      txt.style.left = `${e.clientX - 250}px`;
      txt.style.top = `${e.clientY}px`;
      txt.style.zIndex = "10000";
      canvas.appendChild(txt);
    }
  });

}

document.querySelector("#sidebar").addEventListener('mouseenter', () => {
  let canvas = document.querySelector('#canvas');
  canvas.addEventListener('mouseenter', () => {
    canvas.style.cursor = "default";
  });
});

// Selecting access point

// Event listener on the button
let resultBtn = document.querySelector('#selectAccessBtn');
let res = document.querySelector('#result-content');
resultBtn.addEventListener('click', selectAP);
res.style.display = "none";
function selectAP() {
  // Shifting array with 1 position because of a latency in the onclick event
  for (let i = 0; i < obstacles.length - 1; i++) {
    obstacles[i].owidth = obstacles[i + 1].owidth;
    obstacles[i].oheight = obstacles[i + 1].oheight;
  }
  obstacles.splice(-1, 1);

  // Disabling adding access points
  disableAddAP = 1;

  canvas.addEventListener('click', (e) => {
    //Getting User position onclick
    //let userX, userY;
    userX = e.clientX - 250;
    userY = e.clientY;

    // Calculating attenuation

    // Showing Results
    res.innerHTML = `
      Meilleur point d'accés :
      <br>
      Qualité signal : 
      `;
    res.style.display = 'block';
  });
}