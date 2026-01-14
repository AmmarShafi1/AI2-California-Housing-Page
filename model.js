// Linear Regression implementation in JavaScript
class LinearRegression {
  constructor() {
    this.coefficients = null;
    this.intercept = null;
  }

  fit(X, y) {
    const n = X.length;
    const m = X[0].length;

    // Add intercept column
    const X_with_intercept = X.map((row) => [1, ...row]);

    // Calculate using Normal Equation: theta = (X^T X)^-1 X^T y
    const XT = this.transpose(X_with_intercept);
    const XTX = this.matrixMultiply(XT, X_with_intercept);
    const XTX_inv = this.matrixInverse(XTX);
    const XTy = this.matrixVectorMultiply(XT, y);
    const theta = this.matrixVectorMultiply(XTX_inv, XTy);

    this.intercept = theta[0];
    this.coefficients = theta.slice(1);

    return this;
  }

  predict(X) {
    if (!this.coefficients) {
      throw new Error("Model not trained yet");
    }

    return X.map((row) => {
      let sum = this.intercept;
      for (let i = 0; i < row.length; i++) {
        sum += row[i] * this.coefficients[i];
      }
      return sum;
    });
  }

  transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]));
  }

  matrixMultiply(A, B) {
    const result = [];
    for (let i = 0; i < A.length; i++) {
      result[i] = [];
      for (let j = 0; j < B[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < A[0].length; k++) {
          sum += A[i][k] * B[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  matrixVectorMultiply(A, v) {
    return A.map((row) => row.reduce((sum, val, i) => sum + val * v[i], 0));
  }

  matrixInverse(matrix) {
    const n = matrix.length;
    const augmented = matrix.map((row, i) => [
      ...row,
      ...Array(n)
        .fill(0)
        .map((_, j) => (i === j ? 1 : 0)),
    ]);

    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = j;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

      const pivot = augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot;
      }

      for (let j = 0; j < n; j++) {
        if (j !== i) {
          const factor = augmented[j][i];
          for (let k = 0; k < 2 * n; k++) {
            augmented[j][k] -= factor * augmented[i][k];
          }
        }
      }
    }

    return augmented.map((row) => row.slice(n));
  }
}

// Feature names
const FEATURE_NAMES = [
  "MedInc",
  "HouseAge",
  "AveRooms",
  "AveBedrms",
  "Population",
  "AveOccup",
  "Latitude",
  "Longitude",
];

const FEATURE_INFO = {
  MedInc: { default: 3.5, step: 0.01, desc: "Example: 3.5 = $35,000" },
  HouseAge: { default: 25, step: 0.1, desc: "Average age of houses in block" },
  AveRooms: {
    default: 5.5,
    step: 0.01,
    desc: "Average number of rooms per house",
  },
  AveBedrms: { default: 1.2, step: 0.01, desc: "Average bedrooms per house" },
  Population: { default: 1500, step: 1, desc: "Block population" },
  AveOccup: { default: 3.0, step: 0.01, desc: "Average household members" },
  Latitude: { default: 37.5, step: 0.01, desc: "Geographic coordinate" },
  Longitude: { default: -122.0, step: 0.01, desc: "Geographic coordinate" },
};

let model = null;
let modelStats = {};

// Calculate model statistics
function calculateStats(yTrue, yPred) {
  const n = yTrue.length;

  // MSE
  const mse =
    yTrue.reduce((sum, val, i) => sum + Math.pow(val - yPred[i], 2), 0) / n;

  // RMSE
  const rmse = Math.sqrt(mse);

  // MAE
  const mae =
    yTrue.reduce((sum, val, i) => sum + Math.abs(val - yPred[i]), 0) / n;

  // R²
  const yMean = yTrue.reduce((sum, val) => sum + val, 0) / n;
  const ssTot = yTrue.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const ssRes = yTrue.reduce(
    (sum, val, i) => sum + Math.pow(val - yPred[i], 2),
    0
  );
  const r2 = 1 - ssRes / ssTot;

  return { mse, rmse, mae, r2 };
}

// Train/test split
function trainTestSplit(X, y, testSize = 0.2) {
  const n = X.length;
  const testN = Math.floor(n * testSize);
  const indices = Array.from({ length: n }, (_, i) => i);

  // Shuffle indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const testIndices = indices.slice(0, testN);
  const trainIndices = indices.slice(testN);

  return {
    X_train: trainIndices.map((i) => X[i]),
    X_test: testIndices.map((i) => X[i]),
    y_train: trainIndices.map((i) => y[i]),
    y_test: testIndices.map((i) => y[i]),
  };
}

// Load and train model
async function loadAndTrain() {
  try {
    // Fetch the California housing dataset
    const response = await fetch(
      "https://raw.githubusercontent.com/ageron/handson-ml2/master/datasets/housing/housing.csv"
    );
    const csvText = await response.text();

    // Parse CSV (simple parsing for this specific dataset)
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",");

    const data = [];
    const targets = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      if (values.length === headers.length) {
        // Extract features (all except median_house_value) and scale
        const longitude = parseFloat(values[0]);
        const latitude = parseFloat(values[1]);
        const housingMedianAge = parseFloat(values[2]);
        const totalRooms = parseFloat(values[3]);
        const totalBedrooms = parseFloat(values[4]);
        const population = parseFloat(values[5]);
        const households = parseFloat(values[6]);
        const medianIncome = parseFloat(values[7]);
        const medianHouseValue = parseFloat(values[8]);

        // Skip rows with missing values
        if (isNaN(totalBedrooms)) continue;

        // Calculate derived features (matching sklearn's California housing dataset)
        const aveRooms = totalRooms / households;
        const aveBedrms = totalBedrooms / households;
        const aveOccup = population / households;

        data.push([
          medianIncome,
          housingMedianAge,
          aveRooms,
          aveBedrms,
          population,
          aveOccup,
          latitude,
          longitude,
        ]);

        // Convert to hundreds of thousands
        targets.push(medianHouseValue / 100000);
      }
    }

    // Split data
    const { X_train, X_test, y_train, y_test } = trainTestSplit(
      data,
      targets,
      0.2
    );

    // Train model
    model = new LinearRegression();
    model.fit(X_train, y_train);

    // Calculate statistics
    const y_pred = model.predict(X_test);
    const stats = calculateStats(y_test, y_pred);

    modelStats = {
      r2_score: stats.r2.toFixed(4),
      rmse: stats.rmse.toFixed(4),
      mae: stats.mae.toFixed(4),
      mse: stats.mse.toFixed(4),
      train_samples: X_train.length,
      test_samples: X_test.length,
      coefficients: model.coefficients.map((c) => c.toFixed(4)),
      intercept: model.intercept.toFixed(4),
    };

    displayResults();
    
    // Store data for visualizations AFTER displaying results
    if (typeof storeDataForViz === "function") {
      console.log('Calling storeDataForViz with data...');
      storeDataForViz(data, targets, X_test, y_test, y_pred);
    } else {
      console.error('storeDataForViz function not found!');
    }
  } catch (error) {
    console.error("Error loading dataset:", error);
    document.getElementById("loading").innerHTML =
      '<p style="color: red;">Error loading dataset. Please check console for details.</p>';
  }
}

