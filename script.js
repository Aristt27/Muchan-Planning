class Point {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  move(v){
    this.x += v.x;
    this.y += v.y;
  }

  update(mX,mY){
    return;
  }

  move_to(p){
    this.x = p.x;
    this.y = p.y;
  }
}

class Robot {
  constructor(robots, root_point, color=random_color()) {
    this.color = color;
    this.points = [root_point];
    this.open = true;
    this.grab_hook = null;
    robots.push(this);
  }

  get_center(){
    let s = new Point(0,0);
    let i;
    for (i=0; i<this.points.length; i++){
      s.x += this.points[i].x;
      s.y += this.points[i].y;
    }
    s.x /= this.points.length;
    s.y /= this.points.length;
    return s;
  }

  reverse(){
    let center = this.get_center()
    let i;
    let vertices = [];
    for (i = 0; i < this.points.length; i++){
      let w = new Point(0,0);
      w.x  += 2*center.x - this.points[i].x;
      w.y  += 2*center.y - this.points[i].y;
      vertices.push(w);
    }
    return vertices
  }

  update(mX,mY){
    return;
  }

  get_grabbed_at(p){
    this.grab_hook = p;
    grabbed = this;
  }

  move_to(p){
    let v = createVector(p.x - this.grab_hook.x, p.y - this.grab_hook.y);
    this.move_points(v);
    this.grab_hook = p;
  }

  move(vec){
    this.move_points(vec);
  }

  move_points(vec){
    let dx = vec.x, dy = vec.y;
    let i;
    for (i=0; i<this.points.length; i++){
      this.points[i].move(vec);
    }
  }

  addPoint(_point_) {
    this.points.push(_point_);
  }

  finish(){
    this.open = false;
  }

  draw(){
    if(this.open){
      this.open_draw();
    } else {
      this.closed_draw();
    }
    let center = this.get_center();
    debugable_point(center.x, center.y);
  }

  open_draw() {
    let i;
    let _point_;
    let mX = mouseX, mY = mouseY;
    push();
    beginShape();
    fill(this.color);
    for (i = 0; i < this.points.length; i++) {
      _point_ = this.points[i];
      vertex(_point_.x, _point_.y);
      debugable_point(_point_.x, _point_.y);
    }
    vertex(mX, mY);
    debugable_point(mX, mY);
    endShape();
    pop();
  }

  closed_draw() {
    let i;
    let c = color(255,0,0)
    let _point_;
    beginShape();
    fill(this.color);
    for (i = 0; i < this.points.length; i++) {
      _point_ = this.points[i];
      vertex(_point_.x, _point_.y);
      grabbable_point(_point_);
      debugable_point(_point_.x, _point_.y);
    }
    debugable_point(_point_.x,_point_.y);
    endShape(CLOSE);
    let center = this.get_center();
    _point_ = center;
    fill(c)
    ellipse(_point_.x,_point_.y,5,5);
  }
  is_inside(p) {
    let c = this.get_center();
    let v = createVector(c.x-p.x, c.y-p.y);
    v.normalize();
    // count how many times v intersects this shape.
    let pseudo_ray = {x:p.x, y:p.y, vec:v};
    let intersections = get_intersections(pseudo_ray, this);
    let n = intersections.length;
    return !!((n>0) && (n%2));
  }
}

class Obstacle {
  constructor(obstacles, root_point, color=random_color()) {
    this.color = color;
    this.points = [root_point];
    this.open = true;
    this.grab_hook = null;
    obstacles.push(this);
  }

  get_center(){
    let s = new Point(0,0);
    let i;
    for (i=0; i<this.points.length; i++){
      s.x += this.points[i].x;
      s.y += this.points[i].y;
    }
    s.x /= this.points.length;
    s.y /= this.points.length;
    return s;
  }

  update(mX,mY){
    return;
  }

  get_grabbed_at(p){
    this.grab_hook = p;
    grabbed = this;
  }

  move_to(p){
    let v = createVector(p.x - this.grab_hook.x, p.y - this.grab_hook.y);
    this.move_points(v);
    this.grab_hook = p;
  }

  move(vec){
    this.move_points(vec);
  }

  move_points(vec){
    let dx = vec.x, dy = vec.y;
    let i;
    for (i=0; i<this.points.length; i++){
      this.points[i].move(vec);
    }
  }

  addPoint(_point_) {
    this.points.push(_point_);
  }

