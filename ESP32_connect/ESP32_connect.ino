#include "secrets.h"
#include <WiFiClientSecure.h>
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"
#include "HX711.h"
#include "soc/rtc.h"
#include <Arduino.h>
#include <stdlib.h>
#include <Wire.h>
//#include <Adafruit_GFX.h>
//#include <Adafruit_SSD1306.h>
#include <SimpleTimer.h>
 

// The MQTT topics that this device should publish/subscribe
#define AWS_IOT_PUBLISH_TOPIC   "esp32/pub" //change back to esp32/pub for production
#define AWS_IOT_SUBSCRIBE_TOPIC "esp32/sub"
#define DOUT  23
#define CLK  19
#define BTRY 33
  HX711 scale;

String myString, battStr;
float batteryVal; 
String cmessage; // complete message
char buff[10];
float weight; 
float weight1, weight2, weight3, weight4, weight5;
float calibration_factor = 3000; // for me this vlaue works just perfect 206140  
int device_id = 1;
SimpleTimer timer;

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);

void connectAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to wifi");

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  // Create a message handler
  client.onMessage(messageHandler);

  Serial.print("Connecting to AWS IOT");

  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }

  if(!client.connected()){
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to a topic
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC);

  Serial.println("AWS IoT Connected!");
}

void publishMessage()
{
  scale.set_scale(calibration_factor); //Adjust to this calibration factor
  weight1 = scale.get_units(5); //5
  weight2 = scale.get_units(5);
  weight3 = scale.get_units(5);
  weight4 = scale.get_units(5);
  weight5 = scale.get_units(5);
  weight = (weight1 + weight2 + weight3 + weight4 + weight5)/5;
  weight = weight/2;
  myString = dtostrf(weight, 3, 3, buff);
  //while(weight>30 or weight<0){ //should get rid of bad measured values, don't use until correctly calibrated
  //    weight = scale.get_units(5); //5
  //    myString = dtostrf(weight, 3, 3, buff);
  //S}
  //batteryVal = (analogRead(BTRY)/1023.0)*5.0;
  //battStr = dtostrf(batteryVal,1,3, buff);
  if(Serial.available())
  {
    char temp = Serial.read();
    if(temp == '+' || temp == 'a')
      calibration_factor += 10;
    else if(temp == '-' || temp == 'z')
      calibration_factor -= 10;
  }
  StaticJsonDocument<200> doc;
  doc["device_id"] = device_id;
  doc["time"] = millis();
  doc["flow_sensor_a0"] = weight;
  //doc["battery_level"] = battStr;
  doc["stand"] = "false";
  //doc["calib factor"] = calibration_factor;
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}

void messageHandler(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);

//  StaticJsonDocument<200> doc;
//  deserializeJson(doc, payload);
//  const char* message = doc["message"];
}

void setup() {
  Serial.begin(9600);
  connectAWS();
  scale.begin(DOUT, CLK);
  //rtc_clk_cpu_freq_set(RTC_CPU_FREQ_80M);
  scale.set_scale();
  scale.tare(); //Reset the scale to 0
  long zero_factor = scale.read_average(); //Get a baseline reading
  scale.set_scale();
  scale.tare();
  Serial.print("Setup complete");
}

void loop() {
  publishMessage();
  client.loop();
  delay(3000);
}
