from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///emergency_portal.db'
db = SQLAlchemy(app)

class Hospital(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'phone': self.phone,
            'capacity': self.capacity,
            'created_at': self.created_at.isoformat()
        }

@app.route('/health')
def health_check():
    return jsonify({"status": "OK"}), 200

@app.route('/api/hospitals', methods=['POST'])
def register_hospital():
    data = request.json
    new_hospital = Hospital(
        name=data['name'],
        address=data['address'],
        phone=data['phone'],
        capacity=data['capacity']
    )
    db.session.add(new_hospital)
    db.session.commit()
    return jsonify(new_hospital.to_dict()), 201

@app.route('/api/hospitals', methods=['GET'])
def get_hospitals():
    hospitals = Hospital.query.all()
    return jsonify([hospital.to_dict() for hospital in hospitals]), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)