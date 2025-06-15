const display = document.getElementById("display");
let currentInput = "";
let operator = null;
let operand1 = null;

function updateDisplay(value) {
  display.textContent = value;

  // Shrink font if too long
  if (value.toString().length > 9) {
    display.classList.add("shrink");
  } else {
    display.classList.remove("shrink");
  }
}

function clear() {
  currentInput = "";
  operator = null;
  operand1 = null;
  updateDisplay("0");
}

function handleNumber(num) {
  // Prevent overflow: limit to 12 digits
  if (currentInput.length >= 12) return;

  if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay(currentInput);
}

function handleOperator(op) {
  if (currentInput === "") return;
  if (operand1 === null) {
    operand1 = parseFloat(currentInput);
  } else {
    operand1 = calculate(operand1, parseFloat(currentInput), operator);
    updateDisplay(operand1);
  }
  operator = op;
  currentInput = "";
}

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b !== 0 ? a / b : "Error";
    default: return b;
  }
}

function handleEquals() {
  if (operator === null || currentInput === "") return;
  let result = calculate(operand1, parseFloat(currentInput), operator);

  // If result is too long, round it
  if (typeof result === "number" && result.toString().length > 12) {
    result = parseFloat(result.toPrecision(12));
  }

  updateDisplay(result);
  currentInput = result.toString();
  operator = null;
  operand1 = null;
}

document.querySelectorAll(".btn").forEach(btn => {
  const number = btn.dataset.number;
  const op = btn.dataset.operator;
  const action = btn.dataset.action;

  if (number !== undefined) {
    btn.addEventListener("click", () => handleNumber(number));
  } else if (op !== undefined) {
    btn.addEventListener("click", () => handleOperator(op));
  } else if (action === "clear") {
    btn.addEventListener("click", clear);
  } else if (action === "equals") {
    btn.addEventListener("click", handleEquals);
  }
});
