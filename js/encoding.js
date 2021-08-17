///  Encoding.js

    function from_ASCII ( text ) {
        // Input is presumed to be a valid string of zeros (0) and ones (1) that is an encoding of an ASCII string.
        // Input is also allowed to have whitespace for the purpose of visual formating
        // I.e., the input conforms to the following regular expression: [ 01\t\n]*
    
       var binaryValue;   //  A string of binary text, i.e., of just zeros (0) and ones (1).
       var chunks;        //  An array of binary text, in which each element is an 8 bit chunk
       var integers;      //  An array of integers
       var characters;    //  An array of ascii characters
       var str;           //  A string of ascii characters
    
        
        binaryValue = text().split(/[ \t\n]/).join("");             // 1. Remove visual formating characters
        chunks      = b_str.match(/[01]{8}/g);                      // 2. Chuck the string into groups of 8 binary digits
        integers    = chunks.map(element => parseInt(element,2));   // 3. Convert each chunk to an integer
        characters  = integers.map(e => String.fromCharCode(e));    // 4. Convert each integer to a ASCII character
        str         = characters.join("");                          // 5. Join characters into an ASCII string
        return str;                                                 // 6. Return the final ASCII string 
    }
    


    