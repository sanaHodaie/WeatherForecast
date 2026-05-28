// ساخت ذرات معلق
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for(let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 5 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 8 + 5 + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particlesContainer.appendChild(particle);
    }
}

// جستجو با کلید Enter
function handleEnter(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
}

// اخطارها
function showAlert() {
    document.getElementById('customAlert').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

function showAlertMessage(message) {
    const alertMessageDiv = document.querySelector('.alert-message');
    if (alertMessageDiv) {
        alertMessageDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    }
    showAlert();
}

// ========== نرمالایز کردن نام شهر ==========
function normalizeCityName(city) {
    let normalized = city.toLowerCase().trim();
    
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    for (let i = 0; i < persianNumbers.length; i++) {
        normalized = normalized.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
    }
    
    const cityMapping = {
        'tehran': 'tehran', 'تهران': 'tehran',
        'mashhad': 'mashhad', 'مشهد': 'mashhad',
        'isfahan': 'isfahan', 'اصفهان': 'isfahan',
        'shiraz': 'shiraz', 'شیراز': 'shiraz',
        'tabriz': 'tabriz', 'تبریز': 'tabriz',
        'rasht': 'rasht', 'رشت': 'rasht',
        'london': 'london', 'لندن': 'london',
        'paris': 'paris', 'پاریس': 'paris',
        'new york': 'new york', 'نیویورک': 'new york',
        'tokyo': 'tokyo', 'توکیو': 'tokyo'
    };
    
    const finalKey = normalized.replace(/\s+/g, '');
    
    if (cityMapping[finalKey]) {
        return cityMapping[finalKey];
    }
    
    return finalKey;
}

function getDisplayCityName(city) {
    const displayMapping = {
        'tehran': 'تهران',
        'mashhad': 'مشهد',
        'isfahan': 'اصفهان',
        'shiraz': 'شیراز',
        'tabriz': 'تبریز',
        'rasht': 'رشت',
        'london': 'لندن',
        'paris': 'پاریس',
        'new york': 'نیویورک',
        'tokyo': 'توکیو'
    };
    
    const normalized = normalizeCityName(city);
    return displayMapping[normalized] || city;
}

// نمایش وضعیت هوا با انیمیشن
function displayWeatherWithAnimation(city, weatherData) {
    document.getElementById('cityName').innerHTML = `${city}`;
    document.getElementById('temp').innerHTML = `${weatherData.temp}°C`;
    document.getElementById('feels').innerHTML = `${weatherData.feels}°C`;
    document.getElementById('humidity').innerHTML = `${weatherData.humidity}%`;
    document.getElementById('wind').innerHTML = `${weatherData.wind} m/s`;
    
    document.getElementById('temp').classList.remove('temp-sunny');
    
    let condition = weatherData.condition;
    let conditionClass = '';
    
    if (condition.includes('☀️') || condition.includes('آفتابی')) {
        conditionClass = 'sunny-glow';
        document.getElementById('temp').classList.add('temp-sunny');
    } else if (condition.includes('⛅') || condition.includes('نیمه ابری')) {
        conditionClass = 'cloudy-glow';
    } else if (condition.includes('☁️') || condition.includes('ابری')) {
        conditionClass = 'cloudy-glow';
    } else if (condition.includes('🌧️') || condition.includes('بارانی')) {
        conditionClass = 'rainy-glow';
    } else if (condition.includes('🌨️') || condition.includes('برفی')) {
        conditionClass = 'snowy-glow';
    } else {
        conditionClass = 'sunny-glow';
    }
    
    let displayCondition = condition;
    if (currentLang === 'en') {
        const conditionMap = {
            '☀️ آفتابی درخشان ☀️': '☀️ Sunny ☀️',
            '☀️ آفتابی - هوای مطبوع': '☀️ Pleasant Weather',
            '☀️ آفتابی گرم 🌞': '☀️ Hot Sunny 🌞',
            '☀️ آفتابی': '☀️ Sunny',
            '⛅ نیمه ابری - وزش باد': '⛅ Partly Cloudy - Windy',
            '⛅ نیمه ابری': '⛅ Partly Cloudy',
            '☁️ ابری - خنک': '☁️ Cloudy - Cool',
            '☁️ ابری - احتمال باران': '☁️ Cloudy - Chance of Rain',
            '☁️ ابری': '☁️ Cloudy',
            '🌧️ بارانی - مرطوب 🌧️': '🌧️ Rainy - Humid 🌧️',
            '🌧️ بارانی': '🌧️ Rainy',
            '🌨️ برفی': '❄️ Snowy'
        };
        displayCondition = conditionMap[condition] || condition;
    }
    
    document.getElementById('desc').innerHTML = `📋 <span class="${conditionClass}">${displayCondition}</span>`;
    document.getElementById('result').style.display = 'block';
    updateSaveButtonVisibility();
    updateChartButtonVisibility();
}

// دیتابیس شهرها
const weatherDatabase = {
    'tehran': { temp: 24, feels: 22, humidity: 35, wind: 3.2, condition: '☀️ آفتابی درخشان ☀️' },
    'tehran iran': { temp: 24, feels: 22, humidity: 35, wind: 3.2, condition: '☀️ آفتابی درخشان ☀️' },
    'mashhad': { temp: 18, feels: 16, humidity: 45, wind: 5.1, condition: '⛅ نیمه ابری - وزش باد' },
    'mashhad iran': { temp: 18, feels: 16, humidity: 45, wind: 5.1, condition: '⛅ نیمه ابری - وزش باد' },
    'isfahan': { temp: 22, feels: 20, humidity: 30, wind: 2.8, condition: '☀️ آفتابی - هوای مطبوع' },
    'isfahan iran': { temp: 22, feels: 20, humidity: 30, wind: 2.8, condition: '☀️ آفتابی - هوای مطبوع' },
    'shiraz': { temp: 26, feels: 24, humidity: 28, wind: 2.5, condition: '☀️ آفتابی گرم 🌞' },
    'shiraz iran': { temp: 26, feels: 24, humidity: 28, wind: 2.5, condition: '☀️ آفتابی گرم 🌞' },
    'tabriz': { temp: 16, feels: 14, humidity: 50, wind: 4.2, condition: '☁️ ابری - خنک' },
    'tabriz iran': { temp: 16, feels: 14, humidity: 50, wind: 4.2, condition: '☁️ ابری - خنک' },
    'rasht': { temp: 19, feels: 19, humidity: 75, wind: 3.0, condition: '🌧️ بارانی - مرطوب 🌧️' },
    'rasht iran': { temp: 19, feels: 19, humidity: 75, wind: 3.0, condition: '🌧️ بارانی - مرطوب 🌧️' },
    'london': { temp: 14, feels: 12, humidity: 70, wind: 4.5, condition: '☁️ ابری - احتمال باران' },
    'paris': { temp: 16, feels: 14, humidity: 65, wind: 3.8, condition: '⛅ نیمه ابری' },
    'new york': { temp: 20, feels: 18, humidity: 55, wind: 4.0, condition: '☀️ آفتابی' },
    'tokyo': { temp: 22, feels: 21, humidity: 60, wind: 3.5, condition: '⛅ نیمه ابری' }
};

// دریافت آب و هوا
async function getWeather() {
    const city = document.getElementById('city').value.trim();
    
    if (!city) {
        showAlert();
        return;
    }
    
    document.getElementById('result').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('loading').style.display = 'flex';
    
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        
        const cityLower = city.toLowerCase();
        let weatherData = weatherDatabase[cityLower];
        
        if (!weatherData) {
            const conditions = ['☀️ آفتابی درخشان', '⛅ نیمه ابری', '☁️ ابری', '🌧️ بارانی', '🌨️ برفی'];
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            
            weatherData = {
                temp: Math.floor(Math.random() * 25) + 10,
                feels: Math.floor(Math.random() * 23) + 8,
                humidity: Math.floor(Math.random() * 60) + 20,
                wind: (Math.random() * 8 + 1).toFixed(1),
                condition: randomCondition
            };
        }
        
        displayWeatherWithAnimation(city, weatherData);
        
    }, 1200);
}