  finish(){
    this.open = false;
  }

  draw(){
    if(this.open){
      this.open_draw();
    } else {
      this.closed_draw();
    }
    let center = this.get_center();
    debugable_point(center.x, center.y);
  }

  open_draw() {
    let i;
    let _point_;
    let mX = mouseX, mY = mouseY;
    push();
    beginShape();
    fill(this.color);
    for (i = 0; i < this.points.length; i++) {
      _point_ = this.points[i];
      vertex(_point_.x, _point_.y);
      debugable_point(_point_.x, _point_.y);
    }
    vertex(mX, mY);
    debugable_point(mX, mY);
    endShape();
    pop();
  }

  closed_draw() {
    let i;
    let _point_;
    beginShape();
    fill(this.color);
    for (i = 0; i < this.points.length; i++) {
      _point_ = this.points[i];
      vertex(_point_.x, _point_.y);
      grabbable_point(_point_);
      debugable_point(_point_.x, _point_.y);
    }
    endShape(CLOSE);
  }
  is_inside(p) {
    let c = this.get_center();
    let v = createVector(c.x-p.x, c.y-p.y);
    v.normalize();
    // count how many times v intersects this shape.
    let pseudo_ray = {x:p.x, y:p.y, vec:v};
    let intersections = get_intersections(pseudo_ray, this);
    let n = intersections.length;
    return !!((n>0) && (n%2));
  }
}

class Minkowskis {
  constructor(mink) {
    this.points = mink[0]
  }

  get_center(){
    let s = new Point(0,0);
    let i;
    for (i=0; i<this.points.length; i++){
      s.x += this.points[i].x;
      s.y += this.points[i].y;
    }
    s.x /= this.points.length;
    s.y /= this.points.length;
    return s;
  }

  update(mX,mY){
    return;
  }

  get_grabbed_at(p){
    this.grab_hook = p;
    grabbed = this;
  }

  move_to(p){
    let v = createVector(p.x - this.grab_hook.x, p.y - this.grab_hook.y);
    this.move_points(v);
    this.grab_hook = p;
  }

  move(vec){
    this.move_points(vec);
  }

  move_points(vec){
    let dx = vec.x, dy = vec.y;
    let i;
    for (i=0; i<this.points.length; i++){
      this.points[i].move(vec);
    }
  }

  addPoint(_point_) {
    this.points.push(_point_);
  }

  finish(){
    this.open = false;
  }

  draw(){
    if(this.open){
      this.open_draw();
    } else {
      this.closed_draw();
    }
    let center = this.get_center();
    debugable_point(center.x, center.y);
  }

  open_draw() {
    let i;
    let _point_;
    let mX = mouseX, mY = mouseY;
    push();
    beginShape();
    fill(color(200,0,0,123));
    for (i = 0; i < this.points.length; i++) {
      _point_ = this.points[i];
      vertex(_point_.x, _point_.y);
      debugable_point(_point_.x, _point_.y);
    }
    vertex(mX, mY);
    debugable_point(mX, mY);
    endShape();
    pop();
  }

  closed_draw() {
    let i;
    let _point_;
    beginShape();
    fill(color(200,0,0,123));
    for (i = 0; i < this.points.length; i++) {
      _point_ = this.points[i];
      vertex(_point_.x, _point_.y);
      grabbable_point(_point_);
      debugable_point(_point_.x, _point_.y);
    }
    endShape(CLOSE);
  }
  is_inside(p) {
    let c = this.get_center();
    //console.log(c)
    //console.log(c.x)
    let v = createVector(c.x-p.x, c.y-p.y);
    v.normalize();
    // count how many times v intersects this shape.
    let pseudo_ray = {x:p.x, y:p.y, vec:v};
    let intersections = get_intersections(pseudo_ray, this);
    let n = intersections.length;
    return !!((n>0) && (n%2));
  }
}

// Modes
let debug_mode = false;

let robot_mode = 1;
let obstacle_mode = 2;
let edit_mode = 3;
let finish_line_mode = 12;
let minkowski_mode = 13;
let moving_robot_mode = 14;
let winner_robot_mode = 15;

let finishline = null
let cntrl_var = 0;
let cntrl_var2 = 0;
let control_var3 = 0;
let draw_mode = obstacle_mode;

let drawing_obstacle = false;
let drawing_robot = false;

