import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin
import socket 
app = Flask(__name__)
CORS(app)  # Allows requests from frontend

def initialize_laptop():
    s = socket.socket()
    port = 8000
    s.connect(('192.168.28.102', port))
    return s
def detect_accident(s):
    while True:
        status = s.recv(1024).decode()
        print(status)
        if status == 'ALERT: EMERGENCY':
            return 1
def main():
    s = initialize_laptop()
    check = detect_accident(s)
    if check == 1:
	print("ACCIDENT OCCURED")

if __name__ == "__main__":
    main()