function displayResults() {
  // Hide loading
  document.getElementById("loading").style.display = "none";
  document.getElementById("content").style.display = "block";

  // Display statistics
  const statsGrid = document.getElementById("statsGrid");
  statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">R² Score</div>
            <div class="stat-value">${modelStats.r2_score}</div>
            <div class="stat-desc">Model explains ${(
              modelStats.r2_score * 100
            ).toFixed(2)}% of variance</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">RMSE</div>
            <div class="stat-value">${modelStats.rmse}</div>
            <div class="stat-desc">Root Mean Squared Error</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">MAE</div>
            <div class="stat-value">${modelStats.mae}</div>
            <div class="stat-desc">Mean Absolute Error</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Training Samples</div>
            <div class="stat-value">${modelStats.train_samples}</div>
            <div class="stat-desc">Data points used for training</div>
        </div>
    `;

  // Display intercept
  document.getElementById("interceptValue").textContent = modelStats.intercept;

  // Display coefficients
  const coefGrid = document.getElementById("coefGrid");
  coefGrid.innerHTML = FEATURE_NAMES.map((name, i) => {
    const coef = parseFloat(modelStats.coefficients[i]);
    const className = coef > 0 ? "positive" : "negative";
    return `
            <div class="coef-card ${className}">
                <div class="coef-name">${name}</div>
                <div class="coef-value">${modelStats.coefficients[i]}</div>
            </div>
        `;
  }).join("");

  // Create form
  const formGrid = document.getElementById("formGrid");
  formGrid.innerHTML = FEATURE_NAMES.map((name) => {
    const info = FEATURE_INFO[name];
    return `
            <div class="form-group">
                <label for="${name}">${name
      .replace(/([A-Z])/g, " $1")
      .trim()}</label>
                <input type="number" id="${name}" name="${name}" 
                       step="${info.step}" value="${info.default}" required>
                <small>${info.desc}</small>
            </div>
        `;
  }).join("");

  // Add form submit handler
  document
    .getElementById("predictionForm")
    .addEventListener("submit", handlePrediction);
}

function handlePrediction(e) {
  e.preventDefault();

  const features = FEATURE_NAMES.map((name) =>
    parseFloat(document.getElementById(name).value)
  );

  const prediction = model.predict([features])[0];
  const predictionDollars = prediction * 100000;

  document.getElementById("priceValue").textContent =
    predictionDollars.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const resultDiv = document.getElementById("predictionResult");
  resultDiv.classList.remove("hidden");
  resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Initialize
loadAndTrain();
