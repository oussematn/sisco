class AP {
  constructor(absc, ord, aradius) {
    this.absc = absc;
    this.ord = ord;
    this.aradius = aradius;
  }
}

class obstacle {
  constructor(oleft, otop, owidth, oheigth, omat) {
    this.oleft = oleft;
    this.otop = otop;
    this.owidth = owidth;
    this.oheight = oheigth;
    this.omat = omat;
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
      obstacles.push(new obstacle(element.style.left, element.style.top, width, height, material));
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

//! Add access point
let disableAddAP = 0;
const addBtn = document.querySelector('#addAccessBtn');
let accessPoints = [];
let c = document.getElementById("innerCanvas");
// Intializing Canvas
let ctx = c.getContext("2d");
addBtn.addEventListener('click', addAccessPoint);
 // Make inner canvas full width and heigth
 c.width = document.body.clientWidth;
 c.height = document.body.clientHeight;
function addAccessPoint() {
    // change cursor
    let canvas = document.querySelector('#canvas');
    let radius = document.querySelector('#APradius').value;
    canvas.addEventListener('mouseenter', (e) => {
      canvas.style.cursor = "url('/images/ap.png'), auto";
    });
   
    canvas.addEventListener('click', (e) => {
      if (disableAddAP==0) {
        radius = Number(radius);
        ctx.beginPath();
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
        accessPoints.push(new AP(e.clientX-250, e.clientY, radius));

        // create text on a circle
        let txt = document.createElement('div');
        txt.innerHTML = `AP${accessPoints.length}`;
        txt.style.position = 'absolute';
        txt.style.left = `${e.clientX - 250}px`;
        txt.style.top = `${e.clientY}px`;
        txt.style.zIndex = "100000";
        canvas.appendChild(txt);
    }});
  
}

document.querySelector("#sidebar").addEventListener('mouseenter', () => {
  let canvas = document.querySelector('#canvas');
  canvas.addEventListener('mouseenter', () => {
    canvas.style.cursor = "default";
  });
});

// Selecting best access point

// Event listener on the button
let resultBtn = document.querySelector('#selectAccessBtn');
resultBtn.addEventListener('click', selectAP);
let res = document.querySelector('#result-content');
res.style.display = "none";
function selectAP() {
  // Shift array with 1 position because of a latency in the onclick event
  /*for (let i = 0; i < obstacles.length - 1; i++) {
    obstacles[i].owidth = obstacles[i + 1].owidth;
    obstacles[i].oheight = obstacles[i + 1].oheight;
  }
  obstacles.splice(obstacles.length - 1, 1);*/
  console.log(obstacles);
  // Disabling adding access points and obstacles
  disableAddAP = 1;
  disableAddObstacle = 1;
  //Getting User position onclick
  let userX, userY;
  canvas.addEventListener('click',(e)=>{
    

    console.log("hello");
    userX=e.clientX-250;
    userY=e.clientY;
    console.log(userX);
    console.log(userY);
  
  
    //calculating the best access point
  
    //returns coefficient of attenuation depending on the material 
    function coefOfAtt (mat){
      switch (mat){
        case "wood": return 0.85;break;
        case "iron": return 0.1;break;
        case "crystal": return 0.7;break;
        case "cement": return 0.5;break;
      }
    }

    function doIntersect (X1, Y1, X2, Y2, X3, Y3, X4, Y4){
    
      class Point {
        constructor (x, y, name){
          this.x=x;
          this.y=y;
          this.name=name;
        }
      }

      function  onSegment(p, q, r) 
      { 
      if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && 
          q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) 
         return true; 
  
      return false; 
      } 

      // To find orientation of ordered triplet (p, q, r)
      // The function returns following values 
      // 0 --> p, q and r are colinear 
     // 1 --> Clockwise 
      // 2 --> Counterclockwise 
      function orientation (p, q, r) { 
      let val = (q.y - p.y) * (r.x - q.x) -  (q.x - p.x) * (r.y - q.y); 
  
      if (val === 0) return 0;  // colinear 
  
      return (val > 0)? 1: 2; // clock or counterclock wise 
      } 

    
      let p1 = new Point(X1, Y1, "p1");
      let q1 = new Point(X2, Y2, "q1");
      let p2 = new Point(X3, Y3, "p2");
      let q2 = new Point(X4, Y4, "q2");


      let o1 = orientation(p1, q1, p2); 
      let o2 = orientation(p1, q1, q2); 
      let o3 = orientation(p2, q2, p1); 
     let o4 = orientation(p2, q2, q1); 

      // General case 
      if (o1 !== o2 && o3 !== o4) 
        return true; 
  
       // Special Cases 
        // p1, q1 and p2 are colinear and p2 lies on segment p1q1 
      if (o1 === 0 && onSegment(p1, p2, q1)) return true; 
  
      // p1, q1 and q2 are colinear and q2 lies on segment p1q1 
      if (o2 === 0 && onSegment(p1, q2, q1)) return true; 
  
      // p2, q2 and p1 are colinear and p1 lies on segment p2q2 
      if (o3 === 0 && onSegment(p2, p1, q2)) return true; 
  
       // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
      if (o4 === 0 && onSegment(p2, q1, q2)) return true; 
  
      return false; // Doesn't fall in any of the above cases 
    }

    //determines if an object is an obstacle between the access point and the position selected 
    function isAnObstacle (AccessP, X, Y, obst){
      
    let left=parseInt(obst.oleft);
    let top=parseInt(obst.otop);
    let height=parseInt(obst.oheight);
    let width=parseInt(obst.owidth);
    
    /*say that the obstacle is a rectangle (a,b,c,d). this function checks if the line segment between the access point
    and the selected position (X,Y) intersects with any of the sides of the obstacle 
      */

    //a,b  
    if (doIntersect(AccessP.absc, AccessP.ord, X, Y, left, top, left+width, top)){
      return true;
    }
    //a,d
    if (doIntersect(AccessP.absc, AccessP.ord, X, Y, left, top, left, (top + height))){
      return true;
    }
     
    //b,c
    if (doIntersect(AccessP.absc, AccessP.ord, X, Y, (left + width), top, (left + width), (top + height))){
      return true;
    }

    //c,d
    if (doIntersect(AccessP.absc, AccessP.ord, X, Y, left, (top + height), (left + width), (top + height))){
      return true;
    }
    return false;
  }

  let maxReception=0
  let bestAp = null;
  //after choosing a position we check with every access point installed 
  for (let i=0; i < accessPoints.length; i++){
    //distance between the access point and the selected position
    let distance = Math.sqrt(Math.pow(userX - accessPoints[i].absc,2) + Math.pow(userY - accessPoints[i].ord,2));
    let receptionQuality = 100 * (1 - distance/accessPoints[i].aradius);
    //if the selected point is already out of range we continue to the next access point
    if (receptionQuality <= 0){
      continue;
    }else{
      //else we check if theres is obstacles between the access point and the selected position
      for (let j=0; j < obstacles.length-1; j++){
        // if the obstacle j interferes then the reception quality changes 
        if (isAnObstacle(accessPoints[i], userX, userY, obstacles[j])) {
          receptionQuality = receptionQuality * coefOfAtt(obstacles[j].omat);
        }
      }
      //everytime a better reception quality is found, it will be considered the maximum
      if (receptionQuality > maxReception) {
        maxReception = receptionQuality;
        bestAp=i+1;
      }
      }
    }
    
    maxReception = maxReception.toFixed(2);
    if (bestAp === null){
    //selected position of user is out of coverage
    //console.log("out of coverage");
    res.innerHTML="La zone est hors couverture";
    }else{
    //show best access point bestAp and quality maxReception
    //console.log("access point " + bestAp);
    //console.log(maxReception);
    res.innerHTML = `
      Best Access Point : ${bestAp}
      <br>
      Signal Quality : ${maxReception}%
      `;
   }
   res.style.display = 'block';
    //disableAddAP = 0;
    //disableAddObstacle = 0;
  });
}
