// Effect source derived from RBJ 1073 EQ by Thomas Scott Stillwell
// GFX handling derived from Sonic Anomaly
// GUI and modifications by TN Design
// Source license should be distributed with this plugin

desc:1073 EQ (GUI)
//tags: equalizer filter
//author: TN Design

// hide default sliders by adding "-" to the names
slider1:0<0,4,1{Off,50,80,160,300}>-HPF
slider2:0<0,4,1{Off,35,60,110,220}>-Low Shelf (Hz)
slider3:0<-20,20,0.1>-Low Boost/Cut (dB)
slider4:0<0,5,1{360,700,1.6k,3.2k,4.8k,7.2k}>-Mid Freq (Hz)
slider5:0<-20,20,0.1>-Mid Boost/Cut (dB)
slider6:0<-20,20,0.1>-High Shelf (12k) Boost/Cut (dB)
slider7:0<-20,10,0.1>-Gain (dB)
in_pin:left input
in_pin:right input
out_pin:left output
out_pin:right output



filename:0,gfx/1073_panel.png
filename:1,gfx/1073_gain_red.png
filename:2,gfx/1073_LF.png
filename:3,gfx/1073_HPF_blue.png
filename:4,gfx/1073_low_shelf_ring.png
filename:5,gfx/1073_mid_freq_ring.png
filename:6,gfx/1073_center.png
filename:7,gfx/EQ_button.png
filename:8,gfx/led.png