let obstacles = [];
let robots = [];
let minkowsvao = [];
let anti_robot = [];
let steps  = [];
let minkowski_sum = null;

// Editing
let grabbable_points = [];
let grabbing_radius = 5;
let grabbed = null;

// Window
let h = 1600, w = 1920;
let canvas_diagonal = Math.sqrt(h**2 + w**2);

// Color Management
function randint(a, b) {
  // random integer in [a, b]
  if (typeof b == 'undefined'){
    b = a;
    a = 0;
  }
  return a + Math.floor((b-a)*Math.random());
}

function random_color(_alpha_=133) {
  let r = randint(0,255);
  let g = randint(0,255);
  let b = randint(0,255);
  return color(r, g, b, _alpha_);
}

function intense_color(_alpha_=133) {
  let r = randint(0,255);
  let g = randint(0,255);
  let b = 255 - ((r+g)/2);
  return color(r, g, b, _alpha_);
}

function last(x){
  return x[x.length-1];
}

function last_obstacle(obstacles){
  return last(obstacles);
}

function last_robot(robots){
  return last(robots);
}

function draw_obstacles(obstacles){
  let i;
  for (i=0; i < obstacles.length; i++){
    obstacles[i].draw();
  }
}


function draw_minkowskis(minkowsvao){
  let i;
  for (i=0; i < minkowsvao.length; i++){
    minkowsvao[i].draw();
  }
}

function winner_robot(finishline,robots){
  let v   = [-finishline.x +robots[0].get_center().x , -finishline.y +robots[0].get_center().y];
  let k;
  for (k=0; k < robots[0].length; k++){
    robots[0][k].x = robots[0][k].x + v[0];
    robots[0][k].y = robots[0][k].y + v[1];
  }
}

function draw_random_movement(robots,finishline,minkowski_sum,steps){ // BIG TODO HERE
  let center  = robots[0].get_center();
  var max_step = 0;
  steps.push(center);
  while (hypot(last(steps).x - finishline.x,last(steps).y - finishline.y) > 25){
    let p     = last(steps);
    let q     = new Point(p.x + randint(-25,26),p.y + randint(-25,26));
    let k;
    let j;
    let a_verdade = 0;
      for (k = 0; k <minkowsvao.length; k++){
         if(minkowsvao[k].is_inside(q)){
           a_verdade ++;
         }
      }
      if ( a_verdade == 0 && abs(q.x) < w*0.9 && abs(q.y) < h*0.9 && abs(q.x) > w - w*0.9 && abs(q.y) > h - h*0.9){
          steps.push(q);
        max_step ++;
      }

      else if (a_verdade > 0){
        console.log('teu idiota vc matou a velinha',q);
      }
  if (hypot(last(steps).x - finishline.x,last(steps).y - finishline.y) < 25){

    console.log('voce chegou ao seu destino.googlemaps')
    //the_way()
    control_var3 ++;
    break;
  }
 }
}

function set_mode(_mode_) {
  if (_mode_ != draw_mode) {
    cancel_draw(draw_mode);
    draw_mode = _mode_;
    }
  if (_mode_ == moving_robot_mode){ // BIG TODO HERE
    if (cntrl_var == 2){
      if (finishline != null){
        draw_random_movement(robots,finishline,minkowski_sum,steps);
      }
      else if (finishline == null){
        console.log('create a finihsline dumbass');
        }
     }
   }
  else if (_mode_ == minkowski_mode){
    if (cntrl_var == 1){
      draw_minkowski_sum(anti_robot,obstacles);
      draw_mode = _mode_;
      cntrl_var ++;
    }
  }} //TODO

function calculate_minkowski_sum(robots,obstacles){
  let minkowski_sum = [];
  let center_robot = robots[0].get_center();
  let anti_robot = robots[0].reverse();
  let i;
  let j;
  let k;
  for (i = 0; i < obstacles.length; i++){
    let center_obs = obstacles[i].get_center();
    let obst = obstacles[i].points;
    let parts = [];
    for (k = 0; k < anti_robot.length; k++){
      for ( j = 0; j < obst.length; j++){
        let n_p = new Point(obst[j].x + anti_robot[k].x  - center_robot.x, obst[j].y + anti_robot[k].y  - center_robot.y);
        parts.push(n_p);
      }
    }
  minkowski_sum.push([convexHull(parts)]);
  }
  return minkowski_sum
}

