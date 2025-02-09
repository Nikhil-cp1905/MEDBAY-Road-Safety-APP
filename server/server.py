from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
from flask_cors import cross_origin
#from laptopnew import *

app = Flask(__name__)
CORS(app)  # Allows requests from frontend
#CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins
#CORS(app, resources={r"/helpform": {"origins": "http://localhost:3000"}})
#CORS(app, origins=["http://localhost:5000"]) 
# Allow specific methods
#CORS(app, resources={r"/helpprofile": {"origins": "http://localhost:5000"}}, methods=['GET'])
# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="daga",
        database="MedbayUserData"
    )

### ROUTES FOR AADHAAR USERS ###
# Route to store Aadhaar user data
@app.route('/submit', methods=['POST'])
def store_data():
    try:
        data = request.json
        db = get_db_connection()
        cursor = db.cursor()

        sql = """INSERT INTO user (name, email, phone, ecnumber, ecuser, vehicle_number, aadhaar_number,
                 bloodtype, gender, dob, medical_info) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        values = (
            data["name"], data["email"], data["phone"], data["ecnumber"], data["ecuser"],
            data["vehicle_number"], data["aadhaar_number"], data["bloodtype"],
            data["gender"], data["dob"], data["medical_info"]
        )
        cursor.execute(sql, values)
        db.commit()

        return jsonify({"message": "User data stored successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL Error: {str(err)}"}), 500
    finally:
        cursor.close()
        db.close()

# Route to handle Aadhaar user login
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        aadhaar_number = data['aadhaar_number']

        db = get_db_connection()
        cursor = db.cursor()

        sql = "SELECT * FROM user WHERE aadhaar_number = %s"
        cursor.execute(sql, (aadhaar_number,))
        user = cursor.fetchone()

        if user:
            user_data = {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "phone": user[3],
                "ecnumber": user[4],
                "ecuser": user[5],
                "vehicle_number": user[6],
                "aadhaar_number": user[7],
                "bloodtype": user[8],
                "gender": user[9],
                "dob": user[10],
                "medical_info": user[11]
            }
            return jsonify({"user": user_data}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        cursor.close()
        db.close()

# Route to fetch Aadhaar user profile
@app.route('/profile/<aadhaar_number>', methods=['GET'])
def profile(aadhaar_number):
    try:
        db = get_db_connection()
        cursor = db.cursor()

        sql = "SELECT * FROM user WHERE aadhaar_number = %s"
        cursor.execute(sql, (aadhaar_number,))
        user = cursor.fetchone()

        if user:
            user_data = {
                "id": user[0],
                "name": user[1],
                "email": user[2],
                "phone": user[3],
                "ecnumber": user[4],
                "ecuser": user[5],
                "vehicle_number": user[6],
                "aadhaar_number": user[7],
                "bloodtype": user[8],
                "gender": user[9],
                "dob": user[10],
                "medical_info": user[11]
            }
            return jsonify({"profile": user_data}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        cursor.close()
        db.close()

@app.route('/helpform', methods=['POST', 'OPTIONS'])
def register_help():
    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight request

    if request.method == 'POST':
        try:
            # Get the request data
            data = request.json
            print("Received Data:", data)  # Debugging: print incoming data

            # Database connection and cursor
            db = get_db_connection()
            cursor = db.cursor()

            # Extract form data
            name = data['name']
            email = data['email']
            phone = data['phone']
            locationplace = data['locationplace']
            helptype = data['helptype']
            password = data['password']

            # Hash the password before storing it
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # SQL query to insert new help user
            sql = """INSERT INTO help_users (name, email, phone, locationplace, helptype, password) 
                     VALUES (%s, %s, %s, %s, %s, %s)"""
            values = (name, email, phone, locationplace, helptype, hashed_password)

            # Debugging: print the query and values
            print("Executing SQL Query:", sql)
            print("Values:", values)
            
            # Execute SQL query
            cursor.execute(sql, values)
            db.commit()

            return jsonify({"message": "Help user registered successfully!"}), 201

        except mysql.connector.Error as err:
            # MySQL Error: Provide detailed error from MySQL
            print(f"MySQL Error: {str(err)}")  # Log error to console
            return jsonify({"error": f"MySQL Error: {str(err)}"}), 500
        
        except KeyError as e:
            # Handle missing data in the request
            print(f"KeyError: {str(e)}")  # Log error to console
            return jsonify({"error": f"Missing data: {str(e)}"}), 400
        
        except Exception as e:
            # Handle any other error
            print(f"Error occurred: {str(e)}")  # Log error to console
            return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

        finally:
            cursor.close()
            db.close()


 

       
# Route to handle help user login
@app.route('/helplogin', methods=['POST'])
def login_help():
    try:
        data = request.json
        email = data['email']
        password = data['password']

        db = get_db_connection()
        cursor = db.cursor()

        sql = "SELECT id, name, email, phone, locationplace, helptype, password FROM help_users WHERE email = %s"
        cursor.execute(sql, (email,))
        user = cursor.fetchone()

        if user:
            hashed_password = user[6]  # Hashed password from DB
            if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                user_data = {
                    "id": user[0],
                    "name": user[1],
                    "email": user[2],
                    "phone": user[3],
                    "locationplace": user[4],
                    "helptype": user[5]
                }
                return jsonify({
                    "success": True,
                    "id": user[0],
                    "help_user": user_data
                }), 200
            else:
                return jsonify({"error": "Incorrect password"}), 401
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        cursor.close()
        db.close()

"""# Route to fetch help user profile by email
@app.route('/helpprofile', methods=['GET'])
def helpprofile():
    email = request.args.get("email")  # Get email from query params
    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        db = get_db_connection()
        cursor = db.cursor()

        sql = "SELECT name, helptype FROM help_users WHERE LOWER(email) = LOWER(%s)"
        cursor.execute(sql, (email,))
        user = cursor.fetchone()

        if user:
            user_data = {"name": user[0], "helptype": user[1]}
            return jsonify({"help_profile": user_data}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        cursor.close()
        db.close()"""

# Load all help users at startup
help_users_data = {}

def load_help_users():
    global help_users_data
    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT email, name, helptype FROM help_users")
    users = cursor.fetchall()
    
    # Store in dictionary format
    help_users_data = {user["email"]: {"name": user["name"], "helptype": user["helptype"]} for user in users}

    cursor.close()
    db.close()
    print("✅ Help users loaded:", help_users_data)  # Debugging

load_help_users()

@app.route('/helpprofile', methods=['GET'])
def helpprofile():
    email = request.args.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    print(f"🔍 Received email: {email}")  # Debugging
    # Fetch from in-memory dictionary instead of querying DB
    user_data = help_users_data.get(email)

    if user_data:
        return jsonify({"help_profile": user_data}), 200
    else:
        return jsonify({"error": "User not found"}), 404
 

@app.route('/send_alert', methods=['POST', 'OPTIONS'])
def send_alert():
    if request.method == "OPTIONS":
        # Handle preflight request
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response, 200

    try:
        data = request.json
        db = get_db_connection()
        cursor = db.cursor()

        sql = """INSERT INTO alerts (type, location, details) 
                 VALUES (%s, %s, %s)"""
        values = (data["type"], data["location"], data["details"])

        cursor.execute(sql, values)
        db.commit()

        response = jsonify({"message": "Alert sent successfully!"})
        response.headers.add("Access-Control-Allow-Origin", "*")  # Ensure response has CORS headers
        return response, 201
    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL Error: {str(err)}"}), 500
    finally:
        cursor.close()
        db.close()

@app.route('/alerts', methods=['GET'])
def get_alerts():
    try:
        alert_type = request.args.get("type")
        if not alert_type:
            return jsonify({"error": "No help type provided"}), 400

        db = get_db_connection()
        if db is None:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = db.cursor(dictionary=True)

        sql = "SELECT * FROM alerts WHERE LOWER(type) = LOWER(%s)"
        cursor.execute(sql, (alert_type,))
        alerts = cursor.fetchall()

        cursor.close()
        db.close()

        if not alerts:
            return jsonify({"alerts": []}), 200 # Return empty list
        return jsonify({"alerts": alerts}), 200
    except sqlite3.Error as err:
        return jsonify({"error": f"Database error: {str(err)}"}), 500



def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    return response

"""@app.route('/alertsautomatic', methods=['GET'])
def get_alerts_auto():
    s = initialize_laptop()
    k = detect_accident(s)
    if k == 1:
        return jsonify({"alert": True}), 200
    return jsonify({"alert": False}), 200"""

if __name__ == "__main__":
    #load_help_users()
    app.run(debug=True, port=5000)
    
