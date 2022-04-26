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
#define AWS_IOT_PUBLISH_TOPIC   "esp32/pub" 
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
float calibration_factor = -6200;//-6150; // value from megans laptop april 20th
int DeviceID = 1;
SimpleTimer timer;

WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);

void connectAWS()
{
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi \n");

  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to wifi \n");

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  // Create a message handler
  client.onMessage(messageHandler);

  Serial.println("Connecting to AWS IOT");

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

  Serial.println("AWS IoT Connected! \n");
}

void retake(){
  scale.set_scale(calibration_factor); //Adjust to this calibration factor
  weight = scale.get_units(5); //5
  //weight = (weight1 + weight2 + weight3 + weight4 + weight5)/5;
  Serial.println(weight);
  weight = weight*-1; 
}

void publishMessage()
{
  scale.set_scale(calibration_factor); //Adjust to this calibration factor
  weight = scale.get_units(5); //5
  //weight = (weight1 + weight2 + weight3 + weight4 + weight5)/5;

  weight = weight*-1;
    while(!(weight>=0 && weight<30)){
      retake(); 
    }
    myString = dtostrf(weight, 3, 2, buff);
    Serial.println(myString);
    
  if(Serial.available())
  {
    char temp = Serial.read();
    if(temp == '+' || temp == 'a')
      calibration_factor += 20;
    else if(temp == '-' || temp == 'z')
      calibration_factor -= 20;
    Serial.println(calibration_factor);
  }
  StaticJsonDocument<200> doc;
  //doc["DeviceID"] = DeviceID;
  //doc["time"] = millis();
  doc["flow_sensor_a0"] = myString;
  //doc["battery_level"] = battStr;
  //doc["stand"] = "false";
  //doc["calib factor"] = calibration_factor;
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer); // print to client

  client.publish(AWS_IOT_PUBLISH_TOPIC, jsonBuffer);
}

void messageHandler(String &topic, String &payload) {
  Serial.println("incoming: " + topic + " - " + payload);

  StaticJsonDocument<200> doc;
  deserializeJson(doc, payload);
  const char* message = doc["message"];
}

void setup() {
  Serial.begin(115200);
  connectAWS();
  Serial.println(AWS_IOT_PUBLISH_TOPIC);
  Serial.println("test\n");
  scale.begin(DOUT, CLK);
  //rtc_clk_cpu_freq_set(RTC_CPU_FREQ_80M);
  scale.set_scale();
  scale.tare(); //Reset the scale to 0
  long zero_factor = scale.read_average(); //Get a baseline reading
  //Serial.println(zero_factor);
  //scale.set_scale();
  //scale.tare();
  Serial.print("Setup complete");
}

void loop() {
  publishMessage();
  client.loop();
  delay(10000);
}