function convexHull(points) {
    points.sort(comparison);
    var L = [];
    for (var i = 0; i < points.length; i++) {
        while (L.length >= 2 && cross(L[L.length - 2], L[L.length - 1], points[i]) <= 0) {
            L.pop();
        }
        L.push(points[i]);
    }
    var U = [];
    for (var i2 = points.length - 1; i2 >= 0; i2--) {
        while (U.length >= 2 && cross(U[U.length - 2], U[U.length - 1], points[i2]) <= 0) {
            U.pop();
        }
        U.push(points[i2]);
    }
    L.pop();
    U.pop();
    return L.concat(U);
}

function comparison(a, b) {
    return a.x == b.x ? a.y - b.y : a.x - b.x;
}

function cross(a, b, o) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function draw_minkowski_sum(minkowski_sum){ //TODO
  let i;
  let j;
  let c = color(55,0,0)
  c.setAlpha(100)

  let m;
  for (m = 0; m < minkowski_sum.length; m++){
    beginShape();
    fill(c);
    let minkowski_sum_m = calculate_minkowski_sum(robots,obstacles)[m]
    for (i = 0; i < minkowski_sum_m.length; i++){

      for ( j = 0; j < minkowski_sum_m[i].length; j++){

        vertex(minkowski_sum_m[i][j].x, minkowski_sum_m[i][j].y);
      }
    }
  endShape(CLOSE);
  }
}

function draw_robots(robots){
  if (robots[0] != null){
    robots[0].draw();
  }
}

function hypot(a, b){
  // Hypotenuse
  return Math.sqrt(a**2 + b**2);
}

function mouse_inside(x1=0,y1=0,x2=width,y2=height){
  let mX = mouseX, mY = mouseY;
  return ((x1 <= mX) && (mX <= x2) && (y1 <= mY) && (mY <= y2));
}

function draw_cursor(draw_mode){
  switch(draw_mode){
    case obstacle_mode:
      cursor(CROSS);
      break;
    case finish_line_mode:
      cursor(TEXT);
      break;
    case robot_mode:
      cursor(WAIT);
      break;
      case minkowski_mode:
      cursor('cell');
      break;
    case edit_mode:
      if (mouseIsPressed){
        cursor('grabbing');
      } else {
      cursor('grab');
      }
      break;
  }} // TODO

function debugable_point(x,y) {
  if(debug_mode){
    push();
    fill(255,100,100);
    show_coords(x, y);
    pop();
  }
}

// p5.js loops
function setup(){
    // setup window
    createCanvas(w,h);
}

function draw() {
  // Clear screen
  background(255);
  strokeWeight(4)
  line(w*0.9,h-h*0.9,w-0.9*w,h-h*0.9)
  line(w*0.9,h*0.9,w-0.9*w,h*0.9)
  line(w*0.9,h*0.9,w*0.9,h-h*0.9)
  line(w-0.9*w,h*0.9,w-0.9*w,h-h*0.9)

  // Cursor
  draw_cursor(draw_mode);

  // Grabbable Points
  grabbable_points = [];

  // Draw objects

  draw_obstacles(obstacles);
  draw_robots(robots);
  if (draw_mode == winner_robot_mode){ //TODO
    if (control_var3 > 0){
      deseha alguns centros
      desenha o robot no final e no começo se der
      desenha os obstaculos sem o minkowski eu acho


    }
  }
  if (draw_mode == moving_robot_mode){
    draw_minkowskis(minkowsvao);
  }

  if (draw_mode == minkowski_mode){
    if (robots[0] != null){
      minkowski_sum = calculate_minkowski_sum(robots,obstacles);
      let k;
      if (cntrl_var2 == 0){
        for (k=0; k<minkowski_sum.length; k++){
          minkowsvao.push( new Minkowskis(minkowski_sum[k]));
          cntrl_var2 ++;
        }
      }
      if( cntrl_var == 0){
        cntrl_var ++;
      }
      draw_minkowski_sum(minkowski_sum);
    }
  }


  if (finishline != null){
    let d = color(0,255,0);
    fill(d);
    ellipse(finishline.x,finishline.y,25,25);
  }
    // move grabbed objects
  move_grab();

  // Moving Robot Stepsw-
  if (draw_mode == moving_robot_mode){
    if (steps != 0){
      let i;
      for (i = 0; i < steps.length; i++){
        let d2 = color(0,0,i*255/4444)
        fill(d2)
        ellipse(steps[i].x,steps[i].y,18,9)
      }
    }
  }} // TODO  ( GENETIC ALGOR MODE )

