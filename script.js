const display = document.getElementById("display");
    let currentInput = "";
    let operator = null;
    let operand1 = null;
    let resultDisplayed = false;


    function updateDisplay(value) {
      const stringValue = value.toString();

  // Limit to 12 characters max, with ellipsis if too long
      if (stringValue.length > 12) {
        display.textContent = stringValue.slice(0, 12);
      } else {
        display.textContent = stringValue;
      }
    }

    function clear() {
      currentInput = "";
      operator = null;
      operand1 = null;
      updateDisplay("0");
    }

    function backspace() {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
    }

    function handleNumber(num) {
      if (resultDisplayed) {
        currentInput = "";
        resultDisplayed = false;
      }
      if (num === "." && currentInput.includes(".")) return;
      if (currentInput.length >= 20) return;
      currentInput += num;
      updateDisplay(currentInput);
    }

    function handleOperator(op) {
      if (currentInput === "") return;
      if (operand1 === null) {
        operand1 = parseFloat(currentInput);
      } else if (operator) {
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
        case "%": return a % b;
        default: return b;
      }
    }

    function handleEquals() {
      if (operator === null || currentInput === "") return;
      let result = calculate(operand1, parseFloat(currentInput), operator);
      if (typeof result === "number" && result.toString().length > 12) {
        result = parseFloat(result.toPrecision(12));
      }
      updateDisplay(result);
      currentInput = result.toString();
      operator = null;
      operand1 = null;
      resultDisplayed = true;
    }

    function toggleMode() {
      document.body.classList.toggle("dark-mode");
    }

    document.addEventListener("keydown", (e) => {
      if (!isNaN(e.key)) {
        handleNumber(e.key);
      } else if (["+", "-", "*", "/", "%"].includes(e.key)) {
        handleOperator(e.key);
      } else if (e.key === "Enter" || e.key === "=") {
        handleEquals();
      } else if (e.key === "Backspace") {
        backspace();
      } else if (e.key === "Escape") {
        clear();
      } else if (e.key === ".") {
        handleNumber(".");
      }
    });

    document.querySelectorAll(".btn").forEach(btn => {
      const number = btn.dataset.number;
      const op = btn.dataset.operator;
      const action = btn.dataset.action;

      btn.addEventListener("click", () => {
        btn.classList.add("clicked");
        setTimeout(() => btn.classList.remove("clicked"), 150);
      });

      if (number !== undefined) {
        btn.addEventListener("click", () => handleNumber(number));
      } else if (op !== undefined) {
        btn.addEventListener("click", () => handleOperator(op));
      } else if (action === "clear") {
        btn.addEventListener("click", clear);
      } else if (action === "equals") {
        btn.addEventListener("click", handleEquals);
      } else if (action === "backspace") {
        btn.addEventListener("click", backspace);
      }
    });

    document.querySelector(".mode-toggle")?.addEventListener("click", toggleMode);

    updateDisplay("0");