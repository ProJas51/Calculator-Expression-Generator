// tried to incorporate nodejs and npm to allow access to the mathjs evaluator, but was not allowing the import outside of the module. Tried Jquery as well but nothing seemed to work ;-;. 
//import {create, all} from "mathjs";

console.log("This program will generate automatic test cases for the calculator program created in lab 3."); 
const input = window.prompt("How many test cases will be ran?");  
const execute = document.getElementById("button"); 
console.log(input);

const binaryOps = ["+", "-", "*", "/", "^"]; 
const unaryOps = ["sin(", "cos(", "tan(", "cot(",]; 

// randomly returns a boolean value of true or false (i.e. 1 or 0). 
function randBinary() { 

    return (Math.floor(Math.random() * 2) === 0); 

}

// this function will shuffle my generated valid expression to generate an invalid expression
function breakExp(arr) { 

    let currentIndex = arr.length, randIdx; 
    while (currentIndex != 0) { 
        randIdx = Math.floor(Math.random() * currentIndex); 
        currentIndex--; 
        [arr[currentIndex], arr[randIdx]] = [arr[randIdx], arr[currentIndex]]; 
        
    }
    return arr; 
}

function randNumber(isFloat) { 

    return isFloat ? (Math.random() * 1001).toFixed(2) : (Math.floor(Math.random() * (1001))); 
}


// this function will take in an array as the generated expression, and add either a number, operator, or parentheses to the expression 
function fillExpression(shuffle = false) { 
    let len = input; 
    const expression = []; 
    let prev = ''; 
    let paren = 0; 
    

    while (len > 0) { 
   
       // switch statement to randomly select the options for generating the next operator in the expression. 
       switch (prev) { 

            // this case is for the start of the expression 
            case "": 
                if (randBinary()) { 

                    const num = randNumber(); 
                    expression.push(num); 
                    len--; 
                    prev = 'num'
                     
                }
                
                else { 

                    const unary = unaryOps[Math.floor(Math.random() * unaryOps.length)]; 
                    expression.push(unary); 
                    prev = 'unary'; 
                    paren++; 
                    

                }
                break; 
            // this case is for what can come after a number 
            case 'num': 

                const op = binaryOps[Math.floor(Math.random() * binaryOps.length)]; 
                expression.push(op); 
                prev = 'binary'; 
                break; 
            // this case is for what can come after a binary operator. 
            case 'binary': 
                if (randBinary()) { 

                    const num = randNumber(); 
                    expression.push(num); 
                    len--; 
                    prev = 'num'; 
                    if (randBinary() && paren > 0) { 
                        
                        expression.push (')'); 
                        paren--; 
                    }
                }
                // if not binary, then a random unary can come after. 
                else { 
                    const unary = unaryOps[Math.floor(Math.random() * unaryOps.length)];
                    expression.push(unary); 
                    prev = 'unary'; 
                    paren++; 
                }
                break; 

            case 'unary' : 

                const num = randNumber(); 
                expression.push(num); 
                len--; 
                prev = 'num'; 
                if (randBinary() && paren > 0) { 
                    expression.push(')'); 
                    paren--; 
                }
                break; 
        }
        
        

        if (shuffle) { 

            breakExp(expression); 
        }
    
    }
    while (paren > 0) { 

        expression.push(')'); 
        paren--; 
        
    }

    
   
    // creates a new array that will be used for the eval() function. the previous expression array will be the array that goes through the calculator. 
    const evalExpression = new Array(expression.length); 
    for (let i = 0; i < expression.length; i++) { 

        if (expression[i] === 'ln(') { 

            evalExpression[i] = 'log('; 
        }

        else if (expression[i] === 'log(') { 

            evalExpression[i] = 'log10'; 
        
        }

        else { 

            evalExpression[i] = expression[i]; 
        }
    }
    
    return [expression, evalExpression]; 

    
}



// event listener to execute the fillExpression function once "Go" button is clicked 
execute.addEventListener("click", function() { 
    console.log(fillExpression()); 
    let getArray = fillExpression(); 
    let arrayString = getArray.join(''); 
    Evaluate(arrayString); 
    this.good = []; 
    this.bad = []; 
    const [good, _1] = fillExpression(this.len); 
    const [bad, _2] = fillExpression(this.len, true); 
    for (let j = 0; j < this.input; j++) { 

        this.good.push([goodExp.join(''), _3.join('')]); 
        this.bad.push([goodExp.join(''), _3.join('')]);
    }
     
}); 




function Evaluate(expression) { 
    
    //const config = {}; 
    //const math = create(all, config); 
    console.log(expression); 
    console.log(InfixToPostfix.convertThenEval(expression)); 
    console.log(math.evaluate(expression)); 
} 