// button actions

function _save_(_path_, _mode_='png') {
  // Future: save only the smallest rectangle around the shapes.
  saveCanvas(_path_, _mode_);
}

function toggle_debug_mode(img){
  if(debug_mode){
    debug_mode = false;
    document.getElementById("debug_img").src = "../Trabalho 1/images/debug2.png";
  } else{
    debug_mode = true;
    document.getElementById("debug_img").src = "../Trabalho 1/images/debug.png";
  }
}

// coordinate_strings
function coords(x,y,prec=1){
  return "["+x.toFixed(prec)+ ","+y.toFixed(prec)+"]"
}

function show_coords(x,y,dx=0,dy=0,prec=1){
  text(coords(x,y,prec),x+dx,y+dy);
}


// Cancel drawing

function drawing(){
  return (drawing_robot || drawing_obstacle);
}

function cancel_draw(target){
  // Cancel the shape drawing
  if (drawing()){
    let figures;
    switch(target){
      case robot_mode:
        drawing_robot = false;
        figures = robots;
        anti_robots = robots[0]
        break;
      case obstacle_mode:
        drawing_obstacle = false;
        figures = obstacles;
        break;
      }
    let _figure_ = figures.pop();
    _figure_ = undefined;
  }
}

function force_finish(target){
  if (drawing()){
    switch(target){

      case robot_mode:
        _robot_ = last_robot(robots);
        _robot_.finish();
        drawing_robot = false;
        break;
      case obstacle_mode:
        _obstacle_ = last_obstacle(obstacles);
        _obstacle_.finish();
        drawing_obstacle = false;
        break;

    }
  }
}

// events

function mouseClicked() {
  if (!mouse_inside()){
    return;
  }
  let _point_;
  switch(draw_mode){
    case finish_line_mode:
      finishline = new Point(mouseX,mouseY);
      break;
    case obstacle_mode:
      let _obstacle_;
      if (drawing_obstacle){
        // Drawing new obstacle
        _point_ = new Point(mouseX, mouseY);
        _obstacle_ = last_obstacle(obstacles);
        _obstacle_.addPoint(_point_);
      } else {
        // Not Drawing
        _point_ = new Point(mouseX, mouseY);
        _obstacle_ = new Obstacle(obstacles, _point_, random_color(128));
        drawing_obstacle = true;
      }
      break;
      case robot_mode:
        let _robot_;
        if (drawing_robot){
          // Drawing new robot
          _point_ = new Point(mouseX, mouseY);
          _robot_ = last_robot(robots);
          _robot_.addPoint(_point_);
        } else {
          // Not Drawing
          _point_ = new Point(mouseX, mouseY);
          _robot_ = new Robot(robots, _point_, random_color(128));
          drawing_robot = true;
        }
    break;
    case edit_mode:
      break;
    case finish_line_mode:
      break;
  }
}

function doubleClicked() {
  if (!mouse_inside()){
    return;
  }
  switch(draw_mode){
    case obstacle_mode:
      if (drawing_obstacle){
        // end shape
        let _obstacle_ = last_obstacle(obstacles);
        _obstacle_.finish();
        _obstacle_.points.pop();
        drawing_obstacle = false;
      } else {
        // do nothing
        return;
      }
      break;
    case robot_mode:
      if (drawing_robot){
        // end shape
        let _robot_ = last_robot(robots);
        _robot_.finish();
        _robot_.points.pop();
        drawing_robot = false;
      } else {
        // do nothing
        return;
      }
      break;
    case edit_mode:
      break;
    case finish_line_mode:
      break;
    default:
      return;
  }
}

function keyPressed() {
  switch(keyCode){
    case ESCAPE:
      // Cancel drawing
      cancel_draw(draw_mode);
      break;

    case ENTER:
      // force finishing the shape drawing
      force_finish(draw_mode);
      break;
    case ALT:
      console.log(robots[0]);
      break;
  }}   //TODO

function mousePressed() {
  grab();
}

function mouseReleased(){
  release_grab();
}

// Grabbing Folks

function grabbable_point(p){
  grabbable_points.push(p);
  if (draw_mode == edit_mode){
    push();
    fill(0);
    ellipse(p.x, p.y, grabbing_radius);
    pop();
  }
}

