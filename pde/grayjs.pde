/* @pjs preload="img/diffusion.jpg"; */
color blue = color(#464237);
color yellow = color(#f8ecc2);

float Da = 1.0;
float f = 0.055;
float k = 0.062;
float dt = 1.0;
float Db = 0.2;

class Concentration {
  public float A = 1.0;
  public float B = 0.0;
}

Concentration[][] c;
PImage img;

void setup() {
  size(600, 600);     
  img = loadImage("img/diffusion.jpg");
  
  img.loadPixels();
  
  c = new Concentration[img.width][img.height];  
  for (int i = 0; i < img.width; i++) {
    for (int j = 0; j < img.height; j++) {
      c[i][j] = new Concentration();
      float x = green(img.pixels[i + j * img.width]) / 255;
      c[i][j].B = x;
      c[i][j].A = 1 - x;
    }
  }
}

float[][] kernel = {
  { 0.05, 0.2, 0.05 },
  { 0.2,  -1, 0.2 },
  { 0.05, 0.2, 0.05 }
};

float conv(int i, int j, boolean isA) {
  float res = 0.0;
  for (int x = 0; x < 3; x+=1) {
    for (int y = 0; y < 3; y +=1) {
      int xx = 0;
      if (i + x - 1 == -1) {
        xx = 0;
      } else if (i + x - 1 == img.width)  {
        xx = img.width - 1;
      } else {
        xx = i + x - 1;
      }
      
      int yy = 0;
      if (j + y - 1 == -1) {
        yy = 0;
      } else if (j + y - 1 == img.height)  {
        yy = img.height - 1;
      } else {
        yy = j + y - 1;
      }
      
      res += kernel[x][y] * 
        (isA ? c[xx][yy].A : c[xx][yy].B);
    }
  }  
  return res;
}

boolean isMousePressed = false;

void mousePressed() {
    isMousePressed = true;
}

void draw() {  

    if (!isMousePressed) {
        background(yellow);
        fill(#464237);         
        textSize(18);
        text("Нажмите для начала", 200, height / 2);      
        return;
    }

    background(blue);

    loadPixels();

    for (int i = 0; i < width; i++) {
        for (int j = 0; j < height; j++) {

            float A = c[i][j].A;
            float B = c[i][j].B;
            c[i][j].A = A + (Da * conv(i,j, true) - A * B * B + f * (1 - A)) * dt;
            c[i][j].B = B + (Db * conv(i,j, false) + A * B * B - (k + f) * B) * dt;

            pixels[i + j * width] = lerpColor(yellow, blue, c[i][j].A);
        }
    }

    updatePixels();


}
