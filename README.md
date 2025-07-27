# 🌡️ Smart Life Weather Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5 Badge"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3 Badge"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript Badge"/>
  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js Badge"/>
  <img src="https://img.shields.io/badge/OpenWeatherMap-1E90FF?style=for-the-badge&logo=openweathermap&logoColor=white" alt="OpenWeatherMap Badge"/>
</p>

<p align="center">
  <strong>Your intelligent weather companion for smarter daily decisions</strong>
</p>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Smart Life Insights](#-smart-life-insights)
- [📸 Screenshots](#-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [📱 Usage Guide](#-usage-guide)
- [🔧 API Setup](#-api-setup)
- [🎨 Customization](#-customization)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🌤️ **Real-Time Weather Data**
- **Live Weather Updates**: Current temperature, humidity, wind speed, and atmospheric pressure
- **Location-Based Search**: Search any city worldwide for instant weather data
- **GPS Integration**: Use your current location for automatic weather updates
- **Temperature Trends**: Real-time temperature visualization with Chart.js

### 🧠 **Smart Life Insights**
- **Energy Cost Predictions**: Calculate heating/cooling costs based on temperature differences
- **Sleep Quality Analysis**: Predict sleep quality based on temperature, humidity, and pressure
- **Exercise Recommendations**: Personalized workout advice based on weather conditions
- **Plant Care Tips**: Customized care instructions for your garden plants
- **Pet Comfort Alerts**: Ensure your pets' comfort in current weather conditions
- **Laundry Advice**: Optimal drying conditions and timing recommendations
- **Food Storage Tips**: Weather-based food preservation recommendations
- **Air Quality Predictions**: Health-focused air quality assessments

### ⚙️ **Advanced Settings**
- **Personalized Preferences**: Set your preferred temperature and house size
- **Plant Management**: Add and track multiple plants with custom care schedules
- **Smart Notifications**: Configurable alerts for temperature changes and health warnings
- **Manual Location Override**: Set custom coordinates for specific locations

### 📱 **User Experience**
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Persistent Settings**: Local storage for user preferences and recent locations
- **Intuitive Interface**: Clean, modern UI with smooth animations
- **Accessibility**: Keyboard navigation and screen reader support

---

## 🎯 Smart Life Insights

### 💰 **Energy Management**
- Real-time cost calculations for heating and cooling
- Energy efficiency recommendations
- Personalized temperature optimization tips

### 😴 **Sleep Optimization**
- Sleep quality scoring based on environmental factors
- Temperature and humidity impact analysis
- Personalized sleep environment recommendations

### 🌱 **Plant Care System**
- Database of common plants with care requirements
- Weather-based watering and care schedules
- Plant-specific temperature and humidity monitoring

### 🏃 **Health & Wellness**
- Exercise recommendations based on weather conditions
- Heat index calculations for outdoor activities
- Health and safety warnings for extreme conditions

---

## 📸 Screenshots

![Smart Life Weather Dashboard](image.png)

*Interactive weather dashboard with real-time data visualization and smart life recommendations*

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup and structure |
| **CSS3** | Responsive design and animations |
| **JavaScript (ES6+)** | Dynamic functionality and API integration |
| **Chart.js** | Real-time data visualization |
| **OpenWeatherMap API** | Weather data provider |
| **LocalStorage** | User preferences and settings persistence |

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API access
- Optional: OpenWeatherMap API key for enhanced features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-life-weather-dashboard.git
   cd smart-life-weather-dashboard
   ```

2. **Open the application**
   ```bash
   # Using Python (if available)
   python -m http.server 8000
   
   # Using Node.js (if available)
   npx serve .
   
   # Or simply open index.html in your browser
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`
   - Or double-click `index.html` to open directly

---

## ⚙️ Configuration

### API Key Setup (Optional)
For enhanced features and higher API limits:

1. **Get OpenWeatherMap API Key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate your API key

2. **Update API Key**
   - Open `script.js`
   - Replace the API_KEY constant with your key:
   ```javascript
   const API_KEY = 'your_api_key_here';
   ```

### Default Settings
The application includes sensible defaults:
- **Preferred Temperature**: 22°C
- **House Size**: 100m²
- **Location**: Auto-detected via GPS
- **Notifications**: Enabled for all categories

---

## 📱 Usage Guide

### 🔍 **Searching for Locations**
1. Type a city name in the search bar
2. Select from the dropdown suggestions
3. Click "Search" or press Enter
4. Weather data will update automatically

### 📍 **Using GPS Location**
1. Click "📍 Use My Location"
2. Allow location access when prompted
3. Weather data will be fetched for your current location

### ⚙️ **Accessing Settings**
1. Click the "⚙️ Settings" button
2. Configure your preferences:
   - **Preferred Temperature**: Set your comfort zone
   - **House Size**: For accurate energy calculations
   - **Plants**: Add plants for personalized care tips
   - **Notifications**: Customize alert preferences

### 📊 **Understanding the Dashboard**
- **Temperature Chart**: Real-time temperature trends
- **Smart Life Cards**: Personalized recommendations
- **Energy Costs**: Heating/cooling cost estimates
- **Health Tips**: Weather-based health advice

---

## 🔧 API Setup

### OpenWeatherMap API Integration
The application uses OpenWeatherMap API for weather data:

```javascript
// API endpoints used
const WEATHER_API = `https://api.openweathermap.org/data/2.5/weather`;
const GEOCODING_API = `http://api.openweathermap.org/geo/1.0/direct`;
```

### Rate Limits
- **Free Tier**: 60 calls/minute, 1,000,000 calls/month
- **Paid Plans**: Higher limits available

### Error Handling
The application gracefully handles:
- Network connectivity issues
- Invalid API responses
- Location permission denials
- Rate limit exceeded errors

---

## 🎨 Customization

### Styling
Modify `style.css` to customize:
- Color schemes and gradients
- Typography and spacing
- Responsive breakpoints
- Animation effects

### Functionality
Extend `script.js` to add:
- New weather-based recommendations
- Additional plant types
- Custom notification types
- Enhanced data visualization

### Adding New Features
1. **New Recommendation Type**
   ```javascript
   function getCustomAdvice(temp, humidity) {
     // Your custom logic here
     return {
       title: "Custom Advice",
       value: "Your recommendation",
       icon: "🎯"
     };
   }
   ```

2. **New Plant Type**
   ```javascript
   const plantDatabase = {
     'your-plant': { 
       minTemp: 15, 
       maxTemp: 25, 
       waterFreq: 2, 
       sunlight: 'full' 
     }
   };
   ```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 **Reporting Bugs**
1. Check existing issues first
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Browser and OS information
   - Screenshots if applicable

### 💡 **Suggesting Features**
1. Open a feature request issue
2. Describe the feature and its benefits
3. Include mockups or examples if possible

### 🔧 **Code Contributions**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### 📝 **Code Style**
- Follow existing code formatting
- Add comments for complex logic
- Test on multiple browsers
- Ensure mobile responsiveness

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing weather data API
- **Chart.js** for data visualization capabilities
- **Weather Icons** for beautiful weather representations
- **Contributors** who help improve this project

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/smart-life-weather-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/smart-life-weather-dashboard/discussions)
- **Email**: pritampatra.fb@gmail.com

---

<p align="center">
  <strong>Made with ❤️ for smarter daily decisions</strong>
</p>

<p align="center">
  <a href="#-smart-life-weather-dashboard">⬆️ Back to Top</a>
</p>



