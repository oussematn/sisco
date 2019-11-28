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

// Drawing
initDraw(document.getElementById('canvas'));

function initDraw(canvas) {
  function setMousePosition(e) {
    var ev = e || window.event;
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

  canvas.onmousemove = function (e) {
    setMousePosition(e);
    if (element !== null) {
      element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
      element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
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
    }
  }
}

// Add access point
const addBtn = document.querySelector('#addAccessBtn');
let accessPoints = [];
addBtn.addEventListener('click', addAccessPoint);
function addAccessPoint() {
  // change cursor
  let canvas = document.querySelector('#canvas');
  let radius = document.querySelector('#APradius').value;
  canvas.addEventListener('mouseenter', (e) => {
    canvas.style.cursor = "url('/images/ap.png'), auto";
  });
  canvas.addEventListener('click', (e) => {
    radius = Number(radius);
    let c = document.getElementById("innerCanvas");
    let ctx = c.getContext("2d");
    c.width = document.body.clientWidth;
    c.height = document.body.clientHeight; 
    canvasW = c.width;
    canvasH = c.height;
    ctx.beginPath();
    ctx.arc(e.clientX-250, e.clientY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    let gradient = ctx.createLinearGradient(0, 0, 0, 170);
  });
}

document.querySelector("#sidebar").addEventListener('mouseenter', () => {
  let canvas = document.querySelector('#canvas');
  canvas.addEventListener('mouseenter', () => {
    canvas.style.cursor = "default";
  });
});