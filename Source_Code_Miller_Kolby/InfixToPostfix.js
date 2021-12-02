function convertThenEval(infix) {
  
    if(!preParseSyntax(infix)) {
      return "System Error!";
    }
    
    else {
      let finalResult = shuntingYard(infix);
  
      if(finalResult >= Infinity) {
        return "Size overflow, too large!";
      }
      else if(finalResult <= -Infinity) {
        return "Size overflow, too small!";
      }
      else if(isNaN(finalResult)) {
        return "Invalid Operation";
      }
      else {
        return finalResult; 
      }
    }
  }
  
  /**
   * @description This function first works to convert infix notation to 
   * postfix notation then evaluates the post fix notation to an 
   * evaluated expression. If a divide by 0 takes place or a few other errors, 
   * it will return an error message.
   * 
   * This algorithm was modified to fit more scientific functionality from
   * the general expression evaluator found here on Geeks for Geeks
   * https://www.geeksforgeeks.org/expression-evaluation/
   * 
   * @param {String} tokens 
   * @return Float or Error Message
   */
  function shuntingYard(tokens) {
    
    // setting up 2 stacks, one for the output and the operators
    // peek is a helper function that shows the last element of a given array
    let peek = (a) => a[a.length - 1];
    let opStack = [];
    let outputStack = [];
  
    for (let i = 0; i < tokens.length; i++) {
  
      // if token is a whitespace then skip
      if (tokens[i] == ' ') {
        continue;
      }
  
      // Checking if any negation represented as unary minus operator
      // Cases for if "-" is the first symbol and for throughout the expression
      if (i == 0 && tokens[i] == "-") {
        outputStack.push(-1.0);
        opStack.push("*");
        tokens = tokens.slice(0, i) + tokens.slice(i+1);
  
        console.log("sliced: ", tokens);
      }
      else if (tokens[i] == "-" && checkForNeg(tokens[i-1])) {
        outputStack.push(-1.0);
        opStack.push("*");
        tokens = tokens.slice(0, i) + tokens.slice(i+1);
  
        console.log("sliced: ", tokens);
      }
  
      // If token is a valid number
      if (!isNaN(tokens[i])) {
  
        let strOfDigits = "";
  
        // Case to handle multi-digit numbers or decimal numbers
        while ( (i < tokens.length && !isNaN(tokens[i]) ) || (i < tokens.length && tokens[i] == '.') ) {
          
          // append the next digit
          strOfDigits += tokens[i++];
          
          // adds to value stack
          outputStack.push(parseFloat(strOfDigits));
        }
  
        i--;
      }
  
      // Current token is an opening brace, 
      // push it to 'ops'
      else if (tokens[i] == '(') {
        opStack.push(tokens[i]);
      }
  
      // Closing parenthesis encountered, so evaluate between ( ) parentheses
      else if (tokens[i] == ')') {
  
        while (opStack[opStack.length - 1] != '(') {
  
          let result = 0;
  
          // Checks if regular operators or other binary operator function like ^
          if (isBinary(peek(opStack))) {
            
            let operator = opStack.pop();
            let a = outputStack.pop();
            let b = outputStack.pop();
  
            result = binaryOp(operator, a, b);
  
            // Exit early because can't divide by 0
            if(result == "Cannot Divide by 0!") {
              return result;
            }
          }
  
          // Checks for unary functions requiring one parameter like ln(), log(), and trig functions
          else if (isUnary(peek(opStack))) {
           
            let operator = opStack.pop();
            let number = outputStack.pop();
  
            result = unaryOp(operator, number);
          }
  
          outputStack.push(result);
        }
  
        // removes left parenthesis "("
        opStack.pop();
      }
  
      // checks for operator
      else if (isBinary(tokens[i]) || isUnary(tokens[i])) {
  
        while (opStack.length != 0 && checkPrecedence(tokens[i], peek(opStack)) ) {
  
          let result = 0;
  
          // checks for regular operators and ^
          if(isBinary(peek(opStack))) {
            let operator = opStack.pop();
            let a = outputStack.pop();
            let b = outputStack.pop();
  
            result = binaryOp(operator, a, b);
          }
  
          // checks for unary parameter functions like ln(), log(), and trig functions
          else if (isUnary(peek(opStack))) {
            let operator = opStack.pop();
            let number = outputStack.pop();
  
            result = unaryOp(operator, number);
          }
  
          outputStack.push(result);
        }
  
        opStack.push(tokens[i]);
      }
  
    } // end of for (i < tokens.length)
   
    //---------------------------------------------------------------------------------
  
      /** 
       * --------------------------------------------------------------
       * Now the infix expression is represented in post fix
       * notation, so now empty the operator stack
       * --------------------------------------------------------------
       */
  
      while (opStack.length != 0) {
  
        let result = 0;
  
          // Checks for regular operators and ^
          if (isBinary(peek(opStack))) {
            let operator = opStack.pop();
            let a = outputStack.pop();
            let b = outputStack.pop();
  
            result = binaryOp(operator, a, b);
          }
          // Checks for unary parameter functions like ln(), log(), and trig functions
          else if (isUnary(peek(opStack))) {
            let operator = opStack.pop();
            let number = outputStack.pop();
  
            result = unaryOp(operator, number);
          }
  
          outputStack.push(result);
      }
  
    return outputStack.pop();
  
  } // end of shuntingYard function
  
  
  /**
   * ----------------------------------------------------------------
   * Utility functions below for various checks and math calculations
   * ----------------------------------------------------------------
   */
  
  // Conversion of degrees to radians for trig functions
  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }
  
  // Preprocessing scan to check for matching parenthesis
  function preParseSyntax(infix) {
  
    let isValid = true;
    let leftParen = 0;
    let rightParen = 0;
  
    for (let i = 0; i < infix.length; i++) {
      if (infix.charAt(i) == "(") {
        leftParen++;
      } 
      else if (infix.charAt(i) == ")") {
        rightParen++;
      }
    }
  
    if (leftParen != rightParen) {
      isValid = false;
    }
  
    return isValid;
  }
  
  // Tests for minus symbol represented as unary (negation)
  function checkForNeg(prevToken) {
    if (prevToken == "(" || isBinary(prevToken) || isUnary(prevToken) ) {
      return true;
    }
    else {
      return false;
    }
  }
  
  /**
   * Determines precendence based on the current operator from token[i] (op1)
   * and the previously stored operator stored on the operator stack (op2)
   */
  function checkPrecedence(op1, op2) {
    
    // handles parenthesis as operators
    if (op2 == "(" || op2 == ")") {
      return false;
    }
  
    // Determines if op2 has a precendence >= op1 precedence, otherwise returns false
    else if ((op1 == "*" || op1 == "/" || op1 == "^" || op1 == "s" || op1 == "c" ||
        op1 == "t" || op1 == "o" || op1 == "g" || op1 == "n") && 
        (op2 == "+" || op2 == "-")) {
  
      return false;    
    } 
    
    else {
      return true;
    }
  
  }
  
  // Function to handle normal operations as well as ^ which requires 2 parameters
  function binaryOp(operator, a, b) {
    
    let result = -Infinity;
    
    // a is popped first off the stack, then b, therefore b is the left term
    if (operator == "+") {
      result = b + a;
    }
    else if (operator == "-") {
      result = b - a;
    }
    else if (operator == "*") {
      result = b * a;
    }
    else if (operator == "/") {
      if (a == 0) {
        result = "Can't divide by 0";
      }
      else {
        result = b / a;
      }
    }
    else if (operator == "^") {
      result = Math.pow(b, a);
    }
  
    return result;
  }
  
  // Function to handle operations on math and trig functions requiring 1 parameter
  function unaryOp(operator, number) {
    
    let result = -Infinity;
  
    if (operator == "s") {
      result = Math.sin(number);
    }
    else if (operator == "c") {
      result = Math.cos(number);
    }
    else if (operator == "t") {
      result = Math.tan(number);
    }
    else if (operator == "o") {
      result = (1 / Math.tan(number));
    }
    else if (operator == "n") {
      result = Math.log(number);
    }
    else if (operator == "g") {
      result = Math.log10(number);
    }
  
    return result;
  }
  
  // Verifies if the token is a standard operator or ^ which requires 2 parameters
  function isBinary(token) {
    if (token == "+" || token == "-" || token == "*" || token == "/" || token == "^") {
      return true;
    }
  
    else {
      return false;
    }
  }
  
  // Verifies if the token is a math or trig function requiring one parameter
  function isUnary(token) {
    if (token == "n" || token == "g" || token == "s" || token == "c" || token == "t" || token == "o") {
      return true;
    } else {
      return false;
    }
  }