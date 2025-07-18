let locationChart;
let temperatureData = [];
let userLocation = null;
let temperatureThresholds = {
  high: 35,
  low: 15,
  enabled: true
};

// Function to show notification
function showNotification(title, message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
  
  // Show browser notification if supported
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K'
    });
  }
}

// Function to check temperature thresholds
function checkTemperatureThresholds(temperature) {
  if (!temperatureThresholds.enabled) return;
  
  if (temperature >= temperatureThresholds.high) {
    showNotification(
      '🔥 High Temperature Alert',
      `Temperature is ${temperature}°C (above ${temperatureThresholds.high}°C threshold)`,
      'warning'
    );
  } else if (temperature <= temperatureThresholds.low) {
    showNotification(
      '❄️ Low Temperature Alert',
      `Temperature is ${temperature}°C (below ${temperatureThresholds.low}°C threshold)`,
      'warning'
    );
  }
}

// Function to get clothing recommendation
function getClothingRecommendation(temperature) {
  if (temperature >= 30) {
    return "👕 Light clothing recommended - cotton t-shirt, shorts, sandals";
  } else if (temperature >= 25) {
    return "👔 Comfortable clothing - light shirt, pants, comfortable shoes";
  } else if (temperature >= 20) {
    return "🧥 Light jacket recommended - long sleeves, light jacket";
  } else if (temperature >= 15) {
    return "🧥 Warm clothing - sweater, jacket, closed shoes";
  } else if (temperature >= 10) {
    return "🧥 Heavy clothing - warm jacket, scarf, gloves";
  } else {
    return "🥶 Very warm clothing - heavy coat, hat, gloves, warm boots";
  }
}

// Function to get activity recommendation
function getActivityRecommendation(temperature) {
  if (temperature >= 35) {
    return "🏠 Stay indoors or in shade. Avoid outdoor activities.";
  } else if (temperature >= 25) {
    return "🏃 Perfect for outdoor activities - jogging, cycling, sports";
  } else if (temperature >= 15) {
    return "🚶 Good for walking, light outdoor activities";
  } else if (temperature >= 5) {
    return "🧥 Dress warmly for outdoor activities";
  } else {
    return "🏠 Too cold for most outdoor activities";
  }
}

// Function to request notification permission
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

// Function to create temperature chart
function createTemperatureChart(data) {
  const ctx = document.getElementById('temperatureChart').getContext('2d');

  const labels = data.map(item => {
    const date = new Date(item.timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });

  const temperatures = data.map(item => item.temperature);

  if (locationChart) {
    locationChart.destroy();
  }

  locationChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature (°C)',
        data: temperatures,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Temperature (°C)'
          },
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time'
          },
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        }
      }
    }
  });
}

// Function to display location info
function displayLocationInfo(locationName) {
  const locationNameEl = document.getElementById('location-name');
  const sensorId = document.getElementById('sensor-id');
  
  locationNameEl.textContent = locationName;
  sensorId.textContent = `Temperature Sensor - ${locationName}`;
}

// Function to display temperature data cards
function displayDataCards(data) {
  const dataContainer = document.getElementById('data-container');
  dataContainer.innerHTML = '';

  const sortedData = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  sortedData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'reading-card';

    if (index === 0) {
      card.style.cssText = `
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        animation: pulse 1s ease-in-out;
      `;
    }

    const temperature = document.createElement('div');
    temperature.className = 'temperature';
    temperature.innerHTML = `<strong>Temperature:</strong> ${item.temperature}°C`;

    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    const date = new Date(item.timestamp);
    timestamp.textContent = date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    if (index === 0) {
      const liveBadge = document.createElement('span');
      liveBadge.style.cssText = `
        background: #FF5722;
        color: white;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.7em;
        margin-left: 10px;
        animation: blink 1s infinite;
      `;
      liveBadge.textContent = 'LIVE';
      temperature.appendChild(liveBadge);

      // Add recommendations for latest reading
      const recommendations = document.createElement('div');
      recommendations.className = 'recommendations';
      recommendations.innerHTML = `
        <div class="recommendation-item">
          <strong>👕 Clothing:</strong> ${getClothingRecommendation(item.temperature)}
        </div>
        <div class="recommendation-item">
          <strong>🏃 Activity:</strong> ${getActivityRecommendation(item.temperature)}
        </div>
      `;
      card.appendChild(recommendations);
    }

    card.appendChild(temperature);
    card.appendChild(timestamp);
    dataContainer.appendChild(card);
  });
}

