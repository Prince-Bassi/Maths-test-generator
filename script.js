const typeInput = document.querySelector("#type");
const numOfDigtsInput = document.querySelector("#numOfDigits");
const numOfQuesInput = document.querySelector("#numOfQuestions");
const submitButton = document.querySelector(".submit");
const testList = document.querySelector(".test");

class ArithmaticQuestion {
       constructor(type, numOfDigits, numOfOperands) {
              this.equation = "";
              this.operands = this.generateOperands(numOfDigits, numOfOperands);
              this.operators = this.generateOperators(type);

              this.generateEquation();
       }

       generateEquation() {
              for (let i = 0; i < this.operands.length; i++) {
                     if (i != 0) {
                            this.equation += " ";
                            if (this.operators.length === 1) {
                                   this.equation += this.operators[0];
                            }
                            else {
                                   this.equation += this.operators[Math.floor(Math.random() * this.operators.length)];
                            }
                            this.equation += " ";
                     }
                     this.equation += this.operands[i];
              }

              this.equation += " = ";
       }

       generateOperators(type) {
              const allOperators = ["+", "-", "*", "/"];

              if (type === "allOperators" && this.operands.length <= 2) {
                     return allOperators[Math.floor(Math.random() * allOperators.length)];
              }
              else if (type === "allOperators") {
                     return allOperators
              }
              else {
                     return type
              }
       }

       generateOperands(numOfDigits, numOfOperands) {
              const operands = [];
              
              for (let i = 0; i < numOfOperands; i++) {
                     let operand = 0;
                     while (operand.toString().length < + numOfDigits || operand.toString()[0] === "0") {
                            operand = Math.floor(Math.random() * (10**numOfDigits));
                     }
                     operands.push(operand);
              }

              return operands
       }

       calculateTwoOperands() { //needs improvement
              switch (this.operators) {
                     case "+":
                            this.calculated = this.operands[0] + this.operands[1];
                            break;
                     case "-":
                            this.calculated = this.operands[0] - this.operands[1];
                            break;
                     case "*":
                            this.calculated = this.operands[0] * this.operands[1];
                            break;
                     case "/":
                            this.calculated = Math.round(this.operands[0] / this.operands[1], 2);
              }
       }
}

class MissingQuestion extends ArithmaticQuestion{
       constructor(type, numOfDigits) {
              super(type, numOfDigits, 2);
              this.equation = "";
              this.missingOperand = this.operands[Math.floor(Math.random() * this.operands.length)];

              this.calculateTwoOperands();

              for (let i of this.operands) {
                     if (i === this.missingOperand) {
                            this.operands[this.operands.indexOf(i)] = "???";
                     }
              }
              this.generateEquation();
              this.equation += this.calculated;
       }
}

class LinearEquation extends ArithmaticQuestion {
       constructor(type, numOfDigits) {
              super(type, numOfDigits, 2)
              this.x = (Math.random() > 0.5) ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * -10) - 1;
              this.equation = "";
              this.variableExpressionIndex = Math.floor(Math.random() * this.operands.length);

              this.operands[this.variableExpressionIndex] = this.operands[this.variableExpressionIndex] * this.x;
              this.calculateTwoOperands();
              this.operands[this.variableExpressionIndex] = this.operands[this.variableExpressionIndex] / this.x + "x";
              if (this.operands[this.variableExpressionIndex][0] === "1") {
                     this.operands[this.variableExpressionIndex] = "x";
              }
              this.generateEquation();
              console.log(this.x);
              this.equation += this.calculated;
       }
}

function generateQuestion(type) {
       let question;
       switch (type) {
              case "Arithmatic":
                     question = new ArithmaticQuestion(typeInput.value, numOfDigtsInput.value, 2).equation;
                     break;
              case "Missing":
                     question = new MissingQuestion(typeInput.value, numOfDigtsInput.value).equation;
                     break;
              case "Linear":
                     question = new LinearEquation(typeInput.value, numOfDigtsInput.value).equation;
                     break;
              default:
                     console.log("error");
       }

       return question
}

submitButton.addEventListener("click", () => {
       const n = + numOfQuesInput.value;
       testList.innerHTML = "";
       for (let i = 0; i < n; i++) {
              testList.innerHTML += `<li>${generateQuestion("Linear")}</li>`;
       }
});
