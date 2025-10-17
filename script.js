// DOM 元素引用
const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.getElementById("strength-bar");
const strengthLabel = document.getElementById("strength-label");
const strengthInfo = document.getElementById("strength-info");

// 字符集定义
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// 初始化函数
function init() {
    lengthDisplay.textContent = lengthSlider.value;

    lengthSlider.addEventListener("input", updateLengthDisplay);

    generateButton.addEventListener("click", makePassword);
    
    copyButton.addEventListener("click", copyToClipboard);
    
    window.addEventListener("DOMContentLoaded", makePassword);
    
    [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(checkbox => {
        checkbox.addEventListener("change", makePassword);
    });
    
    lengthSlider.addEventListener("input", makePassword);
}

function updateLengthDisplay() {
    lengthDisplay.textContent = lengthSlider.value;
}

function makePassword() {
    const length = Number(lengthSlider.value);
    const includeUppercase = uppercaseCheckbox.checked;
    const includeLowercase = lowercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;
    
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        showError("Please select at least one character type.");
        return;
    }
    
    const newPassword = createRandomPassword(
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols
    );
    
    passwordInput.value = newPassword;
    
    updateStrengthMeter(newPassword);
}

function createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
) {
    let allCharacters = "";
    let password = "";
    
    if (includeUppercase) allCharacters += uppercaseLetters;
    if (includeLowercase) allCharacters += lowercaseLetters;
    if (includeNumbers) allCharacters += numberCharacters;
    if (includeSymbols) allCharacters += symbolCharacters;
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex];
    }
    
    return password;
}

function updateStrengthMeter(password) {
    const passwordLength = password.length;
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);
    
    let strengthScore = 0;
    
    strengthScore += Math.min(passwordLength * 2, 40);
    
    if (hasUppercase) strengthScore += 15;
    if (hasLowercase) strengthScore += 15;
    if (hasNumbers) strengthScore += 15;
    if (hasSymbols) strengthScore += 15;
    
    if (passwordLength < 8) {
        strengthScore = Math.min(strengthScore, 40);
    }
    
    const safeScore = Math.max(5, Math.min(100, strengthScore));
    strengthBar.style.width = safeScore + "%";
    
    let strengthLabelText = "";
    let barColor = "";
    let strengthDescription = "";
    
    if (strengthScore < 40) {
        barColor = "#fc8181";
        strengthLabelText = "Weak";
        strengthDescription = "Your password is weak. Consider increasing length and adding more character types.";
    } else if (strengthScore < 70) {
        barColor = "#fbd38d";
        strengthLabelText = "Medium";
        strengthDescription = "Your password is moderately strong. Adding more character types or length would improve it.";
    } else {
        barColor = "#68d391";
        strengthLabelText = "Strong";
        strengthDescription = "Your password is strong and secure. Good job!";
    }
    
    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLabelText;
    strengthInfo.innerHTML = `<p>${strengthDescription}</p>`;
}

function copyToClipboard() {
    if (!passwordInput.value) {
        showError("No password to copy!");
        return;
    }
    
    navigator.clipboard
        .writeText(passwordInput.value)
        .then(() => showCopySuccess())
        .catch((error) => {
            console.error("Could not copy:", error);
            showError("Failed to copy password. Please try again.");
        });
}

function showCopySuccess() {
    const originalIcon = copyButton.classList.contains("fa-copy");
    
    copyButton.classList.remove("fa-copy");
    copyButton.classList.add("fa-check");
    copyButton.style.color = "#48bb78";
    
    copyButton.style.transform = "scale(1.2)";
    setTimeout(() => {
        copyButton.style.transform = "scale(1)";
    }, 200);
    
    setTimeout(() => {
        copyButton.classList.remove("fa-check");
        copyButton.classList.add("fa-copy");
        copyButton.style.color = "";
    }, 3000);
}

function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fc8181;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 300px;
        font-size: 0.9rem;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.opacity = "0";
        errorDiv.style.transition = "opacity 0.5s";
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 500);
    }, 3000);
}

init();