@init
  hpf = 0;
  gain1 = 0;
  freq1 = 50;
  bypass = 0;
  _sliderDirty = 0;
  gain = 1;
  
 function setQ(a,s) (
    q = 1 / (sqrt((a + 1/a)*(1/s - 1) + 2));
  );

  function setW(freq) (
    w = 2 * $pi * freq/srate;
  );

  function setA(w,q) (
    a = sin(w) / (2 * q);
  );


  function ProcessSliders() (
    freq1 = (slider1 == 0 ? 50 : (slider1 == 1 ? 50 : (slider1 == 2 ? 80 : (slider1 == 3 ? 160 : 300))));
    freq3 = (slider2 == 0 ? 35 : (slider2 == 1 ? 35 : (slider2 == 2 ? 60 : (slider2 == 3 ? 110 : 220))));
    freq5 = (slider4 == 0 ? 360 : (slider4 == 1 ? 700 : (slider4 == 2 ? 1600 : (slider4 == 3 ? 3200 : (slider4 == 4 ? 4800 : 7200)))));
    gain = 10^(slider7/20);
    gain3 = slider3;
    gain7 = slider6;
    gain5 = slider5;
    slider1 == 0 ? hpf = 0 : hpf = 1;
    slider2 == 0 ? lshelf = 0 : lshelf = 1;


    // HPF
    a1 = 1;
    s1 = 1;
   // q1 = 1 / (sqrt((a1 + 1/a1)*(1/s1 - 1) + 2));
    q1 = setQ(a1,s1);
    //w01 = 2 * $pi * freq1/srate;
    w01 = setW(freq1);
    cosw01 = cos(w01);
    //sinw01 = sin(w01);
    //alpha1 = sinw01 / (2 * q1);
    alpha1 = setA(w01,q1);
    
    b01 = (1 + cosw01)/2;
    b11 = -(1 + cosw01);
    b21 = (1 + cosw01)/2;
    a01 = 1 + alpha1;
    a11 = -2 * cosw01;
    a21 = 1 - alpha1;
    b01 /= a01;
    b11 /= a01;
    b21 /= a01;
    a11 /= a01;
    a21 /= a01;
    
    // Low Boost/Cut 
    a3 = 10^(gain3/40);
    s3 = 2;
    q3 = setQ(a3,s3);
    w03 = setW(freq3);
    cosw03 = cos(w03);
    alpha3 = setA(w03,q3);
    
    b03 = a3 * ((a3+1) - (a3-1)*cosw03 + 2*sqrt(a3)*alpha3);
    b13 = 2 * a3 * ((a3-1) - (a3+1)*cosw03);
    b23 = a3 * ((a3+1) - (a3-1)*cosw03 - 2*sqrt(a3)*alpha3);
    a03 = (a3+1) + (a3-1)*cosw03 + 2*sqrt(a3)*alpha3;
    a13 = -2 * ((a3-1) + (a3+1)*cosw03);
    a23 = (a3+1)+(a3-1)*cosw03-2*sqrt(a3)*alpha3;
    b03 /= a03;
    b13 /= a03;
    b23 /= a03;
    a13 /= a03;
    a23 /= a03;
    
    // Mid Boost/Cut 
    a5 = 10^(gain5/20);
    q5 = 1.4;
    w05 = setW(freq5);
    cosw05 = cos(w05);
    alpha5 = setA(w05,q5);
    
    b05 = 1 + alpha5 * a5;
    b15 = -2 * cosw05;
    b25 = 1 - alpha5 * a5;
    a05 = 1 + alpha5 / a5;
    a15 = -2 * cosw05;
    a25 = 1 - alpha5 / a5;
    b05 /= a05;
    b15 /= a05;
    b25 /= a05;
    a15 /= a05;
    a25 /= a05;


    // gain
    a7 = 10^(gain7/40);
    freq7 = 12000;
    s7 = 0.3;
    q7 = setQ(a7,s7;
    w07 = setW(freq7);
    cosw07 = cos(w07);
    alpha7 = setA(w07,q7);
    
    b07 = a7 * ((a7+1) + (a7-1)*cosw07 + 2*sqrt(a7)*alpha7);
    b17 = -2*a7*((a7-1) + (a7+1)*cosw07);
    b27 = a7*((a7+1) + (a7-1)*cosw07 - 2*sqrt(a7)*alpha7);
    a07 = (a7+1) - (a7-1)*cosw07 + 2*sqrt(a7)*alpha7;
    a17 = 2*((a7-1) - (a7+1)*cosw07);
    a27 = (a7+1)-(a7-1)*cosw07 - 2*sqrt(a7)*alpha7;
    b07 /= a07;
    b17 /= a07;
    b27 /= a07;
    a17 /= a07;
    a27 /= a07;
    
    
  );
  
  ProcessSliders();


@slider
  
  
  s1.value = slider1;
  s2.value = slider2;
  s3.value = -slider3 + 20;
  s4.value = slider4;
  s5.value = -slider5 + 20; 
  s6.value = -slider6 + 20;
  s7.value = -slider7 + 10;

  ProcessSliders();


@sample

  bypass == 0 ? (

  hpf != 0 ? (
  ospl0 = spl0;
  spl0 = b01 * spl0 + b11 * xl11 + b21 * xl21 - a11 * yl11 - a21 * yl21;
  xl21 = xl11;
  xl11 = ospl0;
  yl21 = yl11;
  yl11 = spl0 ;

  ospl1 = spl1;
  spl1 = b01 * spl1 + b11 * xr11 + b21 * xr21 - a11 * yr11 - a21 * yr21;
  xr21 = xr11;
  xr11 = ospl1;
  yr21 = yr11;
  yr11 = spl1 ;
  );

  lshelf != 0 && gain3 != 0 ? (
  ospl0 = spl0;
  spl0 = b03 * spl0 + b13 * xl13 + b23 * xl23 - a13 * yl13 - a23 * yl23;
  xl23 = xl13;
  xl13 = ospl0;
  yl23 = yl13;
  yl13 = spl0;

  ospl1 = spl1;
  spl1 = b03 * spl1 + b13 * xr13 + b23 * xr23 - a13 * yr13 - a23 * yr23;
  xr23 = xr13;
  xr13 = ospl1;
  yr23 = yr13;
  yr13 = spl1;
  );

  gain5 != 0 ? (
  ospl0 = spl0;
  spl0 = b05 * spl0 + b15 * xl15 + b25 * xl25 - a15 * yl15 - a25 * yl25;
  xl25 = xl15;
  xl15 = ospl0;
  yl25 = yl15;
  yl15 = spl0;

  ospl1 = spl1;
  spl1 = b05 * spl1 + b15 * xr15 + b25 * xr25 - a15 * yr15 - a25 * yr25;
  xr25 = xr15;
  xr15 = ospl1;
  yr25 = yr15;
  yr15 = spl1;
  );

  gain7 != 0 ? (
  ospl0 = spl0;
  spl0 = b07 * spl0 + b17 * xl17 + b27 * xl27 - a17 * yl17 - a27 * yl27;
  xl27 = xl17;
  xl17 = ospl0;
  yl27 = yl17;
  yl17 = spl0;

  ospl1 = spl1;
  spl1 = b07 * spl1 + b17 * xr17 + b27 * xr27 - a17 * yr17 - a27 * yr27;
  xr27 = xr17;
  xr17 = ospl1;
  yr27 = yr17;
  yr17 = spl1;
  );
  
    spl0 *= gain;
    spl1 *= gain;
  ) : (
    spl0 = spl0;
    spl1 = spl1;
  ); 


@gfx 720 153

  function draw_pot(x,y,fw,fh,fn,f,t,s,d,img,id)
   // (dest x, dest y, control width, control height, normalized (img count), min val, max val, step, default, file id)
   (
     
     this.range = abs(f - t);
     this.steps = this.range / s;  
     
     // Mouse Logic
     mouse_x >= x && mouse_x <= x+fw && mouse_y >= y && mouse_y <= y+fh && !this.disabled && !_priority ?  (
       !mouse_cap ? this.hasEntered = 1;
       mouse_cap ? this.hasClicked = 1;
       mouse_cap & 4 ? this.value = d;
       this.hasEntered && this.hasClicked ? (
         this.canChange = 1;         
          _priority = id;
       );
     ) : (
       this.hasEntered = this.hasClicked = 0;
     );
     !mouse_cap ? (
       this.canChange = 0;
       _priority = 0;  
     );
     
     // Process
     this.canChange && id == _priority ? (
       this.value += (this.y_tmp - mouse_y) * s;
     );
     
     this.y_tmp = mouse_y;
  
     // Update
     this.value.temp != this.value ? (   
       this.value = max(this.value,f);
       this.value = min(this.value,t);
       this.normalized = this.value * (1/(this.steps * s)) * 0.999;
       this.rpos = floor((1 - this.normalized) + fn * this.normalized) * fh ;
       this.value == 0 ? this.rpos = 0;
       
       _sliderDirty = 1;
       this.value.temp = this.value;   
     );
     this.coord = drawindex;
     this.coord[0] = 0;
     this.coord[1] = this.rpos;
     this.coord[2] = this.coord[6] = fw;
     this.coord[3] = this.coord[7] = fh;
     this.coord[4] = x;
     this.coord[5] = y;
     
     drawindex += 8;
     
     this.img = img;
         
     //gfx_blitext(img, this.coord, 0);
     // instead, blit the pots after they have been defined
     // this allows stacked controls
     
     this.value;
   );
   
   function drawSwitch(x,y,w,h,img)
   (
     // Mouse Logic
     mouse_x >= x && mouse_x <= x+w && mouse_y >= y && mouse_y <= y+h && !this.disabled ? (
       !mouse_cap ? this.hasEntered = 1;
       mouse_cap ? this.hasClicked = 1;
       this.hasEntered && this.hasClicked ? this.canChange = 1;
     ) : (
       this.hasEntered = this.hasClicked = this.canChange = 0;
     );
     !mouse_cap ? (this.canChange = 0;);
   
     this.canChange ? (
       this.checked = 1-this.checked;
       this.hasEntered = this.hasClicked = this.canChange = 0;
     );
     
     this.coord = 2000;
     this.coord[0] = 0;
     this.coord[1] = h; // top img is off
     this.coord[2] = this.coord[6] = w;
     this.coord[3] = this.coord[7] = h;
     this.coord[4] = x;
     this.coord[5] = y; 
     
     // Checked
     this.checked ? (
      this.coord[1] = 0;    
      );
      
     gfx_blitext(img, this.coord, 0);
       
     this.checked; 
   );


gfx_x = 0; gfx_y = 0;   
gfx_dest = -1;             
gfx_blit(0,1,0);

drawindex = 1000;  // define a mem start for the pot coords

// pots - list in draw order of top to bottom
slider1 = floor(s1.draw_pot(525,33,88,88,5,0,5,0.1,0,3,1))  ; // HPF
slider6 = s6.draw_pot(173,33,88,88,31,0,40,0.3,20,2,6)*-1 + 20; // High Shelf Boost/Cut
slider7 = s7.draw_pot(56,34,88,88,40,0,30,0.1,10,1,7)*-1 + 10; // Gain
slider5 = s5.draw_pot(301,43,68,68,36,0,40,0.3,20,6,5)*-1 + 20; // Mid Boost/Cut
slider4 = floor(s4.draw_pot(288,30,94,94,7,0,7,0.1,0,5,4))  ; // Mid Freq
slider3 = s3.draw_pot(418,43,68,68,36,0,40,0.3,20,6,3)*-1 + 20; // LF Boost/Cut
slider2 = floor(s2.draw_pot(405,30,94,94,5,0,5,0.1,0,4,2))  ; // Low Shelf

_sliderDirty ? (  
  ProcessSliders();
  _sliderDirty = 0;
);


// blit the pots from bottom to top
gfx_blitext(s2.img, s2.coord, 0);
gfx_blitext(s3.img, s3.coord, 0);
gfx_blitext(s4.img, s4.coord, 0);
gfx_blitext(s5.img, s5.coord, 0);
gfx_blitext(s7.img, s7.coord, 0);
gfx_blitext(s6.img, s6.coord, 0);
gfx_blitext(s1.img, s1.coord, 0);

// switches and indicators
bypass = eqsw.drawSwitch(640,66,39,62,7);