// ========== ذخیره شهرهای مورد علاقه ==========

function getFavorites() {
    const favorites = localStorage.getItem('weatherFavorites');
    return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

function showFavorites() {
    const favorites = getFavorites();
    const container = document.getElementById('favoritesList');
    const saveBtn = document.getElementById('saveCityBtn');
    
    if (!container) return;
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="no-favorites">
                <i class="fas fa-star"></i>
                <p>شهری ذخیره نشده است</p>
                <small>برای ذخیره شهر، روی قلب کلیک کنید</small>
            </div>
        `;
        if (saveBtn) saveBtn.style.display = 'none';
        return;
    }
    
    if (saveBtn) saveBtn.style.display = 'flex';
    
    container.innerHTML = favorites.map(city => `
        <div class="favorite-item" onclick="getFavoriteWeather('${city}')">
            <span class="city-name">${city}</span>
            <button class="remove-fav" onclick="showDeleteConfirm('${city}', event)">
                <i class="fas fa-times-circle"></i>
            </button>
        </div>
    `).join('');
}

function saveCurrentCity() {
    const cityInput = document.getElementById('cityName').innerText;
    if (!cityInput || cityInput === '') {
        showAlert();
        return;
    }
    
    const normalizedCity = normalizeCityName(cityInput);
    const displayCity = getDisplayCityName(normalizedCity);
    const favorites = getFavorites();
    
    let isDuplicate = false;
    for (let i = 0; i < favorites.length; i++) {
        if (normalizeCityName(favorites[i]) === normalizedCity) {
            isDuplicate = true;
            break;
        }
    }
    
    if (isDuplicate) {
        showDuplicateAlert(displayCity);
        return;
    }
    
    favorites.push(displayCity);
    saveFavorites(favorites);
    showFavorites();
    
    const successMessage = currentLang === 'fa' 
        ? `${displayCity} با موفقیت به لیست علاقه‌مندی‌ها افزوده شد!`
        : `${displayCity} has been successfully added to favorites!`;
    showSuccessModal(successMessage);
    
    const saveIcon = document.getElementById('saveIcon');
    if (saveIcon) {
        saveIcon.className = 'fas fa-heart';
        setTimeout(() => {
            saveIcon.className = 'far fa-heart';
        }, 1500);
    }
}

function getFavoriteWeather(city) {
    document.getElementById('city').value = city;
    getWeather();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateSaveButtonVisibility() {
    const cityName = document.getElementById('cityName').innerText;
    const saveBtn = document.getElementById('saveCityBtn');
    if (saveBtn && cityName && cityName !== '') {
        saveBtn.style.display = 'flex';
    } else if (saveBtn) {
        saveBtn.style.display = 'none';
    }
}

// ========== پیام موفقیت (تیک سبز) ==========
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const messageText = document.getElementById('successMessage');
    if (modal && messageText) {
        messageText.innerHTML = `<i class="fas fa-heart"></i> ${message}`;
        modal.style.display = 'flex';
        
        setTimeout(() => {
            closeSuccessModal();
        }, 2500);
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========== پیام اخطار شهر تکراری ==========
function showDuplicateAlert(cityName) {
    const modal = document.getElementById('duplicateAlert');
    const messageText = document.getElementById('duplicateMessage');
    const message = currentLang === 'fa'
        ? `شهر "${cityName}" قبلاً به لیست علاقه‌مندی‌ها افزوده شده است!`
        : `City "${cityName}" has already been added to favorites!`;
    if (modal && messageText) {
        messageText.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        modal.style.display = 'flex';
        
        setTimeout(() => {
            closeDuplicateAlert();
        }, 2500);
    }
}

function closeDuplicateAlert() {
    const modal = document.getElementById('duplicateAlert');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========== پیام تأیید حذف ==========
let pendingDeleteCity = null;

function showDeleteConfirm(city, event) {
    if (event) {
        event.stopPropagation();
    }
    pendingDeleteCity = city;
    const modal = document.getElementById('deleteConfirmModal');
    const t = translations[currentLang];
    if (modal) {
        const messageDiv = document.querySelector('#deleteConfirmModal .delete-message');
        if (messageDiv) {
            const message = currentLang === 'fa'
                ? `آیا مطمئن هستید که می‌خواهید شهر "${city}" را از علاقه‌مندی‌ها حذف کنید؟`
                : `Are you sure you want to delete "${city}" from favorites?`;
            messageDiv.innerHTML = `<i class="fas fa-trash-alt"></i> ${message}`;
        }
        const yesBtn = document.querySelector('#deleteConfirmModal .delete-btn-yes');
        const noBtn = document.querySelector('#deleteConfirmModal .delete-btn-no');
        if (yesBtn) yesBtn.innerHTML = `<i class="fas fa-check"></i> ${t.yes}`;
        if (noBtn) noBtn.innerHTML = `<i class="fas fa-times"></i> ${t.no}`;
        
        modal.setAttribute('data-mode', 'single');
        modal.style.display = 'flex';
    }
}

function showDeleteAllConfirm() {
    const modal = document.getElementById('deleteConfirmModal');
    const t = translations[currentLang];
    if (modal) {
        const messageDiv = document.querySelector('#deleteConfirmModal .delete-message');
        if (messageDiv) {
            const message = currentLang === 'fa'
                ? 'آیا مطمئن هستید که می‌خواهید همه شهرهای ذخیره شده را حذف کنید؟'
                : 'Are you sure you want to delete all saved cities?';
            messageDiv.innerHTML = `<i class="fas fa-trash-alt"></i> ${message}`;
        }
        const yesBtn = document.querySelector('#deleteConfirmModal .delete-btn-yes');
        const noBtn = document.querySelector('#deleteConfirmModal .delete-btn-no');
        if (yesBtn) yesBtn.innerHTML = `<i class="fas fa-check"></i> ${t.yes}`;
        if (noBtn) noBtn.innerHTML = `<i class="fas fa-times"></i> ${t.no}`;
        
        modal.setAttribute('data-mode', 'all');
        modal.style.display = 'flex';
    }
}

function clearAllFavorites() {
    showDeleteAllConfirm();
}

function confirmDeleteYes() {
    const modal = document.getElementById('deleteConfirmModal');
    const mode = modal ? modal.getAttribute('data-mode') : 'single';
    
    if (mode === 'all') {
        saveFavorites([]);
        showFavorites();
        const successMessage = currentLang === 'fa'
            ? 'همه شهرها از لیست علاقه‌مندی‌ها حذف شدند!'
            : 'All cities have been removed from favorites!';
        showSuccessModal(successMessage);
    } else if (pendingDeleteCity) {
        let favorites = getFavorites();
        favorites = favorites.filter(c => c !== pendingDeleteCity);
        saveFavorites(favorites);
        showFavorites();
        const successMessage = currentLang === 'fa'
            ? `${pendingDeleteCity} از علاقه‌مندی‌ها حذف شد!`
            : `${pendingDeleteCity} has been removed from favorites!`;
        showSuccessModal(successMessage);
    }
    
    closeDeleteConfirm();
    pendingDeleteCity = null;
    if (modal) modal.removeAttribute('data-mode');
}

function confirmDeleteNo() {
    closeDeleteConfirm();
    pendingDeleteCity = null;
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) modal.removeAttribute('data-mode');
}

function closeDeleteConfirm() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========== دارک مود ==========
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const tooltipText = document.getElementById('tooltipText');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.className = 'fas fa-moon';
        tooltipText.textContent = currentLang === 'fa' ? 'حالت روشن' : 'Light mode';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.className = 'fas fa-sun';
        tooltipText.textContent = currentLang === 'fa' ? 'حالت تاریک' : 'Dark mode';
        localStorage.setItem('theme', 'light');
    }
}

// ========== دکمه راهنما ==========
function showHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) modal.style.display = 'flex';
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) modal.style.display = 'none';
}

// ========== نمودار ==========
function showChart() {
    const city = document.getElementById('cityName').innerText;
    if (!city || city === '') {
        const errorMsg = currentLang === 'fa' ? 'لطفاً ابتدا یک شهر را جستجو کنید!' : 'Please search for a city first!';
        showAlertMessage(errorMsg);
        showAlert();
        return;
    }
    
    const chartContainer = document.getElementById('weatherChart');
    const chartTitle = document.getElementById('chartTitle');
    
    if (currentLang === 'fa') {
        chartTitle.innerHTML = '<i class="fas fa-chart-line"></i> پیش‌بینی دمای ۷ روز آینده';
    } else {
        chartTitle.innerHTML = '<i class="fas fa-chart-line"></i> 7-Day Temperature Forecast';
    }
    
    chartContainer.style.display = 'block';
    
    const days = currentLang === 'fa' 
        ? ['روز 1', 'روز 2', 'روز 3', 'روز 4', 'روز 5', 'روز 6', 'روز 7']
        : ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    
    const currentTemp = parseInt(document.getElementById('temp').innerText);
    const baseTemp = isNaN(currentTemp) ? 20 : currentTemp;
    
    const temps = [];
    for (let i = 0; i < 7; i++) {
        const variation = Math.sin(i * 0.8) * 5;
        let temp = Math.round(baseTemp + variation + (Math.random() * 4 - 2));
        temp = Math.max(0, Math.min(45, temp));
        temps.push(temp);
    }
    
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    
    const chartBars = document.getElementById('chartBars');
    chartBars.innerHTML = '';
    
    temps.forEach((temp, index) => {
        const heightPercent = ((temp - minTemp) / (maxTemp - minTemp || 1)) * 100;
        const barHeight = Math.max(30, (heightPercent / 100) * 100);
        
        const barItem = document.createElement('div');
        barItem.className = 'chart-bar-item';
        barItem.innerHTML = `
            <div class="bar-temp">${temp}°</div>
            <div class="bar-container">
                <div class="bar" style="height: ${barHeight}px;"></div>
            </div>
            <div class="bar-label">${days[index]}</div>
        `;
        chartBars.appendChild(barItem);
    });
    
    chartContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateChartButtonVisibility() {
    const cityName = document.getElementById('cityName').innerText;
    const chartBtn = document.getElementById('chartButton');
    if (chartBtn && cityName && cityName !== '') {
        chartBtn.style.display = 'inline-block';
    } else if (chartBtn) {
        chartBtn.style.display = 'none';
        const chartContainer = document.getElementById('weatherChart');
        if (chartContainer) chartContainer.style.display = 'none';
    }
}

// ========== دانلود PDF ==========
async function downloadPDF() {
    const city = document.getElementById('cityName').innerText;
    if (!city || city === '') {
        const errorMsg = currentLang === 'fa' ? 'لطفاً ابتدا یک شهر را جستجو کنید!' : 'Please search for a city first!';
        showAlertMessage(errorMsg);
        showAlert();
        return;
    }
    
    const loadingMsg = currentLang === 'fa' ? 'در حال آماده‌سازی PDF...' : 'Preparing PDF...';
    showSuccessModal(loadingMsg);
    
    try {
        const temp = document.getElementById('temp').innerText;
        const feels = document.getElementById('feels').innerText;
        const humidity = document.getElementById('humidity').innerText;
        const wind = document.getElementById('wind').innerText;
        const desc = document.getElementById('desc').innerText;
        
        const pdfContent = document.createElement('div');
        pdfContent.style.width = '210mm';
        pdfContent.style.minHeight = '297mm';
        pdfContent.style.padding = '15mm';
        pdfContent.style.backgroundColor = currentLang === 'fa' ? '#1a2a6c' : '#0a0f2a';
        pdfContent.style.color = 'white';
        pdfContent.style.fontFamily = 'IRANSans, Tahoma, Arial, sans-serif';
        pdfContent.style.direction = currentLang === 'fa' ? 'rtl' : 'ltr';
        pdfContent.style.textAlign = 'center';
        pdfContent.style.boxSizing = 'border-box';
        
        const currentDate = new Date().toLocaleDateString(currentLang === 'fa' ? 'fa-IR' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const titleText = currentLang === 'fa' ? 'گزارش آب و هوا' : 'Weather Report';
        const feelsText = currentLang === 'fa' ? 'احساس دما' : 'Feels like';
        const humidityText = currentLang === 'fa' ? 'رطوبت' : 'Humidity';
        const windText = currentLang === 'fa' ? 'سرعت باد' : 'Wind Speed';
        const dateText = currentLang === 'fa' ? 'تاریخ' : 'Date';
        const timeText = currentLang === 'fa' ? 'زمان' : 'Time';
        const currentTime = new Date().toLocaleTimeString(currentLang === 'fa' ? 'fa-IR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        pdfContent.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; border-radius: 25px;">
                <div style="margin-bottom: 20px;">
                    <span style="font-size: 48px;">🌤️</span>
                </div>
                <h1 style="font-size: 28px; margin-bottom: 10px; font-weight: bold;">${titleText}</h1>
                <div style="width: 50px; height: 3px; background: rgba(255,255,255,0.3); margin: 15px auto;"></div>
                <h2 style="font-size: 26px; margin-bottom: 20px; color: #ffd700;">${city}</h2>
                <div style="font-size: 64px; font-weight: bold; margin: 25px 0;">${temp}</div>
                <div style="font-size: 18px; margin: 15px 0; opacity: 0.9;">${desc}</div>
                <div style="display: flex; justify-content: space-around; margin: 30px 0; flex-wrap: wrap;">
                    <div style="text-align: center; margin: 10px;">
                        <div style="font-size: 28px;">🌡️</div>
                        <div style="font-size: 14px; opacity: 0.8;">${feelsText}</div>
                        <div style="font-size: 18px; font-weight: bold;">${feels}</div>
                    </div>
                    <div style="text-align: center; margin: 10px;">
                        <div style="font-size: 28px;">💧</div>
                        <div style="font-size: 14px; opacity: 0.8;">${humidityText}</div>
                        <div style="font-size: 18px; font-weight: bold;">${humidity}</div>
                    </div>
                    <div style="text-align: center; margin: 10px;">
                        <div style="font-size: 28px;">🌬️</div>
                        <div style="font-size: 14px; opacity: 0.8;">${windText}</div>
                        <div style="font-size: 18px; font-weight: bold;">${wind}</div>
                    </div>
                </div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 11px; color: rgba(255,255,255,0.6);">
                    <div>📅 ${dateText}: ${currentDate}</div>
                    <div>⏰ ${timeText}: ${currentTime}</div>
                </div>
            </div>
        `;
        
        pdfContent.style.position = 'absolute';
        pdfContent.style.top = '-9999px';
        pdfContent.style.left = '-9999px';
        document.body.appendChild(pdfContent);
        
        const canvas = await html2canvas(pdfContent, {
            scale: 3,
            backgroundColor: null,
            logging: false,
            useCORS: true,
            windowWidth: pdfContent.scrollWidth,
            windowHeight: pdfContent.scrollHeight
        });
        
        document.body.removeChild(pdfContent);
        
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let pdf;
        if (imgHeight <= pageHeight) {
            pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
            pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            position = -pageHeight;
            while (heightLeft > 0) {
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
                position -= pageHeight;
            }
        }
        
        const fileName = `weather_${city}_${Date.now()}.pdf`;
        pdf.save(fileName);
        
        const successMsg = currentLang === 'fa' ? 'PDF با موفقیت دانلود شد!' : 'PDF downloaded successfully!';
        showSuccessModal(successMsg);
        
    } catch (error) {
        console.error('PDF error:', error);
        const errorMsg = currentLang === 'fa' ? 'خطا در ایجاد PDF!' : 'Error creating PDF!';
        showAlertMessage(errorMsg);
        showAlert();
    }
}

