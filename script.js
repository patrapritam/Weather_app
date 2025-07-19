// Enhanced Weather Dashboard with Unique Real-Life Features
let temperatureChart;
let temperatureData = [];
let lastNotificationTime = {};
let energyChart;
let plantCareReminders = [];

// API Configuration
const API_KEY = 'ec85cc05f2bb1af55811c674d2ae3095';

// Plant Care Database
const plantDatabase = {
  'tomato': { minTemp: 15, maxTemp: 29, waterFreq: 2, sunlight: 'full' },
  'lettuce': { minTemp: 7, maxTemp: 24, waterFreq: 1, sunlight: 'partial' },
  'basil': { minTemp: 18, maxTemp: 27, waterFreq: 2, sunlight: 'full' },
  'rose': { minTemp: 5, maxTemp: 30, waterFreq: 3, sunlight: 'full' },
  'mint': { minTemp: 10, maxTemp: 25, waterFreq: 1, sunlight: 'partial' },
  'pepper': { minTemp: 20, maxTemp: 32, waterFreq: 2, sunlight: 'full' },
  'spinach': { minTemp: 2, maxTemp: 20, waterFreq: 1, sunlight: 'partial' }
};

// Energy efficiency calculator (changed to INR)
function calculateHeatingCoolingCost(currentTemp, targetTemp, houseSize = 100) {
  const tempDiff = Math.abs(currentTemp - targetTemp);
  const baseRate = 10; // per kWh in INR (Indian Rupees)
  const efficiencyFactor = houseSize / 100; // square meters
  
  let energyNeeded = 0;
  if (currentTemp < targetTemp) {
    // Heating needed
    energyNeeded = tempDiff * 0.5 * efficiencyFactor; // kWh for heating
  } else if (currentTemp > targetTemp) {
    // Cooling needed  
    energyNeeded = tempDiff * 0.8 * efficiencyFactor; // kWh for cooling (AC less efficient)
  }
  
  const hourlyCost = energyNeeded * baseRate;
  const dailyCost = hourlyCost * 24;
  
  return {
    hourly: hourlyCost.toFixed(2),
    daily: dailyCost.toFixed(2),
    energyKwh: energyNeeded.toFixed(1),
    recommendation: getEnergyRecommendation(tempDiff, currentTemp, targetTemp)
  };
}

function getEnergyRecommendation(tempDiff, current, target) {
  if (tempDiff < 2) return "👍 Optimal! Minimal energy needed.";
  if (current < target) {
    if (tempDiff > 10) return "🏠 Consider wearing warm clothes first before heating.";
    return "🔥 Light heating recommended. Try 1-2°C lower target.";
  } else {
    if (tempDiff > 10) return "🌬️ Use fans first, then AC. Open windows at night.";
    return "❄️ Light cooling needed. Try raising thermostat by 1-2°C.";
  }
}

// Sleep quality predictor
function getSleepQualityPrediction(temp, humidity, pressure) {
  let score = 100;
  let issues = [];
  
  // Ideal sleep temperature: 16-19°C
  if (temp < 16) {
    score -= (16 - temp) * 5;
    issues.push("🥶 Too cold - may cause restless sleep");
  } else if (temp > 19) {
    score -= (temp - 19) * 7;
    issues.push("🔥 Too warm - may reduce deep sleep");
  }
  
  // Ideal humidity: 40-60%
  if (humidity < 40) {
    score -= (40 - humidity) / 2;
    issues.push("🏜️ Low humidity - may cause dry throat/nose");
  } else if (humidity > 60) {
    score -= (humidity - 60) / 2;
    issues.push("💧 High humidity - may feel stuffy");
  }
  
  // Pressure effects
  if (pressure < 1000) {
    score -= 10;
    issues.push("📉 Low pressure - may cause headaches");
  }
  
  score = Math.max(0, Math.min(100, score));
  
  let quality = "😴 Excellent";
  if (score < 40) quality = "😣 Poor";
  else if (score < 60) quality = "😐 Fair";
  else if (score < 80) quality = "😊 Good";
  
  return { score: Math.round(score), quality, issues };
}

