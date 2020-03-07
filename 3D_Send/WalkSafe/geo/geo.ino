
const int  button = 5;   
  
int buttonState = 0;         
int lastButtonState = 0;     

void setup() {
  pinMode(button, INPUT);
  Serial.begin(9600);
}


void loop() {
  buttonState = digitalRead(button);

  
    if (buttonState == HIGH) {
        Serial.println("1");
 delay(100);
    } else if(buttonState == LOW) {
      Serial.println("0");
 delay(100);
    }
    
 
  lastButtonState = buttonState;


}