// ========== چند زبانه (فارسی/انگلیسی) ==========
let currentLang = localStorage.getItem('language') || 'fa';

const translations = {
    fa: {
        title: '🌤️ پیش‌بینی آب و هوا',
        subtitle: 'وضعیت جوی هر شهر دنیا',
        placeholder: 'مثال: تهران، لندن، پاریس',
        search: 'جستجو',
        loading: 'در حال دریافت اطلاعات',
        feels: 'احساس',
        humidity: 'رطوبت',
        wind: 'باد',
        error: 'خطا: شهر پیدا نشد',
        save: 'ذخیره در علاقه مندی ها',
        favorites: 'شهرهای مورد علاقه من',
        noFavorites: 'شهری ذخیره نشده است',
        saveHint: 'برای ذخیره شهر، روی قلب کلیک کنید',
        clearAll: 'حذف همه',
        darkMode: 'حالت تاریک',
        lightMode: 'حالت روشن',
        help: 'راهنما',
        about: 'درباره این برنامه',
        howToUse: 'نحوه استفاده',
        supportedCities: 'شهرهای پشتیبانی شده',
        note: 'نکته: داده‌ها به صورت شبیه‌سازی شده نمایش داده می‌شوند',
        understand: 'متوجه شدم',
        yes: 'بله',
        no: 'خیر',
        duplicateMessage: 'این شهر قبلاً به لیست علاقه‌مندی‌ها افزوده شده است!',
        emptySearch: 'لطفاً نام شهر یا کشور را وارد کنید',
        weatherSunny: '☀️ آفتابی',
        weatherPartlyCloudy: '⛅ نیمه ابری',
        weatherCloudy: '☁️ ابری',
        weatherRainy: '🌧️ بارانی',
        weatherSnowy: '🌨️ برفی'
    },
    en: {
        title: '🌤️ Weather Forecast',
        subtitle: 'Weather conditions of any city',
        placeholder: 'Example: Tehran, London, Paris',
        search: 'Search',
        loading: 'Loading information',
        feels: 'Feels like',
        humidity: 'Humidity',
        wind: 'Wind',
        error: 'Error: City not found',
        save: 'Save to favorites',
        favorites: 'My Favorite Cities',
        noFavorites: 'No cities saved',
        saveHint: 'Click on the heart to save a city',
        clearAll: 'Clear all',
        darkMode: 'Dark mode',
        lightMode: 'Light mode',
        help: 'Help',
        about: 'About this app',
        howToUse: 'How to use',
        supportedCities: 'Supported cities',
        note: 'Note: Data is simulated',
        understand: 'Got it',
        yes: 'Yes',
        no: 'No',
        duplicateMessage: 'This city has already been added to favorites!',
        emptySearch: 'Please enter a city or country name',
        weatherSunny: '☀️ Sunny',
        weatherPartlyCloudy: '⛅ Partly Cloudy',
        weatherCloudy: '☁️ Cloudy',
        weatherRainy: '🌧️ Rainy',
        weatherSnowy: '❄️ Snowy'
    }
};