// Food storage advisor
function getFoodStorageAdvice(temp, humidity) {
  const advice = [];
  
  if (temp > 25) {
    advice.push("🍎 Store fruits in refrigerator");
    advice.push("🥛 Check dairy products more frequently");
    advice.push("🍞 Keep bread in cool, dry place");
  }
  
  if (humidity > 70) {
    advice.push("🧂 Keep salt/sugar in airtight containers");
    advice.push("🍪 Store crackers/cereals with desiccant");
    advice.push("🧀 Wrap cheese in breathable paper");
  }
  
  if (temp < 10) {
    advice.push("🥔 Don't refrigerate potatoes/onions");
    advice.push("🍌 Bananas may brown faster in cold");
  }
  
  if (humidity < 40) {
    advice.push("🥖 Cover bread to prevent drying");
    advice.push("🧄 Store garlic in ventilated container");
  }
  
  return advice;
}

// Exercise safety advisor
function getExerciseAdvice(temp, humidity, windSpeed) {
  const heatIndex = calculateHeatIndex(temp, humidity);
  let advice = [];
  let safetyLevel = "safe";
  
  if (heatIndex > 32) {
    safetyLevel = "dangerous";
    advice.push("⚠️ Avoid outdoor exercise - heat stroke risk");
    advice.push("🏠 Exercise indoors with AC");
  } else if (heatIndex > 27) {
    safetyLevel = "caution";
    advice.push("⚡ Exercise only in early morning/evening");
    advice.push("💧 Drink water every 15 minutes");
    advice.push("🌳 Seek shade frequently");
  } else if (temp < 0) {
    safetyLevel = "caution";
    advice.push("🧥 Warm up indoors first");
    advice.push("👟 Wear proper winter gear");
    advice.push("🏃 Start slowly to prevent injury");
  } else if (windSpeed > 10) {
    advice.push("💨 Strong winds - be careful with balance");
    advice.push("🧥 Wear wind-resistant clothing");
  } else {
    advice.push("✅ Great conditions for outdoor exercise!");
    advice.push("🏃 Perfect for running, cycling, or walking");
  }
  
  return { advice, safetyLevel, heatIndex: heatIndex.toFixed(1) };
}

function calculateHeatIndex(temp, humidity) {
  // Simplified heat index calculation
  const tempF = (temp * 9/5) + 32;
  if (tempF < 80) return temp;
  
  const hi = -42.379 + 2.04901523 * tempF + 10.14333127 * humidity 
    - 0.22475541 * tempF * humidity - 6.83783e-3 * tempF * tempF
    - 5.481717e-2 * humidity * humidity + 1.22874e-3 * tempF * tempF * humidity
    + 8.5282e-4 * tempF * humidity * humidity - 1.99e-6 * tempF * tempF * humidity * humidity;
  
  return (hi - 32) * 5/9; // Convert back to Celsius
}

// Pet comfort advisor
function getPetComfortAdvice(temp, humidity) {
  const advice = [];
  
  if (temp > 26) {
    advice.push("🐕 Dogs need extra water and shade");
    advice.push("🐾 Avoid hot pavement - check with hand");
    advice.push("❄️ Consider cooling mats for pets");
  }
  
  if (temp < 5) {
    advice.push("🧥 Small/short-haired pets need sweaters");
    advice.push("🏠 Limit outdoor time for cats");
    advice.push("🔥 Provide warm bedding");
  }
  
  if (humidity > 80) {
    advice.push("🌬️ Ensure good ventilation for pet areas");
    advice.push("💧 Monitor for excessive panting");
  }
  
  return advice;
}

// Laundry advisor
function getLaundryAdvice(temp, humidity, windSpeed) {
  const advice = [];
  
  if (humidity < 50 && temp > 20 && windSpeed > 3) {
    advice.push("👕 Perfect drying conditions!");
    advice.push("⏰ Clothes will dry in 2-4 hours");
  } else if (humidity > 80) {
    advice.push("🏠 Use indoor drying or dryer");
    advice.push("⚠️ Outdoor drying may take 8+ hours");
  } else if (temp < 10) {
    advice.push("❄️ Clothes may freeze - use heated indoor space");
  } else {
    advice.push("⏰ Normal drying time: 4-6 hours");
  }
  
  return advice;
}