function grab(){
  if(draw_mode == edit_mode){
    let mX = mouseX, mY = mouseY;
    let i;
    let _point_;
    let s = grabbing_radius, p = null, d;
    for(i=0; i<grabbable_points.length; i++){
      _point_ = grabbable_points[i];
      d = hypot(_point_.x-mX, _point_.y-mY);
      if (d <= s){
        s = d;
        p = _point_;
      }
    }
    // now `p` is the nearest point to the click!
    grabbed = p;

    // or not...
    if (grabbed === null){
      // everbody needs a second chance. (confucius 551-479 b.c.)
      let mp = new Point(mX, mY);
      for (i=0; i<obstacles.length; i++){
        if (obstacles[i].is_inside(mp)){
          obstacles[i].get_grabbed_at(mp);
        }
      }
      for (i=0; i<robots.length; i++){
        if (robots[i].is_inside(mp)){
          robots[i].get_grabbed_at(mp);
        }
      }
    }
  }
}

function release_grab(){
  grabbed = null;
}

function move_grab(){
  if (!(grabbed === null)){
    p = new Point(mouseX, mouseY);
    grabbed.move_to(p);
  }
}
// intersections

let symbols_outer = 8;
let symbols_inner = 3;

function draw_entering(p){
  push();
  fill(255);
  ellipse(p.x, p.y, symbols_outer);
  strokeWeight(1.5)
  line(p.x-symbols_inner,p.y-symbols_inner,p.x+symbols_inner,p.y+symbols_inner);
  line(p.x-symbols_inner,p.y+symbols_inner,p.x+symbols_inner,p.y-symbols_inner);
  pop();
}

function draw_exiting(p){
  push();
  fill(255);
  ellipse(p.x, p.y, symbols_outer);
  fill(0);
  ellipse(p.x, p.y, symbols_inner);
  pop();
}

function sort_intersections(its){
  // Bubble Sorting Intersections by distance from source ray.
  let intersections = [];
  let i,j;
  let n = its.length-1;
  let flag = true;
  while ((n > 0)  && flag){
    flag = false;
    for (j=0; j<n; j++){
      if(its[j].d > its[j+1].d){
        let temp = its[j];
        its[j] = its[j+1];
        its[j+1] = temp;
        flag = true;
      }
    }
    n--;
  }
  for(i=0; i<its.length; i++){
    intersections.push(its[i].p);
  }
  return intersections;
}

function get_intersections(ray, shape){
  let intersections = [];
  let s = ray;
  let v = ray.vec;
  let av = v.y/v.x;

  let points = shape.points;
  let p1 = points[0];

  for(k=1; k<=points.length; k++){
    let p2 = points[k%points.length];
    let px = p2.x - p1.x, py = p2.y - p1.y;
    let p = createVector(px, py);

    let ap = py/px;
    let x = (av*s.x - s.y - ap*p1.x + p1.y)/(av - ap);
    let y = av*(x - s.x) + s.y;

    let u = createVector(x-s.x, y-s.y);
    let w = createVector(x-p1.x, y-p1.y);

    let m = p5.Vector.dot(p, w);
    let c = p5.Vector.dot(p, p);

    if(p5.Vector.dot(u, v) > 0){
      if(0<=m && m<=c){
        // intersection found
        intersections.push({p: new Point(x,y), d:u.mag()});
      }
    }
    p1 = p2;
  }
  return sort_intersections(intersections);
}

function all_intersections(rays, shapes){
  // rays, shapes -> object list : [{x: (Int), y: (Int), ray: (Ray), shape: (Shape)}, ... ]
  let intersections = [];
  let i,j,k;
  for(i=0; i<rays.length; i++){
    for(j=0; j<shapes.length; j++){
      intersections.push(get_intersections(rays[i],shapes[j]));
    }
  }
  return intersections;
}

function draw_intersections(rays, shapes){
  let intersections = all_intersections(rays, shapes);
  let i,j;
  for (i=0; i<intersections.length; i++){
    let n = intersections[i].length;
    for (j=0; j<n; j++){
      if(!((n%2) ^ (j%2))){
        // Entering shape
        draw_entering(intersections[i][j]);
      } else{
        // Exiting shape
        draw_exiting(intersections[i][j]);
      }
    }
  }
}
