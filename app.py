import pandas as pd
import numpy as np
from flask import Flask, render_template, request, jsonify
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import json

app = Flask(__name__)

# Global variables to store model and data
model = None
model_stats = {}
feature_names = []
X_train_data = None
y_train_data = None

def load_and_train_model():
    """Load California housing dataset and train regression model"""
    global model, model_stats, feature_names, X_train_data, y_train_data
    
    # Load the dataset
    california = fetch_california_housing()
    X = pd.DataFrame(california.data, columns=california.feature_names)
    y = california.target
    
    feature_names = list(california.feature_names)
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Store training data for statistics
    X_train_data = X_train
    y_train_data = y_train
    
    # Train the model
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Calculate statistics
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    model_stats = {
        'r2_score': round(r2, 4),
        'rmse': round(rmse, 4),
        'mae': round(mae, 4),
        'mse': round(mse, 4),
        'train_samples': len(X_train),
        'test_samples': len(X_test),
        'coefficients': {name: round(coef, 4) for name, coef in zip(feature_names, model.coef_)},
        'intercept': round(model.intercept_, 4)
    }
    
    return X, y

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html', 
                         model_stats=model_stats, 
                         feature_names=feature_names)

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint for making predictions"""
    try:
        data = request.json
        features = [float(data[name]) for name in feature_names]
        features_array = np.array([features])
        
        prediction = model.predict(features_array)[0]
        # Convert to thousands of dollars (dataset is in 100,000s)
        prediction_dollars = prediction * 100000
        
        return jsonify({
            'success': True,
            'prediction': round(prediction, 4),
            'prediction_dollars': round(prediction_dollars, 2)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/data_stats', methods=['GET'])
def data_stats():
    """Return dataset statistics"""
    if X_train_data is not None:
        stats = {}
        for feature in feature_names:
            stats[feature] = {
                'mean': round(float(X_train_data[feature].mean()), 4),
                'std': round(float(X_train_data[feature].std()), 4),
                'min': round(float(X_train_data[feature].min()), 4),
                'max': round(float(X_train_data[feature].max()), 4)
            }
        
        stats['target'] = {
            'mean': round(float(y_train_data.mean()), 4),
            'std': round(float(y_train_data.std()), 4),
            'min': round(float(y_train_data.min()), 4),
            'max': round(float(y_train_data.max()), 4)
        }
        
        return jsonify(stats)
    else:
        return jsonify({'error': 'No data available'})

if __name__ == '__main__':
    print("Loading California Housing dataset...")
    X, y = load_and_train_model()
    print(f"Model trained successfully!")
    print(f"R² Score: {model_stats['r2_score']}")
    print(f"RMSE: {model_stats['rmse']}")
    print("\nStarting Flask server...")
    app.run(debug=True, port=5000)