// Plant care advisor
function getPlantCareAdvice(temp, humidity, selectedPlants = []) {
  const advice = [];
  
  selectedPlants.forEach(plant => {
    const plantInfo = plantDatabase[plant];
    if (!plantInfo) return;
    
    if (temp < plantInfo.minTemp) {
      advice.push(`🌱 ${plant}: Too cold! Bring indoors or cover`);
    } else if (temp > plantInfo.maxTemp) {
      advice.push(`🌱 ${plant}: Too hot! Provide shade and extra water`);
    } else {
      advice.push(`🌱 ${plant}: Good temperature conditions`);
    }
    
    if (humidity < 40) {
      advice.push(`💧 ${plant}: Low humidity - mist leaves or use humidifier`);
    }
  });
  
  return advice;
}

// Air quality predictor (based on weather conditions)
function getAirQualityPrediction(temp, humidity, pressure, windSpeed) {
  let quality = "Good";
  let score = 80;
  const factors = [];
  
  // High pressure + low wind = pollutant buildup
  if (pressure > 1020 && windSpeed < 2) {
    score -= 20;
    factors.push("🏭 High pressure + low wind may trap pollutants");
  }
  
  // High humidity can worsen air quality
  if (humidity > 80) {
    score -= 10;
    factors.push("💧 High humidity may worsen air quality");
  }
  
  // Temperature inversions
  if (temp < 15 && pressure > 1015) {
    score -= 15;
    factors.push("🌫️ Cold + high pressure may create smog");
  }
  
  if (score < 30) quality = "Poor";
  else if (score < 50) quality = "Moderate";
  else if (score < 70) quality = "Fair";
  
  return { quality, score, factors };
}

// Load existing functions (keeping all previous functionality)
async function loadSensorData() {
  try {
    const response = await fetch('./sensors.json');
    const sensorData = await response.json();
    console.log('Loaded sensor data from JSON file');
    
    const now = new Date();
    return sensorData.map((item, index) => ({
      temperature: item.temperature,
      timestamp: new Date(now.getTime() - (sensorData.length - 1 - index) * 1 * 60 * 1000),
      humidity: Math.floor(Math.random() * 20) + 60,
      pressure: Math.floor(Math.random() * 50) + 1000,
      windSpeed: Math.random() * 5 + 2,
      location: item.location,
      sensorId: item.sensor_id
    }));
  } catch (error) {
    console.error('Error loading sensor data:', error);
    return null;
  }
}

function generateDemoData() {
  console.log('Using generated demo data');
  const data = [];
  const now = new Date();
  const baseTemp = 22;
  
  for (let i = 7; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 1 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 4;
    const temperature = Math.round((baseTemp + variation) * 10) / 10;
    
    data.push({
      temperature: temperature,
      timestamp: timestamp,
      humidity: Math.floor(Math.random() * 20) + 60,
      pressure: Math.floor(Math.random() * 50) + 1000,
      windSpeed: Math.random() * 5 + 2,
      location: 'Demo Location',
      sensorId: 'DEMO_001'
    });
  }
  
  return data;
}

