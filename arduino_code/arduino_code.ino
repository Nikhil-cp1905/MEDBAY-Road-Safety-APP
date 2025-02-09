int sensorPin = A0;
int sensorValue = 0;
void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  sensorValue = analogRead(sensorPin);
  if (sensorValue >= 400)
  {
    Serial.println(1);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
  }
  else {digitalWrite(LED_BUILTIN, LOW);
  Serial.println(0);
}
}
