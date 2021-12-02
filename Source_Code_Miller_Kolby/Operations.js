const keyboard = document.querySelector(".keyboard"); 
const user_input = document.querySelector(".user_input .value"); 
const result_element = document.querySelector(".result .value"); 

// array of buttons 
let calc_buttons = [ 

    {
        name: "sin", symbol: "sin", value: "(s", type: "trig_func", 
    },
    
    {
        name: "cos", symbol: "cos", value: "(c", type: "trig_func", 
    },

    { 
        name: "tan", symbol: "tan", value: "(t", type: "trig_func", 
    },

    {
        name: "Clear", symbol: "C", value: false, type: "key", 
    }, 

    {
        name: "delete", symbol: "<--", value: false, type: "key",
    },

    {
        name: "cot", symbol: "cot", value: "(o", type: "trig_func", 

    }, 

    {
        name: "open-par", symbol: "(", value: "(", type: "number", 
    }, 

    {
        name: "closed-par", symbol: ")", value: ")", type: "number", 

    }, 

    {
        name: "ln", symbol: "ln", value: "n", type: "math_func", 
    }, 

    {
        name: "log", symbol: "log", value: "g", type:"math_func", 
    }, 

    {
        name: "power", symbol: "^", value: "^", type: "math_func", 
    }, 

    {
        name: "divide", symbol: "/", value: "/", type: "operator", 
    }, 

    {
        name: "multiply", symbol: "x", value: "*", type: "operator", 
    
    }, 

    { 
        name: "add", symbol: "+", value: "+", type: "operator", 
    }, 

    { 
        name: "subtract", symbol: "-", value: "-", type: "operator", 
    }, 

    { 
        name: "0", symbol: "0", value: "0", type: "number", 
    }, 

    { 
        name: "1", symbol: "1", value: "1", type: "number",
    },

    { 
        name: "2", symbol: "2", value: "2", type: "number",
    },

    { 
        name: "3", symbol: "3", value: "3", type: "number",
    },

    { 
        name: "4", symbol: "4", value: "4", type: "number",
    },

    { 
        name: "5", symbol: "5", value: "5", type: "number",
    },

    { 
        name: "6", symbol: "6", value: "6", type: "number",
    },

    { 
        name: "7", symbol: "7", value: "7", type: "number",
    },

    { 
        name: "8", symbol: "8", value: "8", type: "number",
    },

    { 
        name: "9", symbol: "9", value: "9", type: "number",
    },

    {
        name: "solution", symbol: "=", value: "=", type: "calculate",
    },

]; 

let calc_data = {

    expression: [], equiv_form: [], 

}; 

let result = 0; 

// creates a function that creates the keyboard and arranges the buttons into rows 
function createKeyboard() { 

    const buttons_per_row = 4; 
    let added = 0; 

    calc_buttons.forEach(button => { 

        if (added % buttons_per_row == 0) { 
            // pushes new row into keyboard element
            keyboard.innerHTML += `<div class="row"></div`; 
        }

        const row = document.querySelector(".row"); 
        row.innerHTML += `<button id="${button.name}">${button.symbol}</button`; 
        
        added++; 
    })
}

// calls function to populate the keyboard.  
createKeyboard(); 


// Event Listener on click of button 
keyboard.addEventListener("click", (event) => {

    const target_button = event.target; 

    calc_buttons.forEach((button) => { 
        
        if (button.name == target_button.id) { 
            onButtonPress(button); 
        }
    });
});

// Button on press handler 
function onButtonPress(button) { 

    
    // updates input operators 
    if (button.type == "operator") { 

        calc_data.expression.push(button.symbol); 
        calc_data.equiv_form.push(button.value); 
    }

    // updates inputs numbers and parentheses 
    else if (button.type == "number") { 

        calc_data.expression.push(button.symbol); 
        calc_data.equiv_form.push(button.value); 
    }

    // updates screen input for trig functions 
    else if (button.type == "trig_func") { 

    

        if(button.name == "sin") {

            calc_data.expression.push("sin");
            calc_data.equiv_form.push(button.value);

          }
          
          else if(button.name == "cos") {

            calc_data.expression.push("cos");
            calc_data.equiv_form.push(button.value);

          }
          
          else if(button.name == "tan") {

            calc_data.expression.push("tan");
            calc_data.equiv_form.push(button.value);

          }

          else if(button.name == "cot") {
            calc_data.expression.push("cot");
            calc_data.equiv_form.push(button.value);
            
          } 
    }

    // updates the input for math functions like ln, log, and exponent 
    else if (button.type == "math_func") { 

        if (button.name == "log") { 

            calc_data.expression.push("log");
            calc_data.equiv_form.push(button.value);
        }

        else if (button.name == "ln") { 

            calc_data.expression.push("ln");
            calc_data.equiv_form.push(button.value);
        }

        else if (button.name == "power") { 

            calc_data.expression.push("^");
            calc_data.equiv_form.push(button.value);
             
           
        }
    }

    // updates input for all other keys 
    else if (button.type == "key") { 

        if (button.name == "Clear") { 

            calc_data.expression = []; 
            calc_data.equiv_form = []; 
            updateResultToScreen(0); 
        }

        else if (button.name == "delete") { 
            
            // removes last index in the array and returns that element
            calc_data.expression.pop(); 
            calc_data.equiv_form.pop(); 
        }
    }

    // updates solution to equation 
    else if (button.type == "calculate") { 

        
        console.log("calc_data: ", calc_data.equiv_form);

    let equiv_js_expression = calc_data.equiv_form.join("");
    onCalculatePress(equiv_js_expression);
    }

    console.log("equivalent: ", calc_data.equiv_form.join('')); 

    updateToScreen(calc_data.expression.join('')); 

}
    // caculate button press that begins the expression evaluation when the user clicks "=". 
    function onCalculatePress(expression) { 

        console.log("Expression on calc: ", expression); 

        console.log("INFIX TO POSTFIX CALL"); 
        let computation = convertThenEval(expression); 
        console.log("---------------------------"); 

        updateResultToScreen(computation); 

    }
    
    function search(array, keyword) { 

        let search_result = []; 

        array.forEach( (element, index) => {

            if (element == keyword) { 
                search_result.push(index); 
            }
        })
        return search_result; 
    }

    // updating the user input to the screen 
    function updateToScreen(expression) { 

        user_input.innerHTML = expression; 

    }

    function updateResultToScreen(result) { 

        result_element.innerHTML = result; 
    }


    
        
    