async function searchLocation(locationName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=5&appid=${API_KEY}`
    );
    
    if (response.ok) {
      const locations = await response.json();
      return locations.map(loc => ({
        name: `${loc.name}, ${loc.country}`,
        lat: loc.lat,
        lon: loc.lon,
        state: loc.state || ''
      }));
    }
  } catch (error) {
    console.error('Error searching location:', error);
  }
  return [];
}

async function fetchRealWeatherData(lat, lon, locationName = null) {
  try {
    try {
      const onecallResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${API_KEY}&units=metric`
      );
      
      if (onecallResponse.ok) {
        const onecallData = await onecallResponse.json();
        console.log('OneCall API Response:', onecallData);
        
        const currentTemp = Math.round(onecallData.current.temp * 10) / 10;
        console.log('Using OneCall API 3.0 data - Temperature:', `${currentTemp}°C`);
        
        const data = [];
        const now = new Date();
        
        for (let i = 7; i >= 0; i--) {
          const timestamp = new Date(now.getTime() - i * 1 * 60 * 1000);
          const variation = (Math.random() - 0.5) * 2;
          const temperature = Math.round((currentTemp + variation) * 10) / 10;
          
          data.push({
            temperature: temperature,
            timestamp: timestamp,
            humidity: onecallData.current.humidity || Math.floor(Math.random() * 20) + 60,
            pressure: onecallData.current.pressure || Math.floor(Math.random() * 50) + 1000,
            windSpeed: onecallData.current.wind_speed || Math.random() * 5 + 2,
            location: locationName || 'Current Location',
            sensorId: 'LIVE_WEATHER'
          });
        }
        
        return data;
      }
    } catch (onecallError) {
      console.log('OneCall API not available, trying Current Weather API...');
    }
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const weatherData = await response.json();
    console.log('API Response:', weatherData);
    
    const currentTemp = Math.round(weatherData.main.temp * 10) / 10;
    console.log('Using Current Weather API data - Temperature:', `${currentTemp}°C`);
    
    const data = [];
    const now = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 1 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 2;
      const temperature = Math.round((currentTemp + variation) * 10) / 10;
      
      data.push({
        temperature: temperature,
        timestamp: timestamp,
        humidity: weatherData.main.humidity || Math.floor(Math.random() * 20) + 60,
        pressure: weatherData.main.pressure || Math.floor(Math.random() * 50) + 1000,
        windSpeed: weatherData.wind?.speed || Math.random() * 5 + 2,
        location: locationName || 'Current Location',
        sensorId: 'LIVE_WEATHER'
      });
    }
    
    return data;
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    const sensorData = await loadSensorData();
    if (sensorData) {
      console.log('Using sensor data from JSON file as fallback');
      return sensorData;
    }
    
    console.log('API failed and no sensor data available, using demo data');
    return generateDemoData();
  }
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
}

async function getLocationName(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (response.ok) {
      const locationData = await response.json();
      if (locationData.length > 0) {
        const location = locationData[0];
        return `${location.name}, ${location.country}`;
      }
    }
  } catch (error) {
    console.error('Error getting location name:', error);
  }
  
  return 'Unknown Location';
}

function showNotification(title, message, type = 'info') {
  const now = Date.now();
  const key = `${title}_${type}`;
  
  if (lastNotificationTime[key] && (now - lastNotificationTime[key]) < 300000) {
    return;
  }
  
  lastNotificationTime[key] = now;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 8000);
}

function checkAndNotify(data) {
  const latestData = data[data.length - 1];
  const temp = latestData.temperature;
  const preferredTemp = userSettings.preferredTemp;
  const tempDiff = temp - preferredTemp;
  
  if (userSettings.tempAlerts) {
    if (temp > preferredTemp) {
      showNotification(
        '🔥 Temperature Above Preference!',
        `Current temperature is ${temp}°C, which is ${tempDiff.toFixed(1)}°C above your preferred ${preferredTemp}°C. Consider cooling measures!`,
        'warning'
      );
    } else if (temp < preferredTemp && tempDiff < -2) {
      showNotification(
        '🥶 Temperature Below Preference!',
        `Current temperature is ${temp}°C, which is ${Math.abs(tempDiff).toFixed(1)}°C below your preferred ${preferredTemp}°C. Consider warming up!`,
        'warning'
      );
    }
  }
}

