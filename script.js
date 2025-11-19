// 1. Полная база данных элементов (1-118)
const atomicMasses = {
    "H": 1.008, "He": 4.0026, "Li": 6.94, "Be": 9.0122, "B": 10.81, "C": 12.011, "N": 14.007, "O": 15.999,
    "F": 18.998, "Ne": 20.180, "Na": 22.990, "Mg": 24.305, "Al": 26.982, "Si": 28.085, "P": 30.974, "S": 32.06,
    "Cl": 35.45, "K": 39.098, "Ca": 40.078, "Sc": 44.956, "Ti": 47.867, "V": 50.942, "Cr": 51.996, "Mn": 54.938,
    "Fe": 55.845, "Co": 58.933, "Ni": 58.693, "Cu": 63.546, "Zn": 65.38, "Ga": 69.723, "Ge": 72.630, "As": 74.922,
    "Se": 78.971, "Br": 79.904, "Kr": 83.798, "Rb": 85.468, "Sr": 87.62, "Y": 88.906, "Zr": 91.224, "Nb": 92.906,
    "Mo": 95.95, "Tc": 98, "Ru": 101.07, "Rh": 102.91, "Pd": 106.42, "Ag": 107.87, "Cd": 112.41, "In": 114.82,
    "Sn": 118.71, "Sb": 121.76, "Te": 127.60, "I": 126.90, "Xe": 131.29, "Cs": 132.91, "Ba": 137.33, "La": 138.91,
    "Ce": 140.12, "Pr": 140.91, "Nd": 144.24, "Pm": 145, "Sm": 150.36, "Eu": 151.96, "Gd": 157.25, "Tb": 158.93,
    "Dy": 162.50, "Ho": 164.93, "Er": 167.26, "Tm": 168.93, "Yb": 173.05, "Lu": 174.97, "Hf": 178.49, "Ta": 180.95,
    "W": 183.84, "Re": 186.21, "Os": 190.23, "Ir": 192.22, "Pt": 195.08, "Au": 196.97, "Hg": 200.59, "Tl": 204.38,
    "Pb": 207.2, "Bi": 208.98, "Po": 209, "At": 210, "Rn": 222, "Fr": 223, "Ra": 226, "Ac": 227, "Th": 232.04,
    "Pa": 231.04, "U": 238.03, "Np": 237, "Pu": 244, "Am": 243, "Cm": 247, "Bk": 247, "Cf": 251, "Es": 252,
    "Fm": 257, "Md": 258, "No": 259, "Lr": 262, "Rf": 267, "Db": 270, "Sg": 271, "Bh": 270, "Hs": 277, "Mt": 276,
    "Ds": 281, "Rg": 280, "Cn": 285, "Nh": 284, "Fl": 289, "Mc": 288, "Lv": 293, "Ts": 294, "Og": 294
};

function calculateMass() {
    const input = document.getElementById('formula').value.trim();
    const resultDiv = document.getElementById('result');
    
    resultDiv.style.display = 'none';
    resultDiv.style.borderLeftColor = '#2c3e50';

    if (!input) {
        showError("Введите формулу!");
        return;
    }

    try {
        // Запускаем наш "умный" парсер
        const mass = parseFormula(input);
        
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div class="mass-label">Молярная масса <strong>${input}</strong>:</div>
            <div class="mass-value">${mass.toFixed(3)} <small>г/моль</small></div>
        `;
    } catch (e) {
        showError(e.message);
    }
}

function showError(msg) {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.style.borderLeftColor = '#e74c3c';
    resultDiv.innerHTML = `<span class="error">${msg}</span>`;
}

// Основная логика парсера
function parseFormula(formula) {
    // 1. Токенизация: разбиваем строку на "атомы" смысла
    // Ищем: Элемент (Abc) ИЛИ Число (123) ИЛИ Скобки (()[]{})
    const regex = /([A-Z][a-z]*)|(\d+)|([()\[\]{}])/g;
    const tokens = [];
    let match;

    // Проверка на недопустимые символы
    const validChars = /^[A-Za-z0-9()\[\]{}]+$/;
    if (!validChars.test(formula)) {
        throw new Error("Формула содержит недопустимые символы");
    }

    while ((match = regex.exec(formula)) !== null) {
        if (match[1]) tokens.push({ type: 'element', value: match[1] });
        else if (match[2]) tokens.push({ type: 'number', value: parseInt(match[2]) });
        else if (match[3]) tokens.push({ type: 'bracket', value: match[3] });
    }

    // 2. Обработка через Стек (Stack)
    let stack = []; // Стек для хранения масс текущих групп
    
    // Начинаем с текущей группы (основа формулы)
    // Формат в стеке: массив объектов {mass: number}
    stack.push([]); 

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const currentGroup = stack[stack.length - 1];

        if (token.type === 'element') {
            const elementMass = atomicMasses[token.value];
            if (!elementMass) throw new Error(`Неизвестный элемент: ${token.value}`);
            
            // Добавляем элемент в текущую группу
            currentGroup.push({ mass: elementMass });

        } else if (token.type === 'bracket') {
            if ('([{'.includes(token.value)) {
                // Если открывающая скобка - создаем новую группу
                stack.push([]);
            } else {
                // Если закрывающая скобка - завершаем текущую группу
                if (stack.length === 1) throw new Error("Лишняя закрывающая скобка");
                
                const completedGroup = stack.pop(); // Забираем группу
                const groupMass = completedGroup.reduce((sum, item) => sum + item.mass, 0);
                
                // Добавляем результат группы в предыдущую группу как "единый кусок"
                stack[stack.length - 1].push({ mass: groupMass });
            }

        } else if (token.type === 'number') {
            // Если число - умножаем ПОСЛЕДНИЙ добавленный элемент или группу
            if (currentGroup.length === 0) throw new Error("Число стоит в начале группы");
            
            const lastItem = currentGroup[currentGroup.length - 1];
            // ВАЖНО: Увеличиваем массу последнего элемента
            // Мы вычитаем старую массу и добавляем (старая * число)
            // Или просто меняем массу элемента:
            lastItem.mass = lastItem.mass * token.value;
        }
    }

    if (stack.length > 1) throw new Error("Не все скобки закрыты");

    // Суммируем всё, что осталось в основной группе
    const totalMass = stack[0].reduce((sum, item) => sum + item.mass, 0);
    return totalMass;
}

document.getElementById('calcBtn').addEventListener('click', calculateMass);
document.getElementById('formula').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calculateMass();
});
