// Visualizations for California Housing Data
let charts = {};
let dataCache = {
    X_all: [],
    y_all: [],
    X_test: [],
    y_test: [],
    y_pred: []
};

// Store data for visualizations
function storeDataForViz(X_all, y_all, X_test, y_test, y_pred) {
    dataCache = { X_all, y_all, X_test, y_test, y_pred };
    createAllCharts();
}

function createAllCharts() {
    createGeographicChart();
    createPredictionScatter();
    createPriceDistribution();
    createIncomeVsPriceChart();
    createAgeVsPriceChart();
    createFeatureDistributions();
}

// 1. Geographic Price Distribution (Scatter plot showing California map)
function createGeographicChart() {
    const ctx = document.getElementById('geoChart');
    if (!ctx) return;

    // Sample data for performance (use every 10th point)
    const sampleIndices = dataCache.X_all
        .map((_, i) => i)
        .filter((_, i) => i % 10 === 0);

    const geoData = sampleIndices.map(i => ({
        x: dataCache.X_all[i][7], // Longitude
        y: dataCache.X_all[i][6], // Latitude
        price: dataCache.y_all[i] * 100000
    }));

    charts.geo = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Housing Prices',
                data: geoData,
                backgroundColor: geoData.map(d => {
                    // Color based on price
                    const normalized = Math.min(d.price / 500000, 1);
                    return `rgba(${255 * normalized}, ${100 * (1 - normalized)}, ${150 * (1 - normalized)}, 0.6)`;
                }),
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.8,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'California Housing Price Map (Red = Higher Price)',
                    font: { size: 14 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Price: $${context.raw.price.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Longitude' },
                    reverse: true
                },
                y: {
                    title: { display: true, text: 'Latitude' }
                }
            }
        }
    });
}

// 2. Actual vs Predicted Scatter Plot
function createPredictionScatter() {
    const ctx = document.getElementById('predictionChart');
    if (!ctx) return;

    const scatterData = dataCache.y_test.map((actual, i) => ({
        x: actual * 100000,
        y: dataCache.y_pred[i] * 100000
    }));

    // Calculate perfect prediction line
    const minVal = Math.min(...dataCache.y_test) * 100000;
    const maxVal = Math.max(...dataCache.y_test) * 100000;

    charts.prediction = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Predictions',
                data: scatterData,
                backgroundColor: 'rgba(102, 126, 234, 0.5)',
                pointRadius: 3,
                pointHoverRadius: 5
            }, {
                label: 'Perfect Prediction',
                data: [
                    { x: minVal, y: minVal },
                    { x: maxVal, y: maxVal }
                ],
                type: 'line',
                borderColor: 'rgba(255, 99, 132, 0.8)',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            plugins: {
                legend: { display: true },
                title: {
                    display: true,
                    text: 'Model Performance: Actual vs Predicted',
                    font: { size: 14 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return [
                                    `Actual: $${context.raw.x.toLocaleString()}`,
                                    `Predicted: $${context.raw.y.toLocaleString()}`
                                ];
                            }
                            return '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Actual Price ($)' },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    }
                },
                y: {
                    title: { display: true, text: 'Predicted Price ($)' },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// 3. Price Distribution Histogram
function createPriceDistribution() {
    const ctx = document.getElementById('priceDistChart');
    if (!ctx) return;

    // Create histogram bins
    const prices = dataCache.y_all.map(p => p * 100000);
    const bins = 30;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const binSize = (maxPrice - minPrice) / bins;

    const histogram = new Array(bins).fill(0);
    prices.forEach(price => {
        const binIndex = Math.min(Math.floor((price - minPrice) / binSize), bins - 1);
        histogram[binIndex]++;
    });

    const labels = Array.from({ length: bins }, (_, i) => {
        const binStart = minPrice + i * binSize;
        return '$' + (binStart / 1000).toFixed(0) + 'K';
    });

    charts.priceDist = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Houses',
                data: histogram,
                backgroundColor: 'rgba(118, 75, 162, 0.6)',
                borderColor: 'rgba(118, 75, 162, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Distribution of Housing Prices',
                    font: { size: 14 }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Price Range' },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
                y: {
                    title: { display: true, text: 'Frequency' }
                }
            }
        }
    });
}

