const X_MAX = 10;
const X_MIN = -10;
const typeInput = document.querySelector("#type");
const numOfDigtsInput = document.querySelector("#numOfDigits");
const numOfQuesInput = document.querySelector("#numOfQuestions");
const submitButton = document.querySelector(".submit");
const testList = document.querySelector(".test");

class ArithmaticQuestion {
       constructor(operationType, numOfDigits, numOfOperands) {
              this.equation = "";
              this.operands = this.generateOperands(numOfDigits, numOfOperands);
              this.operators = this.generateOperators(operationType);

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

       generateOperators(operationType) {
              /* Function to generate the operator list. We use the value of the typeInput which can be '+', '-', '*', '/' or 'allOperators'
              We use the operators themselves for checking to directly assign them in the operators list. The allOperators is essential to get
              what possible operators we are dealing with.*/
              const allOperators = ["+", "-", "*", "/"];

              if (operationType === "allOperators" && this.operands.length <= 2) {
                     return allOperators[Math.floor(Math.random() * allOperators.length)];
              }
              else if (operationType === "allOperators") {
                     return allOperators
              }
              else {
                     return operationType
              }
       }

       generateOperands(numOfDigits, numOfOperands) {
              /* Function to generate operands. It takes in the number of digits we want the numbers to have and the number of operands.
              Here we use a for loop for the number of operands we have. For each iteration, it generstes a number 
              between the calculated min and max values and appends it to the operands list.*/
              const operands = [];
              
              const min = 10 ** (numOfDigits - 1); 
              const max = (10 ** numOfDigits) - 1;

              for (let i = 0; i < numOfOperands; i++) {
                     const operand = Math.floor(Math.random() * (max - min + 1)) + min;
                     operands.push(operand);
              }

              return operands
       }

       calculateTwoOperands() { //needs a full overhaul, please ignore this and just assume that two numbers are magically calculated
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
       /* The type of equation where we have to find an operand and we are given the solution.
       Now this class uses the Arithmatic class to generate the equation and reduces redundancy.*/
       constructor(operationType, numOfDigits) {
              super(operationType, numOfDigits, 2); //NOTE: Have to implement better calculation to solve for more than 2 operands
              this.equation = "";
              this.missingOperand = this.operands[Math.floor(Math.random() * this.operands.length)];
              //A random operand is selected from the operands.

              this.calculateTwoOperands(); //Finds their solution of the operands

              for (let i of this.operands) {
                     if (i === this.missingOperand) {
                            this.operands[this.operands.indexOf(i)] = "???";
                            break;
                     }
              }
              this.generateEquation(); //and now the equation is generated with the updated operands
              this.equation += this.calculated; //The solution is appended to the end of the equation
       }
}

class LinearEquation extends ArithmaticQuestion {
       /* This class also uses code from the Arithmatic to reduce redundancy*/
       constructor(operationType, numOfDigits) {
              super(operationType, numOfDigits, 2) //NOTE: Have to implement better calculation to solve for more than 2 operands

              this.x = (Math.random() > 0.5) ? Math.floor(Math.random() * X_MAX) + 1 : Math.floor(Math.random() * X_MIN) - 1;
              //x is randomly taken within the range of X_MIN and X_MAX
              
              this.equation = "";

              this.variableExpressionIndex = Math.floor(Math.random() * this.operands.length);
              //the operand which is to be multiplied with x

              this.operands[this.variableExpressionIndex] = this.operands[this.variableExpressionIndex] * this.x;
              //the operand is temporarily changed to calculate the solution

              this.calculateTwoOperands();

              this.operands[this.variableExpressionIndex] = this.operands[this.variableExpressionIndex] / this.x + "x";
              //The operand is divided by the x to return its original value and a string 'x' is appended to it.
              
              if (this.operands[this.variableExpressionIndex][0] === "1") {
                     this.operands[this.variableExpressionIndex] = "x";
              }
              this.generateEquation();
              
              this.equation += this.calculated; 
       }
}

function generateQuestion(questionType) {
       let question;
       switch (questionType) {
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
              //Only Linear equations for now because the code is still in development
       }
});
