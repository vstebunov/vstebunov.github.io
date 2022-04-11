class CircuitLine {

    PVector startPos = new PVector();
    PVector link;
    ArrayList<CircuitLine> childs = new ArrayList<CircuitLine>();
    boolean stopped = false;
    String direction = "UP";
    boolean isChild = true;
    float maxLength = 0;

    CircuitLine() {
        startPos.x = width / 2;
        startPos.y = 500 + random(100);
        isChild = false;
    }

    CircuitLine(float x, float y, String direction, float maxLength) {
        startPos.x = x;
        startPos.y = y;
        this.direction = direction;
        this.maxLength = maxLength;
    }

    void step() {
        loadPixels();

        for (CircuitLine c: childs) {
            c.step();
        }

        if (stopped) {
            return;
        }


        PVector lastLink = startPos;
        if (link != null) {
            lastLink = link;
        }

        float dist = startPos.dist(lastLink);
        
        
        if (random(10) > 8) {
            if (!isContainPixel(lastLink.x - 12, lastLink.y + 12)) { 
                childs.add(new CircuitLine(lastLink.x, lastLink.y, "LEFT", dist));
            }
                       
            if (!isContainPixel(lastLink.x + 12, lastLink.y + 12)) {
                childs.add(new CircuitLine(lastLink.x, lastLink.y, "RIGHT", dist));
            }
            
            if (maxLength != 0 && dist >= maxLength) {                          
              stopped = true;
              return;
            }
            
            if (!isContainPixel(lastLink.x, lastLink.y - 24)) {
                childs.add(new CircuitLine(lastLink.x, lastLink.y, "UP", dist));
            }
            

            stopped = true;

        } else {
            switch(direction) {
                case "UP":
                    if (lastLink.y - 6 < 10) {
                        stopped = true;
                        return;
                    }

                    if (isContainPixel(lastLink.x, lastLink.y - 24)) {
                        stopped = true;
                        return;
                    }


                    link = new PVector(lastLink.x, lastLink.y  - 24);
                    break;
                case "LEFT":
                    if (lastLink.x - 6 < 10 || lastLink.y + 6 > height) {
                        stopped = true;
                        return;
                    }

                    if (isContainPixel(lastLink.x - 12, lastLink.y + 12)) {
                        stopped = true;
                        return;
                    }

                    link = new PVector(lastLink.x - 6, lastLink.y  + 6);
                    break;
                case "RIGHT":
                    if (lastLink.x + 6 > width || lastLink.y + 6 > height) {
                        stopped = true;
                        return;
                    }        
                    if (isContainPixel(lastLink.x + 12, lastLink.y + 12)) {
                        stopped = true;
                        return;
                    }
                    link = new PVector(lastLink.x + 6, lastLink.y  + 6);
                    break;
            }
        }

    }

    void drawStartPoint() {
        
        strokeWeight(5);
        point(startPos.x, startPos.y);
        if (!isChild) {
          strokeWeight(2);
          noFill();
          ellipse(startPos.x, startPos.y, 12, 12);
        }
    }

    void drawLinks() {    
        if (link != null) {
            strokeWeight(5);
            line(startPos.x, startPos.y, link.x, link.y);
            if (childs.size() == 0) {
              strokeWeight(2);
              noFill();
              ellipse(link.x, link.y, 12, 12);
            }
        } 
    }

    void draw() {      
        drawStartPoint();
        drawLinks();
        for (CircuitLine c: childs) {
            c.draw();
        }
    }

}

CircuitLine c;
boolean isMousePressed = false;

void setup() {
    size(650, 650);
        
    background(#f8ecc2);
    stroke(#464237);
    fill(#464237);
    
     c = new CircuitLine();
}

void draw() {
   if (isMousePressed) {     
      background(#f8ecc2);
      stroke(#464237);         
      c.draw();
      //if (frameCount % 5 == 0) {
          c.step();
      //}      
    } else {
      textSize(18);
      text("Нажмите для начала", 200, height / 2);      
    }
    
}

void mousePressed() {
  isMousePressed = true;
  c = new CircuitLine();  
  background(#f8ecc2);
  stroke(#464237);    
}

boolean isContainPixel(float cx, float cy) {
    int sx = floor(cx - 6);
    int fx = floor(cx + 6);

    int sy = floor(cy);
    int fy = floor(cy + 12);

    for (int x = sx; x <= fx; x+=1) {
        for (int y = sy; y <= fy; y+=1) {
            if (x < 0 || y < 0) {
                return true;
            }      
            if (x + y * height >= width * height) {
                return true;
            }            
            if (brightness(pixels[x + y * height]) < 125) {                
                return true;
            }
        }
    }

    return false;
}