// Function to create settings panel
function createSettingsPanel() {
  const settingsPanel = document.createElement('div');
  settingsPanel.id = 'settings-panel';
  settingsPanel.style.display = 'none';
  settingsPanel.innerHTML = `
    <div class="settings-content">
      <h3>⚙️ Temperature Alert Settings</h3>
      <div class="settings-group">
        <label>
          <input type="checkbox" id="alerts-enabled" ${temperatureThresholds.enabled ? 'checked' : ''}>
          Enable Temperature Alerts
        </label>
      </div>
      <div class="settings-group">
        <label>🔥 High Temperature Alert (°C):</label>
        <input type="number" id="high-threshold" value="${temperatureThresholds.high}" min="0" max="50">
      </div>
      <div class="settings-group">
        <label>❄️ Low Temperature Alert (°C):</label>
        <input type="number" id="low-threshold" value="${temperatureThresholds.low}" min="-20" max="30">
      </div>
      <div class="settings-buttons">
        <button onclick="saveSettings()">Save Settings</button>
        <button onclick="closeSettings()">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(settingsPanel);
}

// Function to save settings
function saveSettings() {
  temperatureThresholds.enabled = document.getElementById('alerts-enabled').checked;
  temperatureThresholds.high = parseFloat(document.getElementById('high-threshold').value);
  temperatureThresholds.low = parseFloat(document.getElementById('low-threshold').value);
  
  // Save to localStorage
  localStorage.setItem('temperatureThresholds', JSON.stringify(temperatureThresholds));
  
  showNotification('✅ Settings Saved', 'Temperature alert settings have been updated');
  closeSettings();
}

// Function to close settings
function closeSettings() {
  document.getElementById('settings-panel').style.display = 'none';
}

// Function to load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('temperatureThresholds');
  if (saved) {
    temperatureThresholds = { ...temperatureThresholds, ...JSON.parse(saved) };
  }
}

// Function to get location name from coordinates
async function getLocationName(lat, lon) {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await response.json();
    
    if (data.city && data.countryName) {
      return `${data.city}, ${data.countryName}`;
    } else if (data.locality && data.countryName) {
      return `${data.locality}, ${data.countryName}`;
    } else if (data.countryName) {
      return data.countryName;
    } else {
      return `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    }
  } catch (error) {
    console.error('Error getting location name:', error);
    return `Location (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
  }
}

// Function to fetch real weather data from OpenWeatherMap API
async function fetchRealWeatherData(lat, lon) {
  const API_KEY = 'ec85cc05f2bb1af55811c674d2ae3095';
  
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    
    if (response.ok) {
      const data = await response.json();
      const now = new Date();
      
      const weatherData = [];
      const currentTemp = Math.round(data.main.temp * 10) / 10;
      
      console.log('API Response:', data);
      console.log('Current temperature:', currentTemp);
      
      // Generate 8 data points going back in time with slight variations around real temperature
      for (let i = 7; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 1 * 60 * 1000);
        const variation = (Math.random() - 0.5) * 2;
        const temperature = Math.round((currentTemp + variation) * 10) / 10;
        
        weatherData.push({
          temperature: temperature,
          timestamp: timestamp.toISOString()
        });
      }
      
      // Check threshold for current temperature
      checkTemperatureThresholds(currentTemp);
      
      console.log('Using Current Weather API data - Temperature:', currentTemp + '°C');
      return weatherData;
    } else {
      const errorData = await response.json();
      console.error('API Error:', response.status, errorData);
      throw new Error(`API failed with status ${response.status}: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return generateDemoData();
  }
}

