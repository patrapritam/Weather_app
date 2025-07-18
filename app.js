
// Temperature Dashboard with Real API Integration
let temperatureChart;
let temperatureData = [];
let lastNotificationTime = {};

// API Configuration
const API_KEY = 'ec85cc05f2bb1af55811c674d2ae3095';

// Function to load data from sensors.json as fallback
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

// Function to generate demo data (last fallback)
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

// Function to search for location coordinates
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

// Function to fetch real weather data
async function fetchRealWeatherData(lat, lon, locationName = null) {
  try {
    // Try OneCall API 3.0 first (paid subscription)
    try {
      const onecallResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${API_KEY}&units=metric`
      );
      
      if (onecallResponse.ok) {
        const onecallData = await onecallResponse.json();
        console.log('OneCall API Response:', onecallData);
        
        const currentTemp = Math.round(onecallData.current.temp * 10) / 10;
        console.log('Current temperature:', currentTemp);
        console.log('Using OneCall API 3.0 data - Temperature:', `${currentTemp}°C`);
        
        // Generate historical data based on current temperature
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
    
    // Fallback to Current Weather API (free)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const weatherData = await response.json();
    console.log('API Response:', weatherData);
    
    const currentTemp = Math.round(weatherData.main.temp * 10) / 10;
    console.log('Current temperature:', currentTemp);
    console.log('Using Current Weather API data - Temperature:', `${currentTemp}°C`);
    
    // Generate historical data based on current temperature
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
    
    // Try sensors.json as fallback
    const sensorData = await loadSensorData();
    if (sensorData) {
      console.log('Using sensor data from JSON file as fallback');
      return sensorData;
    }
    
    // Final fallback: generate random demo data
    console.log('API failed and no sensor data available, using demo data');
    return generateDemoData();
  }
}

// Function to get user location
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

// Function to get location name from coordinates
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

// Notification System
function showNotification(title, message, type = 'info') {
  // Check if notifications are enabled and not shown recently
  const now = Date.now();
  const key = `${title}_${type}`;
  
  if (lastNotificationTime[key] && (now - lastNotificationTime[key]) < 300000) {
    return; // Don't show same notification within 5 minutes
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
  
  // Auto remove after 8 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 8000);
}

// Function to check and send notifications
function checkAndNotify(data) {
  const latestData = data[data.length - 1];
  const temp = latestData.temperature;
  const preferredTemp = userSettings.preferredTemp;
  const tempDiff = temp - preferredTemp;
  
  // Temperature alerts - more sensitive notifications
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
    } else if (Math.abs(tempDiff) <= 2) {
      showNotification(
        '✅ Perfect Temperature!',
        `Current temperature (${temp}°C) is very close to your preference (${preferredTemp}°C). Enjoy the comfort!`,
        'info'
      );
    }
  }
  
  // Comfort recommendations
  if (userSettings.comfortAlerts) {
    if (tempDiff > 5) {
      showNotification(
        '👕 Clothing Suggestion',
        'It\'s warmer than you prefer. Wear light, breathable clothing and stay in shade.',
        'info'
      );
    } else if (tempDiff < -5) {
      showNotification(
        '🧥 Clothing Suggestion',
        'It\'s cooler than you prefer. Consider wearing a jacket or warm layers.',
        'info'
      );
    }
  }
  
  // Weather warnings
  if (userSettings.weatherAlerts) {
    if (latestData.humidity > 80) {
      showNotification(
        '💧 High Humidity Warning',
        'Very high humidity detected. Ensure good ventilation and stay hydrated.',
        'warning'
      );
    }
    
    if (latestData.windSpeed > 8) {
      showNotification(
        '💨 Windy Conditions',
        'Strong winds detected. Be cautious if going outside.',
        'warning'
      );
    }
  }
}

// Function to create or update the chart
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

// Function to get clothing suggestions
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

// Function to update data cards
function updateDataCards(data) {
  const latestData = data[data.length - 1];
  const clothingSuggestion = getClothingSuggestion(latestData.temperature, userSettings.preferredTemp);
  
  // Temperature recommendation logic based on user preference
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
  
  // Humidity recommendation
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
    
    <div class="data-card pressure-card">
      <div class="data-icon">📊</div>
      <div class="data-content">
        <h3>Pressure</h3>
        <div class="data-value">${latestData.pressure} hPa</div>
        <div class="data-recommendation">Atmospheric pressure reading</div>
      </div>
    </div>
    
    <div class="data-card wind-card">
      <div class="data-icon">💨</div>
      <div class="data-content">
        <h3>Wind Speed</h3>
        <div class="data-value">${latestData.windSpeed.toFixed(1)} m/s</div>
        <div class="data-recommendation">Current wind conditions</div>
      </div>
    </div>
  `;
  
  // Check for notifications
  checkAndNotify(data);
}

// Settings management
let userSettings = {
  preferredTemp: 22,
  tempAlerts: true,
  comfortAlerts: true,
  weatherAlerts: true,
  useManualLocation: false,
  manualLocationName: '',
  manualLat: null,
  manualLon: null
};

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('temperatureSettings');
  if (saved) {
    userSettings = { ...userSettings, ...JSON.parse(saved) };
  }
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem('temperatureSettings', JSON.stringify(userSettings));
}

// Apply settings to UI
function applySettings() {
  document.getElementById('temp-alerts').checked = userSettings.tempAlerts;
  document.getElementById('comfort-alerts').checked = userSettings.comfortAlerts;
  document.getElementById('weather-alerts').checked = userSettings.weatherAlerts;
  document.getElementById('preferred-temp').value = userSettings.preferredTemp;
  document.getElementById('manual-location').checked = userSettings.useManualLocation;
  document.getElementById('location-name-input').value = userSettings.manualLocationName;
  document.getElementById('latitude-input').value = userSettings.manualLat || '';
  document.getElementById('longitude-input').value = userSettings.manualLon || '';
  
  // Toggle manual location inputs
  const manualInputs = document.getElementById('manual-location-inputs');
  manualInputs.style.display = userSettings.useManualLocation ? 'block' : 'none';
}

// Location search functionality
async function handleLocationSearch() {
  const searchTerm = document.getElementById('location-search').value.trim();
  if (!searchTerm) return;
  
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
}

// Select location from search results
async function selectLocation(lat, lon, name) {
  document.getElementById('search-results').style.display = 'none';
  document.getElementById('location-search').value = name;
  
  // Update data with selected location
  const data = await fetchRealWeatherData(lat, lon, name);
  temperatureData = data;
  
  document.getElementById('location-name').textContent = name;
  document.getElementById('sensor-id').textContent = data[0].sensorId;
  
  createChart(data);
  updateDataCards(data);
  
  // Start regular updates for the new location
  if (data[0].sensorId === 'LIVE_WEATHER') {
    startRegularUpdates(lat, lon, name);
  }
}

// Function to ask for location permission
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

// Main initialization function
async function initializeDashboard() {
  loadSettings();
  
  try {
    let data;
    let locationName = 'Unknown Location';
    let position;
    
    if (userSettings.useManualLocation && userSettings.manualLat && userSettings.manualLon) {
      // Use manual location
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
    
    // Update location info
    document.getElementById('location-name').textContent = locationName;
    document.getElementById('sensor-id').textContent = data[0].sensorId;
    
    // Store data globally
    temperatureData = data;
    
    // Create chart and update cards
    createChart(data);
    updateDataCards(data);
    
    // Start regular updates if using real API data
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

// Function to start regular updates
function startRegularUpdates(lat, lon, locationName) {
  // Clear any existing intervals
  if (window.updateInterval) {
    clearInterval(window.updateInterval);
  }
  
  window.updateInterval = setInterval(async () => {
    try {
      const currentData = await fetchRealWeatherData(lat, lon, locationName);
      const newData = currentData[currentData.length - 1];
      
      // Add new data point and remove oldest if we have more than 8 points
      temperatureData.push(newData);
      if (temperatureData.length > 8) {
        temperatureData.shift();
      }
      
      // Update chart and cards
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
  }, 60000); // Update every 1 minute
}

// Settings event handlers
function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function toggleManualLocation() {
  const manualInputs = document.getElementById('manual-location-inputs');
  const isChecked = document.getElementById('manual-location').checked;
  manualInputs.style.display = isChecked ? 'block' : 'none';
}

function saveUserSettings() {
  // Get values from form
  userSettings.tempAlerts = document.getElementById('temp-alerts').checked;
  userSettings.comfortAlerts = document.getElementById('comfort-alerts').checked;
  userSettings.weatherAlerts = document.getElementById('weather-alerts').checked;
  userSettings.preferredTemp = parseInt(document.getElementById('preferred-temp').value) || 22;
  userSettings.useManualLocation = document.getElementById('manual-location').checked;
  userSettings.manualLocationName = document.getElementById('location-name-input').value;
  userSettings.manualLat = parseFloat(document.getElementById('latitude-input').value) || null;
  userSettings.manualLon = parseFloat(document.getElementById('longitude-input').value) || null;
  
  // Save to localStorage
  saveSettings();
  
  // Close settings panel
  document.getElementById('settings-panel').style.display = 'none';
  
  // Show success notification
  showNotification(
    '✅ Settings Saved',
    'Your preferences have been saved successfully!',
    'info'
  );
  
  // Reinitialize dashboard with new settings
  setTimeout(() => {
    initializeDashboard();
  }, 1000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  initializeDashboard();
  setTimeout(applySettings, 100);
  
  // Hide search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#location-search-container')) {
      document.getElementById('search-results').style.display = 'none';
    }
  });
});