// 4. Income vs Price Trend
function createIncomeVsPriceChart() {
    const ctx = document.getElementById('incomeChart');
    if (!ctx) return;

    // Group by income brackets and calculate average price
    const incomeData = {};
    dataCache.X_all.forEach((features, i) => {
        const income = Math.round(features[0] * 2) / 2; // Round to nearest 0.5
        if (!incomeData[income]) {
            incomeData[income] = { sum: 0, count: 0 };
        }
        incomeData[income].sum += dataCache.y_all[i] * 100000;
        incomeData[income].count++;
    });

    const sortedIncomes = Object.keys(incomeData).sort((a, b) => parseFloat(a) - parseFloat(b));
    const avgPrices = sortedIncomes.map(inc => 
        incomeData[inc].sum / incomeData[inc].count
    );

    charts.income = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedIncomes.map(inc => '$' + (parseFloat(inc) * 10) + 'K'),
            datasets: [{
                label: 'Average House Price',
                data: avgPrices,
                borderColor: 'rgba(17, 153, 142, 1)',
                backgroundColor: 'rgba(17, 153, 142, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Median Income vs Average House Price',
                    font: { size: 14 }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Median Income' },
                    ticks: { maxTicksLimit: 12 }
                },
                y: {
                    title: { display: true, text: 'Average Price ($)' },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// 5. House Age vs Price Trend
function createAgeVsPriceChart() {
    const ctx = document.getElementById('ageChart');
    if (!ctx) return;

    // Group by age brackets
    const ageData = {};
    dataCache.X_all.forEach((features, i) => {
        const age = Math.round(features[1] / 5) * 5; // Round to nearest 5 years
        if (!ageData[age]) {
            ageData[age] = { sum: 0, count: 0 };
        }
        ageData[age].sum += dataCache.y_all[i] * 100000;
        ageData[age].count++;
    });

    const sortedAges = Object.keys(ageData).sort((a, b) => parseFloat(a) - parseFloat(b));
    const avgPrices = sortedAges.map(age => 
        ageData[age].sum / ageData[age].count
    );

    charts.age = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedAges.map(age => age + ' yrs'),
            datasets: [{
                label: 'Average House Price',
                data: avgPrices,
                borderColor: 'rgba(238, 9, 121, 1)',
                backgroundColor: 'rgba(238, 9, 121, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.2,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'House Age vs Average Price',
                    font: { size: 14 }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'House Age' },
                    ticks: { maxTicksLimit: 10 }
                },
                y: {
                    title: { display: true, text: 'Average Price ($)' },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// 6. Feature Distributions
function createFeatureDistributions() {
    const features = [
        { id: 'featureChart1', index: 0, name: 'Median Income', unit: '($10K)' },
        { id: 'featureChart2', index: 2, name: 'Average Rooms', unit: '' },
        { id: 'featureChart3', index: 4, name: 'Population', unit: '' },
        { id: 'featureChart4', index: 5, name: 'Average Occupancy', unit: '' }
    ];

    features.forEach(feature => {
        const ctx = document.getElementById(feature.id);
        if (!ctx) return;

        const values = dataCache.X_all.map(x => x[feature.index]);
        const bins = 25;
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const binSize = (maxVal - minVal) / bins;

        const histogram = new Array(bins).fill(0);
        values.forEach(val => {
            const binIndex = Math.min(Math.floor((val - minVal) / binSize), bins - 1);
            histogram[binIndex]++;
        });

        const labels = Array.from({ length: bins }, (_, i) => {
            const binStart = minVal + i * binSize;
            return binStart.toFixed(1);
        });

        charts[feature.id] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Frequency',
                    data: histogram,
                    backgroundColor: 'rgba(102, 126, 234, 0.6)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: feature.name + ' ' + feature.unit,
                        font: { size: 12 }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Value' },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            maxTicksLimit: 6
                        }
                    },
                    y: {
                        title: { display: true, text: 'Count' }
                    }
                }
            }
        });
    });
}

// Export function to be called from model.js
window.storeDataForViz = storeDataForViz;