// Function to generate demo data when API is not available
function generateDemoData() {
  const now = new Date();
  const data = [];
  
  const baseTemp = 22;
  
  for (let i = 7; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 1 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 4;
    const temperature = Math.round((baseTemp + variation) * 10) / 10;
    
    data.push({
      temperature: temperature,
      timestamp: timestamp.toISOString()
    });
  }
  
  return data;
}

// Function to handle successful location retrieval
async function handleLocationSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  
  userLocation = { lat, lon };
  
  const locationName = await getLocationName(lat, lon);
  
  temperatureData = await fetchRealWeatherData(lat, lon);
  
  displayLocationInfo(locationName);
  createTemperatureChart(temperatureData);
  displayDataCards(temperatureData);
  
  startTemperatureUpdates(lat, lon, locationName);
  
  console.log('Location obtained:', locationName);
  console.log('Using real weather data from OpenWeatherMap API');
}

// Function to start temperature updates
function startTemperatureUpdates(lat, lon, locationName) {
  setInterval(async () => {
    if (temperatureData.length === 0) return;
    
    const now = new Date();
    
    try {
      const API_KEY = 'ec85cc05f2bb1af55811c674d2ae3095';
      
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      
      let newTemp;
      if (response.ok) {
        const data = await response.json();
        newTemp = Math.round(data.main.temp * 10) / 10;
        
        // Check threshold for new temperature
        checkTemperatureThresholds(newTemp);
        
        console.log('Updated with Current Weather API data - Temperature:', newTemp + '°C');
      } else {
        const errorData = await response.json();
        console.error('API Update Error:', response.status, errorData);
        const lastTemp = temperatureData[temperatureData.length - 1].temperature;
        const variation = (Math.random() - 0.5) * 1;
        newTemp = Math.round((lastTemp + variation) * 10) / 10;
        console.log('Using fallback temperature data');
      }
      
      const newReading = {
        temperature: newTemp,
        timestamp: now.toISOString()
      };
      
      temperatureData.push(newReading);
      
      if (temperatureData.length > 8) {
        temperatureData.shift();
      }
      
      createTemperatureChart(temperatureData);
      displayDataCards(temperatureData);
      
    } catch (error) {
      console.error('Error updating weather data:', error);
    }
    
    console.log('Updated at:', now.toLocaleString());
  }, 60000);
}

// Function to handle location errors
function handleLocationError(error) {
  const errorMessages = {
    1: 'Location access denied by user',
    2: 'Location information unavailable',
    3: 'Location request timeout'
  };

  const errorMessage = errorMessages[error.code] || 'Unknown location error';
  
  document.getElementById('location-name').textContent = 'Location Required';
  document.getElementById('sensor-id').textContent = errorMessage;
  
  const dataContainer = document.getElementById('data-container');
  dataContainer.innerHTML = `
    <div class="error-card">
      <h3>Location Access Required</h3>
      <p>${errorMessage}</p>
      <p>Please enable location access to get temperature data for your area.</p>
      <button onclick="requestLocation()" style="
        background: #667eea;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
      ">Allow Location Access</button>
    </div>
  `;

  console.error('Location error:', error);
}

// Function to request location
function requestLocation() {
  if (!navigator.geolocation) {
    handleLocationError({ code: 2, message: 'Geolocation not supported' });
    return;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  };

  navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError, options);
}

// Function to check if API key is configured
function checkApiConfiguration() {
  const API_KEY = 'ec85cc05f2bb1af55811c674d2ae3095';
  if (API_KEY === 'your_openweathermap_api_key_here') {
    document.getElementById('api-notice').style.display = 'block';
    return false;
  }
  return true;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  checkApiConfiguration();
  loadSettings();
  requestNotificationPermission();
  createSettingsPanel();
  requestLocation();
});