function createChart(data) {
  const ctx = document.getElementById('temperatureChart').getContext('2d');
  
  if (temperatureChart) {
    temperatureChart.destroy();
  }
  
  temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(item => item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})),
      datasets: [{
        label: 'Temperature (°C)',
        data: data.map(item => item.temperature),
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ff6b6b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#333',
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0,0,0,0.1)'
          },
          ticks: {
            color: '#333',
            font: {
              size: 12
            }
          }
        },
        x: {
          grid: {
            color: 'rgba(0,0,0,0.1)'
          },
          ticks: {
            color: '#333',
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
}

function getClothingSuggestion(temp, preferredTemp) {
  const tempDiff = temp - preferredTemp;
  
  if (temp < 0) {
    return {
      suggestion: "Heavy winter coat, thermal layers, gloves, hat, warm boots",
      icon: "🧥❄️",
      comfort: "Very Cold"
    };
  } else if (temp < 10) {
    return {
      suggestion: "Warm jacket or coat, long sleeves, jeans or warm pants",
      icon: "🧥",
      comfort: "Cold"
    };
  } else if (temp < 15) {
    return {
      suggestion: "Light jacket or sweater, long pants",
      icon: "👔",
      comfort: "Cool"
    };
  } else if (temp >= 15 && temp <= 25) {
    return {
      suggestion: "Comfortable clothing, t-shirt or light shirt",
      icon: "👕",
      comfort: "Comfortable"
    };
  } else if (temp < 30) {
    return {
      suggestion: "Light, breathable clothing, shorts or light pants",
      icon: "🩳",
      comfort: "Warm"
    };
  } else if (temp < 35) {
    return {
      suggestion: "Very light clothing, stay in shade, drink water",
      icon: "🌞",
      comfort: "Hot"
    };
  } else {
    return {
      suggestion: "Minimal clothing, stay indoors with AC, hydrate frequently",
      icon: "🔥",
      comfort: "Very Hot"
    };
  }
}

function updateDataCards(data) {
  const latestData = data[data.length - 1];
  const clothingSuggestion = getClothingSuggestion(latestData.temperature, userSettings.preferredTemp);
  const energyData = calculateHeatingCoolingCost(latestData.temperature, userSettings.preferredTemp, userSettings.houseSize || 100);
  const sleepData = getSleepQualityPrediction(latestData.temperature, latestData.humidity, latestData.pressure);
  const exerciseData = getExerciseAdvice(latestData.temperature, latestData.humidity, latestData.windSpeed);
  const airQualityData = getAirQualityPrediction(latestData.temperature, latestData.humidity, latestData.pressure, latestData.windSpeed);
  const foodAdvice = getFoodStorageAdvice(latestData.temperature, latestData.humidity);
  const petAdvice = getPetComfortAdvice(latestData.temperature, latestData.humidity);
  const laundryAdvice = getLaundryAdvice(latestData.temperature, latestData.humidity, latestData.windSpeed);
  const plantAdvice = getPlantCareAdvice(latestData.temperature, latestData.humidity, userSettings.plants || []);
  
  let tempRecommendation = '';
  let tempIcon = '';
  let tempClass = '';
  const preferredTemp = userSettings.preferredTemp;
  const tempDiff = latestData.temperature - preferredTemp;
  
  if (tempDiff <= -10) {
    tempRecommendation = `Much colder than your preference (${preferredTemp}°C)`;
    tempIcon = '🥶';
    tempClass = 'cold';
  } else if (tempDiff <= -5) {
    tempRecommendation = `Cooler than your preference (${preferredTemp}°C)`;
    tempIcon = '🧥';
    tempClass = 'cool';
  } else if (tempDiff >= -2 && tempDiff <= 2) {
    tempRecommendation = `Perfect! Close to your preference (${preferredTemp}°C)`;
    tempIcon = '😊';
    tempClass = 'comfortable';
  } else if (tempDiff <= 5) {
    tempRecommendation = `Warmer than your preference (${preferredTemp}°C)`;
    tempIcon = '🌞';
    tempClass = 'warm';
  } else if (tempDiff <= 10) {
    tempRecommendation = `Much warmer than your preference (${preferredTemp}°C)`;
    tempIcon = '🔥';
    tempClass = 'hot';
  } else {
    tempRecommendation = `Very hot compared to your preference (${preferredTemp}°C)`;
    tempIcon = '🌡️';
    tempClass = 'very-hot';
  }
  
  let humidityRecommendation = '';
  let humidityIcon = '';
  
  if (latestData.humidity < 40) {
    humidityRecommendation = 'Low humidity - Consider humidifier';
    humidityIcon = '🏜️';
  } else if (latestData.humidity >= 40 && latestData.humidity <= 60) {
    humidityRecommendation = 'Optimal humidity level';
    humidityIcon = '✅';
  } else {
    humidityRecommendation = 'High humidity - Ensure ventilation';
    humidityIcon = '💧';
  }
  
  const container = document.getElementById('data-container');
  container.innerHTML = `
    <div class="data-card temperature-card ${tempClass}">
      <div class="data-icon">${tempIcon}</div>
      <div class="data-content">
        <h3>Current Temperature</h3>
        <div class="data-value">${latestData.temperature}°C</div>
        <div class="data-recommendation">${tempRecommendation}</div>
        <div class="data-time">Updated: ${latestData.timestamp.toLocaleTimeString()}</div>
      </div>
    </div>
    
    <div class="data-card energy-card">
      <div class="data-icon">⚡</div>
      <div class="data-content">
        <h3>Energy Cost Estimate</h3>
        <div class="data-value">₹${energyData.daily}/day</div>
        <div class="data-recommendation">${energyData.recommendation}</div>
        <div class="data-time">${energyData.energyKwh} kWh needed</div>
      </div>
    </div>
    
    <div class="data-card sleep-card">
      <div class="data-icon">😴</div>
      <div class="data-content">
        <h3>Sleep Quality Prediction</h3>
        <div class="data-value">${sleepData.quality}</div>
        <div class="data-recommendation">${sleepData.issues.slice(0,2).join(', ')}</div>
        <div class="data-time">Score: ${sleepData.score}/100</div>
      </div>
    </div>
    
    <div class="data-card exercise-card">
      <div class="data-icon">🏃</div>
      <div class="data-content">
        <h3>Exercise Safety</h3>
        <div class="data-value">${exerciseData.safetyLevel.toUpperCase()}</div>
        <div class="data-recommendation">${exerciseData.advice.slice(0,2).join(', ')}</div>
        <div class="data-time">Heat Index: ${exerciseData.heatIndex}°C</div>
      </div>
    </div>
    
    <div class="data-card air-quality-card">
      <div class="data-icon">🌬️</div>
      <div class="data-content">
        <h3>Air Quality Forecast</h3>
        <div class="data-value">${airQualityData.quality}</div>
        <div class="data-recommendation">${airQualityData.factors.slice(0,1).join('')}</div>
        <div class="data-time">Score: ${airQualityData.score}/100</div>
      </div>
    </div>
    
    <div class="data-card food-card">
      <div class="data-icon">🍎</div>
      <div class="data-content">
        <h3>Food Storage Tips</h3>
        <div class="data-value">${foodAdvice.length} tips</div>
        <div class="data-recommendation">${foodAdvice.slice(0,2).join(', ')}</div>
      </div>
    </div>
    
    <div class="data-card clothing-card">
      <div class="data-icon">${clothingSuggestion.icon}</div>
      <div class="data-content">
        <h3>Clothing Suggestion</h3>
        <div class="data-value">${clothingSuggestion.comfort}</div>
        <div class="data-recommendation">${clothingSuggestion.suggestion}</div>
      </div>
    </div>
    
    <div class="data-card humidity-card">
      <div class="data-icon">${humidityIcon}</div>
      <div class="data-content">
        <h3>Humidity</h3>
        <div class="data-value">${latestData.humidity}%</div>
        <div class="data-recommendation">${humidityRecommendation}</div>
      </div>
    </div>
    
    <div class="data-card pet-card">
      <div class="data-icon">🐕</div>
      <div class="data-content">
        <h3>Pet Care</h3>
        <div class="data-value">${petAdvice.length} tips</div>
        <div class="data-recommendation">${petAdvice.slice(0,2).join(', ')}</div>
      </div>
    </div>
    
    <div class="data-card laundry-card">
      <div class="data-icon">👕</div>
      <div class="data-content">
        <h3>Laundry Conditions</h3>
        <div class="data-value">${laundryAdvice.length} tips</div>
        <div class="data-recommendation">${laundryAdvice.slice(0,2).join(', ')}</div>
      </div>
    </div>
  `;
  
  checkAndNotify(data);
}

let userSettings = {
  preferredTemp: 22,
  tempAlerts: true,
  comfortAlerts: true,
  weatherAlerts: true,
  useManualLocation: false,
  manualLocationName: '',
  manualLat: null,
  manualLon: null,
  houseSize: 100,
  plants: []
};

function loadSettings() {
  const saved = localStorage.getItem('temperatureSettings');
  if (saved) {
    userSettings = { ...userSettings, ...JSON.parse(saved) };
  }
}

function saveSettings() {
  localStorage.setItem('temperatureSettings', JSON.stringify(userSettings));
}

function applySettings() {
  document.getElementById('temp-alerts').checked = userSettings.tempAlerts;
  document.getElementById('comfort-alerts').checked = userSettings.comfortAlerts;
  document.getElementById('weather-alerts').checked = userSettings.weatherAlerts;
  document.getElementById('preferred-temp').value = userSettings.preferredTemp;
  document.getElementById('manual-location').checked = userSettings.useManualLocation;
  document.getElementById('location-name-input').value = userSettings.manualLocationName;
  document.getElementById('latitude-input').value = userSettings.manualLat || '';
  document.getElementById('longitude-input').value = userSettings.manualLon || '';
  document.getElementById('house-size').value = userSettings.houseSize || 100;
  
  const manualInputs = document.getElementById('manual-location-inputs');
  manualInputs.style.display = userSettings.useManualLocation ? 'block' : 'none';
}

let searchTimeout;

async function handleLocationSearch() {
  const searchTerm = document.getElementById('location-search').value.trim();
  if (!searchTerm) {
    document.getElementById('search-results').style.display = 'none';
    return;
  }
  
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // Add debouncing to avoid too many API calls
  searchTimeout = setTimeout(async () => {
    const results = await searchLocation(searchTerm);
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="search-result">No locations found</div>';
      resultsContainer.style.display = 'block';
      return;
    }
    
    resultsContainer.innerHTML = results.map(location => 
      `<div class="search-result" onclick="selectLocation(${location.lat}, ${location.lon}, '${location.name}')">
        📍 ${location.name}${location.state ? `, ${location.state}` : ''}
      </div>`
    ).join('');
    
    resultsContainer.style.display = 'block';
  }, 300); // Wait 300ms after user stops typing
}

