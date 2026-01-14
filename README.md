# California Housing Price Predictor 🏠

A sleek web application that uses machine learning to predict California housing prices based on the famous California Housing Dataset. **Now with GitHub Pages support!**

## 🌐 Live Demo

**[View Live Demo](https://ammarshafi1.github.io/AI2-California-Housing-Page/)**

> Note: GitHub Pages will be live once you enable it in repository settings (see instructions below)

## Features

- 📊 **Interactive Data Visualization** - View model performance statistics
- 🤖 **Client-Side Linear Regression** - Model trained entirely in your browser
- 💰 **Price Prediction Widget** - Estimate housing prices based on various features
- 📈 **Model Statistics** - R² score, RMSE, MAE, and feature coefficients
- 🎨 **Modern UI** - Clean and responsive design
- 🚀 **Static Hosting** - Works on GitHub Pages, no server required!

## Quick Start (GitHub Pages Version)

### Option 1: View Locally

Simply open `index.html` in your web browser. That's it!

Or use a local server:

```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000
```

### Option 2: Deploy to GitHub Pages

See **[DEPLOY.md](DEPLOY.md)** for detailed deployment instructions.

Quick steps:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Then enable GitHub Pages in your repository settings!

## 🐍 Python/Flask Version (Optional)

If you prefer running the Flask backend version:

1. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

2. **Run the Flask application:**

```bash
python app.py
```

3. **Open your browser:**

```
http://localhost:5000
```

## Dataset Information

The California Housing Dataset contains information from the 1990 U.S. Census:

- **MedInc**: Median income in block group (tens of thousands of dollars)
- **HouseAge**: Median house age in block group
- **AveRooms**: Average number of rooms per household
- **AveBedrms**: Average number of bedrooms per household
- **Population**: Block group population
- **AveOccup**: Average number of household members
- **Latitude**: Block group latitude
- **Longitude**: Block group longitude

**Target Variable**: Median house value (in hundreds of thousands of dollars)

## Model Details

- **Algorithm**: Linear Regression
- **Training/Test Split**: 80/20
- **Features**: 8 input features
- **Target**: Housing price (median house value)

## Project Structure

```
.
├── app.py                 # Flask application and ML model
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
└── static/
    └── style.css         # Styling and design
```

## Technologies Used

- **Backend**: Python, Flask
- **Machine Learning**: scikit-learn
- **Data Processing**: pandas, numpy
- **Frontend**: HTML5, CSS3, JavaScript
- **Design**: Modern gradient UI with responsive layout

## Example Usage

1. Open the web interface
2. Scroll to the "Housing Price Estimator" section
3. Enter values for all features:
   - Median Income: 3.5 (representing $35,000)
   - House Age: 25 years
   - Average Rooms: 5.5
   - Average Bedrooms: 1.2
   - Population: 1500
   - Average Occupancy: 3.0
   - Latitude: 37.5
   - Longitude: -122.0
4. Click "Predict Price" to see the estimated housing value

## License

This project is for educational purposes. The California Housing Dataset is publicly available through scikit-learn.

## Analytics

This site uses Google Analytics to track visitor demographics and usage patterns. See [ANALYTICS-SETUP.md](ANALYTICS-SETUP.md) for setup instructions and [PRIVACY-POLICY.md](PRIVACY-POLICY.md) for privacy information.

### What's Tracked:
- Visitor geographic location (city/region/country)
- Page views and engagement
- Device types and browsers
- Custom events (predictions made)

### What's NOT Tracked:
- Your prediction input values stay in your browser
- No personal information collected
- No form data sent to servers

## Author

Built with ❤️ using Python and Flask
