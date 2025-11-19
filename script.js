// База данных атомных масс
const atomicMasses = {
    "H": 1.008, "He": 4.003, "Li": 6.94, "Be": 9.012, "B": 10.81,
    "C": 12.011, "N": 14.007, "O": 15.999, "F": 18.998, "Ne": 20.180,
    "Na": 22.990, "Mg": 24.305, "Al": 26.982, "Si": 28.085, "P": 30.974,
    "S": 32.06, "Cl": 35.45, "K": 39.098, "Ca": 40.078, "Sc": 44.956,
    "Ti": 47.867, "V": 50.942, "Cr": 51.996, "Mn": 54.938, "Fe": 55.845,
    "Co": 58.933, "Ni": 58.693, "Cu": 63.546, "Zn": 65.38, "Ga": 69.723,
    "Ge": 72.630, "As": 74.922, "Se": 78.971, "Br": 79.904, "Kr": 83.798,
    "Rb": 85.468, "Sr": 87.62, "Y": 88.906, "Zr": 91.224, "Nb": 92.906,
    "Mo": 95.95, "Ag": 107.87, "Cd": 112.41, "Sn": 118.71, "Sb": 121.76,
    "I": 126.90, "Ba": 137.33, "Au": 196.97, "Hg": 200.59, "Pb": 207.2,
    "U": 238.03
};

// Функция расчета
function calculateMass() {
    const input = document.getElementById('formula').value.trim();
    const resultDiv = document.getElementById('result');
    
    // Сброс стилей ошибки
    resultDiv.style.borderLeftColor = '#2c3e50'; 

    if (!input) {
        showResult('<span class="error">Введите формулу!</span>', true);
        return;
    }

    // Регулярное выражение: ищем Элемент (напр. He, N) и цифру
    const regex = /([A-Z][a-z]*)(\d*)/g;
    
    let totalMass = 0;
    let match;
    let parsedLength = 0;
    let error = false;

    while ((match = regex.exec(input)) !== null) {
        const element = match[1];
        const countStr = match[2];
        const count = countStr === "" ? 1 : parseInt(countStr);
        
        // Считаем длину распознанной части, чтобы проверить на мусор
        parsedLength += match[0].length;

        if (atomicMasses[element]) {
            totalMass += atomicMasses[element] * count;
        } else {
            showResult(`<span class="error">Элемент "${element}" не найден!</span>`, true);
            error = true;
            break;
        }
    }

    // Если длина распознанного текста меньше длины ввода, значит были лишние символы
    if (!error && parsedLength !== input.length) {
        showResult('<span class="error">Ошибка в формуле (проверьте регистр: NaCl, не nacl)</span>', true);
        error = true;
    }

    if (!error) {
        // Успешный результат
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div>Молярная масса <strong>${input}</strong>:</div>
            <div class="mass-value">${totalMass.toFixed(3)} <small>г/моль</small></div>
        `;
    }
}

// Вспомогательная функция для отображения результата
function showResult(html, isError) {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = html;
    if (isError) {
        resultDiv.style.borderLeftColor = '#e74c3c';
    }
}

// Привязка кнопки к функции
document.getElementById('calcBtn').addEventListener('click', calculateMass);

// Привязка клавиши Enter
document.getElementById('formula').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        calculateMass();
    }
});