// Function to handle search input in real-time
function handleSearchInput() {
  const searchInput = document.getElementById('location-search');
  const searchTerm = searchInput.value.trim();
  
  if (searchTerm.length >= 2) {
    handleLocationSearch();
  } else {
    document.getElementById('search-results').style.display = 'none';
  }
}

async function selectLocation(lat, lon, name) {
  document.getElementById('search-results').style.display = 'none';
  document.getElementById('location-search').value = name;
  
  const data = await fetchRealWeatherData(lat, lon, name);
  temperatureData = data;
  
  document.getElementById('location-name').textContent = name;
  document.getElementById('sensor-id').textContent = data[0].sensorId;
  
  createChart(data);
  updateDataCards(data);
  
  if (data[0].sensorId === 'LIVE_WEATHER') {
    startRegularUpdates(lat, lon, name);
  }
}

async function askForLocation() {
  try {
    const position = await getUserLocation();
    const locationName = await getLocationName(position.lat, position.lon);
    await selectLocation(position.lat, position.lon, locationName);
    document.getElementById('location-search').value = locationName;
  } catch (error) {
    showNotification(
      '📍 Location Access Denied',
      'Please search for your location manually or allow location access.',
      'warning'
    );
  }
}

async function initializeDashboard() {
  loadSettings();
  
  try {
    let data;
    let locationName = 'Unknown Location';
    let position;
    
    if (userSettings.useManualLocation && userSettings.manualLat && userSettings.manualLon) {
      position = {
        lat: userSettings.manualLat,
        lon: userSettings.manualLon
      };
      locationName = userSettings.manualLocationName || 'Manual Location';
      console.log('Using manual location:', position);
      
      data = await fetchRealWeatherData(position.lat, position.lon, locationName);
      console.log('Using real weather data from manual location');
      
    } else {
      try {
        position = await getUserLocation();
        console.log('Location obtained:', position);
        
        locationName = await getLocationName(position.lat, position.lon);
        console.log('Location name:', locationName);
        
        data = await fetchRealWeatherData(position.lat, position.lon, locationName);
        console.log('Using real weather data from OpenWeatherMap API');
        
      } catch (locationError) {
        console.log('Location access denied, using demo data...');
        data = generateDemoData();
        locationName = 'Demo Location - Search for your location above';
      }
    }
    
    document.getElementById('location-name').textContent = locationName;
    document.getElementById('sensor-id').textContent = data[0].sensorId;
    
    temperatureData = data;
    
    createChart(data);
    updateDataCards(data);
    
    if (data[0].sensorId === 'LIVE_WEATHER' && position) {
      startRegularUpdates(position.lat, position.lon, locationName);
    }
    
  } catch (error) {
    console.error('Initialization error:', error);
    
    const data = generateDemoData();
    temperatureData = data;
    
    document.getElementById('location-name').textContent = 'Demo Location';
    document.getElementById('sensor-id').textContent = 'DEMO_001';
    
    createChart(data);
    updateDataCards(data);
  }
}

