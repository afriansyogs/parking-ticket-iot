#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>


// Gerbang
const int servoPin = 13;
const int buttonPin = 33;
const int angleClose = 0;
const int angleOpen = 90;
const int irGatePin = 27;

const int jumlahSlot = 3;
bool mobilSedangLewat = false;
const int batasJarak = 10; 
int slotTerisi = 0;
int slotTersedia = jumlahSlot;
long duration;
bool gerbangTerbuka = false;

// ultrasonik
const int trigPins[jumlahSlot] = {18, 5, 32};
const int echoPins[jumlahSlot] = {19, 17, 35};

// LED 
const int ledHijauPins[jumlahSlot] = {2, 16, 25};
const int ledMerahPins[jumlahSlot] = {4, 15, 26};


Servo gateServo;
LiquidCrystal_I2C lcd(0x27, 16, 2); 


int measureDistance(int triggerPin, int echoPin) {
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2; // cepat lambat gelombang | s = (v*t)/2
}

void setGate(int angle) {
  gateServo.write(angle);
  delay(1000);
  gerbangTerbuka = (angle == angleOpen);
}

void setup() {
  Serial.begin(115200);

  // Setup pin
  for (int i = 0; i < jumlahSlot; i++) {
    pinMode(trigPins[i], OUTPUT);
    pinMode(echoPins[i], INPUT);
    pinMode(ledHijauPins[i], OUTPUT);
    pinMode(ledMerahPins[i], OUTPUT);
  }

  // Setup gerbang
  gateServo.attach(servoPin);
  setGate(angleClose);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(irGatePin, INPUT); 

  // Setup LCD
  lcd.init();
  lcd.backlight(); 
  lcd.setCursor(0, 0);
  lcd.print("Sistem Parkir");
  delay(1000);
}

void loop() {
  int hitungKosong = 0;
  int slotKosong[3];
  int jumlahSlotKosong = 0; 

 for (int i = 0; i < jumlahSlot; i++) {
    int jarak = measureDistance(trigPins[i], echoPins[i]);

    if (jarak < batasJarak && jarak > 0) {
      digitalWrite(ledHijauPins[i], LOW);
      digitalWrite(ledMerahPins[i], HIGH);
    } else {
      digitalWrite(ledHijauPins[i], HIGH);
      digitalWrite(ledMerahPins[i], LOW);
      hitungKosong++;
      
      slotKosong[jumlahSlotKosong] = i + 1;  
      jumlahSlotKosong++;
    }
  }
  
  slotTersedia = hitungKosong;

  // send slot parkir kosong
  Serial.print("[");
  for (int i = 0; i < jumlahSlotKosong; i++) {
    Serial.print(slotKosong[i]);
    if (i < jumlahSlotKosong - 1) Serial.print(",");
  }
  Serial.println("]");


  if (digitalRead(buttonPin) == LOW && !gerbangTerbuka) {
    //Serial.println("Tombol Ditekan -> Membuka Gerbang");
    setGate(angleOpen);
    delay(500);
    gerbangTerbuka = true;
  }
  
  int irStatus = digitalRead(irGatePin);

  if(irStatus == LOW && gerbangTerbuka) {
    //Serial.println("gerbang mau nutup");
    // delay(500);
    setGate(angleClose); 
  }

  lcd.clear();
  lcd.setCursor(0, 0);
  if (gerbangTerbuka) {
    lcd.print("HATI-HATI!");
    lcd.setCursor(0, 1);
    lcd.print(mobilSedangLewat ? "Mobil Lewat..." : "Silakan Masuk");
  } else {
    lcd.print("PARKIR: ");
    lcd.print(slotTersedia > 0 ? "TERSEDIA" : "PENUH");
    lcd.setCursor(0, 1);
    lcd.print("Sisa Slot: ");
    lcd.print(slotTersedia);
    lcd.print("/" + String(jumlahSlot) + "    ");
  }

  //Serial.print(" Jarak nih: ");
  // Serial.print(jarak);
  //Serial.print(" cm ");
  
  delay(200); 
}