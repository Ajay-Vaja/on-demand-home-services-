# On-Demand Home Service Platform 🏠

A full-stack web application for booking on-demand home services like plumbing, cleaning, electrical work, and more.

## 🚀 Project Structure

on-demand-home-service/
├── frontend/ # React.js frontend application
├── backend/ # Django backend API
└── README.md # Project documentation


## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- CSS3
- React Router

### Backend
- Django
- Python
- Django REST Framework
- SQLite Database

## ⚙️ Setup Instructions

### Frontend Setup

cd frontend
npm install
npm start


The frontend will run on `http://localhost:3000`

### Backend Setup

cd backend
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


The backend will run on `http://localhost:8000`

## 📁 Features

- Service booking system
- User authentication and registration
- Multiple service categories (plumbing, cleaning, electrical, etc.)
- Payment integration
- Service provider profiles
- Responsive design

## 👨‍💻 Author

**Ajay Vaja**
- GitHub: [@Ajay-Vaja](https://github.com/Ajay-Vaja)

## 📄 License

This project is open source and available under the MIT License.