function startRegularUpdates(lat, lon, locationName) {
  if (window.updateInterval) {
    clearInterval(window.updateInterval);
  }
  
  window.updateInterval = setInterval(async () => {
    try {
      const currentData = await fetchRealWeatherData(lat, lon, locationName);
      const newData = currentData[currentData.length - 1];
      
      temperatureData.push(newData);
      if (temperatureData.length > 8) {
        temperatureData.shift();
      }
      
      createChart(temperatureData);
      updateDataCards(temperatureData);
      
    } catch (error) {
      console.error('Error updating data:', error);
      
      const sensorData = await loadSensorData();
      if (sensorData) {
        temperatureData = sensorData;
        createChart(temperatureData);
        updateDataCards(temperatureData);
        console.log('Updated with sensor data from JSON file');
      }
    }
    
    console.log('Updated at:', new Date().toLocaleString());
  }, 60000);
}

function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function toggleManualLocation() {
  const manualInputs = document.getElementById('manual-location-inputs');
  const isChecked = document.getElementById('manual-location').checked;
  manualInputs.style.display = isChecked ? 'block' : 'none';
}

function addPlant() {
  const plantSelect = document.getElementById('plant-select');
  const selectedPlant = plantSelect.value;
  
  if (selectedPlant && !userSettings.plants.includes(selectedPlant)) {
    userSettings.plants.push(selectedPlant);
    updatePlantsList();
  }
}

