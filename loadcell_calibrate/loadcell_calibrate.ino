
//<span style="font-size: 14pt; font-family: 'times new roman', times, serif;">
#include "HX711.h"
#include "soc/rtc.h"
#include <Arduino.h>
#include <stdlib.h>
#include <Wire.h>
//#include <Adafruit_GFX.h>
//#include <Adafruit_SSD1306.h>
#include <SimpleTimer.h>
 
#define DOUT  23
#define CLK  19

//HX711 scale(DOUT, CLK);
  HX711 scale;

 
//int rbutton = 18; // this button will be used to reset the scale to 0. 
String myString; 
String cmessage; // complete message
char buff[10];
float weight; 
float calibration_factor = -3041; // for me this vlaue works just perfect 206140  
 
SimpleTimer timer;
 
 
void setup() {

  Serial.begin(9600);

  scale.begin(DOUT, CLK);
  //rtc_clk_cpu_freq_set(RTC_CPU_FREQ_80M);
  scale.set_scale();
  scale.tare(); //Reset the scale to 0
  long zero_factor = scale.read_average(); //Get a baseline reading
  
  scale.set_scale();
  scale.tare();
  Serial.print("Setup complete");
 // display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
 // timer.setInterval(1000L, getSendData);
 // display.clearDisplay();
 // display.setTextColor(WHITE);
 
}

void loop() {
  //timer.run(); // Initiates SimpleTimer
  scale.set_scale(calibration_factor); //Adjust to this calibration factor
  weight = scale.get_units(5); //5
  myString = dtostrf(weight, 3, 3, buff);
  cmessage = cmessage + "Reading" + ":" + myString + "g "; 
  Serial.print(cmessage); 
  cmessage = "";
  Serial.print(millis()/1000 );

  if(Serial.available())
  {
    char temp = Serial.read();
    if(temp == '+' || temp == 'a')
      calibration_factor += 10;
    else if(temp == '-' || temp == 'z')
      calibration_factor -= 10;
  }
  
  delay(1000);
  
  Serial.println();
}



//#include "HX711.h"

//
//#define DOUT  3
//#define CLK  2
//
//HX711 scale(DOUT, CLK);
//
//float calibration_factor = -6100; //-7050 worked for my 440lb max scale setup
//
//void setup() {
//  Serial.begin(9600);
//  //Serial.println("HX711 calibration sketch");
//  //Serial.println("Remove all weight from scale");
//  //Serial.println("After readings begin, place known weight on scale");
//  //Serial.println("Press + or a to increase calibration factor");
//  //Serial.println("Press - or z to decrease calibration factor");
//
//  scale.set_scale();
//  scale.tare(); //Reset the scale to 0
//
//  long zero_factor = scale.read_average(); //Get a baseline reading
//  //Serial.print("Zero factor: "); //This can be used to remove the need to tare the scale. Useful in permanent scale projects.
//  //Serial.println(zero_factor);
//}
//
//void loop() {
//  //DynamicJsonDocument doc(1024);
//  //JsonArray r_time = doc.createNestedArray("time"); 
//  //JsonArray r_val = doc.createNestedArray("reading"); 
//  scale.set_scale(calibration_factor); //Adjust to this calibration factor
//
//  //Serial.print("Reading: ");
//  Serial.print(millis()/1000 );
//  Serial.print(" "); 
//  Serial.println(scale.get_units() );
//  //Serial.println(" g"); //Change this to kg and re-adjust the calibration factor if you follow SI units like a sane person
//  //Serial.print(" calibration_factor: ");` 
//  //Serial.print(calibration_factor);
//
//   //r_time.add(String(millis()/1000));
//   //r_val.add(String(scale.get_units()));
//
//
//
//   //serializeJson(doc, Serial); 
//   //Serial.println();
//
//
//  if(Serial.available())
//  {
//    char temp = Serial.read();
//    if(temp == '+' || temp == 'a')
//      calibration_factor += 10;
//    else if(temp == '-' || temp == 'z')
//      calibration_factor -= 10;
//  }
//  
//  delay(1000);
//}