function toggleLanguage() {
    const langTextSpan = document.querySelector('.lang-text');
    
    if (currentLang === 'fa') {
        currentLang = 'en';
        if (langTextSpan) langTextSpan.textContent = 'FA';
        document.body.setAttribute('dir', 'ltr');
    } else {
        currentLang = 'fa';
        if (langTextSpan) langTextSpan.textContent = 'EN';
        document.body.setAttribute('dir', 'rtl');
    }
    
    localStorage.setItem('language', currentLang);
    updateUILanguage();
    
    const tooltip = document.querySelector('.theme-toggle .tooltip');
    if (tooltip) {
        tooltip.textContent = currentLang === 'fa' ? 'حالت تاریک' : 'Dark mode';
    }
}

function updateUILanguage() {
    const t = translations[currentLang];
    
    const title = document.querySelector('.container h1');
    const sub = document.querySelector('.sub');
    const input = document.getElementById('city');
    const searchBtn = document.querySelector('.container > button');
    const loadingText = document.querySelector('.loading-text');
    const errorDiv = document.getElementById('error');
    const saveBtnSpan = document.querySelector('#saveCityBtn span');
    const favHeaderSpan = document.querySelector('.favorite-header span');
    const noFavDiv = document.querySelector('.no-favorites p');
    const noFavSmall = document.querySelector('.no-favorites small');
    const clearBtn = document.querySelector('.clear-favorites-btn');
    
    if (title) title.innerHTML = t.title;
    if (sub) sub.textContent = t.subtitle;
    if (input) input.placeholder = t.placeholder;
    if (searchBtn) searchBtn.innerHTML = `<i class="fas fa-search"></i> ${t.search}`;
    if (loadingText) loadingText.innerHTML = `${t.loading} <i class="dot-floating fas fa-ellipsis-h"></i>`;
    if (errorDiv) errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${t.error}`;
    if (saveBtnSpan) saveBtnSpan.textContent = t.save;
    if (favHeaderSpan) favHeaderSpan.textContent = t.favorites;
    if (noFavDiv) noFavDiv.textContent = t.noFavorites;
    if (noFavSmall) noFavSmall.textContent = t.saveHint;
    if (clearBtn) clearBtn.innerHTML = `<i class="fas fa-trash-alt"></i> ${t.clearAll}`;
    
    const feelsLabel = document.getElementById('feelsLabel');
    const humidityLabel = document.getElementById('humidityLabel');
    const windLabel = document.getElementById('windLabel');
    
    if (feelsLabel) feelsLabel.textContent = t.feels;
    if (humidityLabel) humidityLabel.textContent = t.humidity;
    if (windLabel) windLabel.textContent = t.wind;
    
    const helpTooltip = document.querySelector('.help-tooltip');
    if (helpTooltip) helpTooltip.textContent = currentLang === 'fa' ? 'راهنما' : 'Help';
    
    const alertMessage = document.querySelector('.alert-message');
    const alertSubMessage = document.querySelector('.alert-submessage');
    const alertButton = document.querySelector('.alert-button');
    if (alertMessage) alertMessage.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${t.emptySearch}`;
    if (alertSubMessage) alertSubMessage.textContent = t.saveHint;
    if (alertButton) alertButton.innerHTML = `<i class="fas fa-check"></i> ${t.understand}`;
    
    const successButton = document.querySelector('.success-button');
    if (successButton) successButton.innerHTML = `<i class="fas fa-check"></i> ${t.understand}`;
    
    const duplicateMsg = document.querySelector('#duplicateAlert .duplicate-message');
    const duplicateButton = document.querySelector('.duplicate-button');
    if (duplicateMsg) duplicateMsg.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${t.duplicateMessage}`;
    if (duplicateButton) duplicateButton.innerHTML = `<i class="fas fa-check"></i> ${t.understand}`;
    
    updateHelpModalLanguage();
    updateWeatherConditionLanguage();
    
    const chartTitle = document.getElementById('chartTitle');
    const chartContainer = document.getElementById('weatherChart');
    if (chartContainer && chartContainer.style.display === 'block') {
        if (currentLang === 'fa') {
            chartTitle.innerHTML = '<i class="fas fa-chart-line"></i> پیش‌بینی دمای ۷ روز آینده';
        } else {
            chartTitle.innerHTML = '<i class="fas fa-chart-line"></i> 7-Day Temperature Forecast';
        }
        showChart();
    }
}

function updateWeatherConditionLanguage() {
    const descElement = document.getElementById('desc');
    if (!descElement) return;
    
    const currentText = descElement.innerText;
    const t = translations[currentLang];
    
    let newText = currentText;
    
    if (currentLang === 'en') {
        newText = newText.replace('☀️ آفتابی درخشان ☀️', t.weatherSunny);
        newText = newText.replace('☀️ آفتابی - هوای مطبوع', t.weatherSunny);
        newText = newText.replace('☀️ آفتابی گرم 🌞', t.weatherSunny);
        newText = newText.replace('☀️ آفتابی', t.weatherSunny);
        newText = newText.replace('⛅ نیمه ابری - وزش باد', t.weatherPartlyCloudy);
        newText = newText.replace('⛅ نیمه ابری', t.weatherPartlyCloudy);
        newText = newText.replace('☁️ ابری - خنک', t.weatherCloudy);
        newText = newText.replace('☁️ ابری - احتمال باران', t.weatherCloudy);
        newText = newText.replace('☁️ ابری', t.weatherCloudy);
        newText = newText.replace('🌧️ بارانی - مرطوب 🌧️', t.weatherRainy);
        newText = newText.replace('🌧️ بارانی', t.weatherRainy);
        newText = newText.replace('🌨️ برفی', t.weatherSnowy);
    } else {
        newText = newText.replace('☀️ Sunny', '☀️ آفتابی');
        newText = newText.replace('⛅ Partly Cloudy', '⛅ نیمه ابری');
        newText = newText.replace('☁️ Cloudy', '☁️ ابری');
        newText = newText.replace('🌧️ Rainy', '🌧️ بارانی');
        newText = newText.replace('❄️ Snowy', '🌨️ برفی');
    }
    
    if (newText !== currentText) {
        const spanElement = descElement.querySelector('span');
        if (spanElement) {
            const className = spanElement.className;
            descElement.innerHTML = `📋 <span class="${className}">${newText.replace('📋 ', '')}</span>`;
        }
    }
}

function updateHelpModalLanguage() {
    const t = translations[currentLang];
    
    const helpTitle = document.querySelector('.help-title');
    const helpContent = document.querySelector('.help-content');
    const helpCloseBtn = document.querySelector('.help-button-close');
    
    if (helpTitle) helpTitle.innerHTML = `<i class="fas fa-info-circle"></i> ${t.about}`;
    
    if (helpContent) {
        if (currentLang === 'en') {
            helpContent.innerHTML = `
                <p>🌤️ <strong>Weather Forecast</strong></p>
                <p>Weather conditions of any city</p>
                
                <div class="help-section">
                    <i class="fas fa-search"></i> <strong>How to use:</strong>
                    <ul>
                        <li>Enter the city name in the search box (in Persian or English)</li>
                        <li>Press Enter or click the search button</li>
                        <li>Weather information including temperature, humidity and wind speed is displayed</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-heart"></i> <strong>Favorite cities:</strong>
                    <ul>
                        <li>After searching for a city, click the "Save to favorites" button</li>
                        <li>Saved cities are displayed in the "My Favorite Cities" section</li>
                        <li>To quickly view the weather, click on any city name</li>
                        <li>To delete a city, click the ❌ button next to it</li>
                        <li>Click the 🗑️ button to delete all cities at once</li>
                        <li>Duplicate cities (like Tehran and تهران) are saved as one</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-file-pdf"></i> <strong>Download PDF Report:</strong>
                    <ul>
                        <li>After searching for a city, click the "Download PDF" button</li>
                        <li>A complete weather report will be downloaded as PDF</li>
                        <li>The PDF will be in your selected language (Persian or English)</li>
                        <li>The PDF report has a beautiful professional design with purple gradient</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-chart-line"></i> <strong>Temperature Chart:</strong>
                    <ul>
                        <li>After searching for a city, click the "Temperature Chart" button</li>
                        <li>A 7-day temperature forecast chart is displayed graphically</li>
                        <li>The chart is automatically calculated based on the current city temperature</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-palette"></i> <strong>Dark/Light mode:</strong>
                    <ul>
                        <li>Click on the sun or moon button at the top right</li>
                        <li>The theme changes between light and dark mode</li>
                        <li>Your settings are saved in the browser</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-globe"></i> <strong>Change Language:</strong>
                    <ul>
                        <li>Click on the globe button at the bottom right</li>
                        <li>The app language toggles between Persian and English</li>
                        <li>All texts, modals and buttons are translated to the new language</li>
                        <li>The PDF report and chart will also be in your selected language</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-city"></i> <strong>Supported cities:</strong>
                    <ul>
                        <li>Tehran, Mashhad, Isfahan, Shiraz, Tabriz, Rasht</li>
                        <li>London, Paris, New York, Tokyo and more...</li>
                        <li>Approximate data is displayed for other cities</li>
                    </ul>
                </div>
                
                <div class="help-note">
                    <i class="fas fa-database"></i> <strong>Technical note:</strong> Your favorite cities are stored in the browser and remain after closing the browser. PDF reports are saved in A4 format with high quality.
                </div>
            `;
        } else {
            helpContent.innerHTML = `
                <p>🌤️ <strong>پیش‌بینی آب و هوا</strong></p>
                <p>وضعیت جوی هر شهر دنیا</p>
                
                <div class="help-section">
                    <i class="fas fa-search"></i> <strong>نحوه استفاده:</strong>
                    <ul>
                        <li>نام شهر را در کادر جستجو وارد کنید (به فارسی یا انگلیسی)</li>
                        <li>کلید Enter یا دکمه جستجو را بزنید</li>
                        <li>اطلاعات آب و هوا شامل دما، رطوبت و سرعت باد نمایش داده می‌شود</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-heart"></i> <strong>شهرهای مورد علاقه:</strong>
                    <ul>
                        <li>بعد از جستجوی هر شهر، روی دکمه ذخیره در علاقه مندی ها کلیک کنید</li>
                        <li>شهرهای ذخیره شده در بخش شهرهای مورد علاقه من نمایش داده می‌شوند</li>
                        <li>برای مشاهده سریع آب و هوا، روی نام هر شهر کلیک کنید</li>
                        <li>برای حذف یک شهر، روی دکمه ❌ کنار آن کلیک کنید</li>
                        <li>با کلیک روی دکمه 🗑️ می‌توانید همه شهرها را یکباره حذف کنید</li>
                        <li>شهرهای تکراری (مانند Tehran و تهران) به عنوان یکی ذخیره می‌شوند</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-file-pdf"></i> <strong>دانلود گزارش PDF:</strong>
                    <ul>
                        <li>بعد از جستجوی هر شهر، روی دکمه دانلود PDF کلیک کنید</li>
                        <li>گزارش کامل آب و هوا شامل دما، رطوبت، سرعت باد و تاریخ به صورت PDF دانلود می‌شود</li>
                        <li>PDF دانلود شده با زبان انتخابی شما (فارسی یا انگلیسی) خواهد بود</li>
                        <li>گزارش PDF دارای طراحی زیبا و حرفه‌ای با گرادینت بنفش می‌باشد</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-chart-line"></i> <strong>نمودار دما:</strong>
                    <ul>
                        <li>بعد از جستجوی هر شهر، روی دکمه نمودار دما کلیک کنید</li>
                        <li>نمودار پیش‌بینی دمای ۷ روز آینده به صورت گرافیکی نمایش داده می‌شود</li>
                        <li>نمودار به صورت خودکار بر اساس دمای فعلی شهر محاسبه می‌شود</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-palette"></i> <strong>حالت تاریک/روشن:</strong>
                    <ul>
                        <li>با کلیک روی دکمه خورشید یا ماه در بالا سمت راست</li>
                        <li>تم برنامه بین حالت روشن و تاریک تغییر می‌کند</li>
                        <li>تنظیمات شما در مرورگر ذخیره می‌شود</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-globe"></i> <strong>تغییر زبان:</strong>
                    <ul>
                        <li>با کلیک روی دکمه 🌐 در پایین سمت راست</li>
                        <li>زبان برنامه بین فارسی و انگلیسی تغییر می‌کند</li>
                        <li>تمامی متن‌ها، مودال‌ها و دکمه‌ها به زبان جدید ترجمه می‌شوند</li>
                        <li>گزارش PDF و نمودار نیز به زبان انتخابی شما تغییر می‌کند</li>
                    </ul>
                </div>
                
                <div class="help-section">
                    <i class="fas fa-city"></i> <strong>شهرهای پشتیبانی شده:</strong>
                    <ul>
                        <li>تهران، مشهد، اصفهان، شیراز، تبریز، رشت</li>
                        <li>لندن، پاریس، نیویورک، توکیو و...</li>
                        <li>برای سایر شهرها، داده‌های تقریبی نمایش داده می‌شود</li>
                    </ul>
                </div>
                
                <div class="help-note">
                    <i class="fas fa-database"></i> <strong>نکته فنی:</strong> شهرهای مورد علاقه شما در مرورگر ذخیره می‌شوند و پس از بستن مرورگر نیز باقی می‌مانند. گزارش‌های PDF با فرمت A4 و کیفیت بالا ذخیره می‌شوند.
                </div>
            `;
        }
    }
    
    if (helpCloseBtn) helpCloseBtn.innerHTML = `<i class="fas fa-check"></i> ${t.understand}`;
}

// ========== تنظیمات اولیه ==========
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('light-mode');
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        toggleTheme();
    }
    
    if (currentLang === 'en') {
        document.body.setAttribute('dir', 'ltr');
        document.body.style.textAlign = 'left';
    } else {
        document.body.setAttribute('dir', 'rtl');
        document.body.style.textAlign = 'right';
    }
    
    const customAlert = document.getElementById('customAlert');
    if (customAlert) {
        customAlert.addEventListener('click', function(e) {
            if (e.target === this) closeAlert();
        });
    }
    
    const helpModal = document.getElementById('helpModal');
    if (helpModal) {
        helpModal.addEventListener('click', function(e) {
            if (e.target === this) closeHelpModal();
        });
    }
    
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === this) closeSuccessModal();
        });
    }
    
    const duplicateAlert = document.getElementById('duplicateAlert');
    if (duplicateAlert) {
        duplicateAlert.addEventListener('click', function(e) {
            if (e.target === this) closeDuplicateAlert();
        });
    }
    
    const deleteModal = document.getElementById('deleteConfirmModal');
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === this) closeDeleteConfirm();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const help = document.getElementById('helpModal');
            if (help && help.style.display === 'flex') closeHelpModal();
            const alert = document.getElementById('customAlert');
            if (alert && alert.style.display === 'flex') closeAlert();
            const success = document.getElementById('successModal');
            if (success && success.style.display === 'flex') closeSuccessModal();
            const duplicate = document.getElementById('duplicateAlert');
            if (duplicate && duplicate.style.display === 'flex') closeDuplicateAlert();
            const del = document.getElementById('deleteConfirmModal');
            if (del && del.style.display === 'flex') closeDeleteConfirm();
        }
    });
    
    createParticles();
    showFavorites();
    updateUILanguage();
});