function removePlant(plant) {
  userSettings.plants = userSettings.plants.filter(p => p !== plant);
  updatePlantsList();
}

function updatePlantsList() {
  const container = document.getElementById('plants-list');
  container.innerHTML = userSettings.plants.map(plant => 
    `<span class="plant-tag">${plant} <button onclick="removePlant('${plant}')">×</button></span>`
  ).join('');
}

function saveUserSettings() {
  userSettings.tempAlerts = document.getElementById('temp-alerts').checked;
  userSettings.comfortAlerts = document.getElementById('comfort-alerts').checked;
  userSettings.weatherAlerts = document.getElementById('weather-alerts').checked;
  userSettings.preferredTemp = parseInt(document.getElementById('preferred-temp').value) || 22;
  userSettings.useManualLocation = document.getElementById('manual-location').checked;
  userSettings.manualLocationName = document.getElementById('location-name-input').value;
  userSettings.manualLat = parseFloat(document.getElementById('latitude-input').value) || null;
  userSettings.manualLon = parseFloat(document.getElementById('longitude-input').value) || null;
  userSettings.houseSize = parseInt(document.getElementById('house-size').value) || 100;
  
  saveSettings();
  
  document.getElementById('settings-panel').style.display = 'none';
  
  showNotification(
    '✅ Settings Saved',
    'Your preferences have been saved successfully!',
    'info'
  );
  
  setTimeout(() => {
    initializeDashboard();
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeDashboard();
  setTimeout(applySettings, 100);
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#location-search-container')) {
      document.getElementById('search-results').style.display = 'none';
    }
  });
  
  // Add escape key handler to hide search results
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.getElementById('search-results').style.display = 'none';
    }
  });
});
