// following will be string prototypes

String.prototype.toBin    = function ()  { return numberConvert(this, 2)  } ;
String.prototype.toOct    = function ()  { return numberConvert(str, 8)  } ;
String.prototype.toDec    = function ()  { return numberConvert(str, 10) } ;
String.prototype.toHex    = function ()  { return numberConvert(str, 16) } ;
 
String.prototype.nibbles  = function ()  { return numberSeparate(str, 4) };
String.prototype.halfs    = function ()  { return numberSeparate(str, 16) };
String.prototype.words    = function ()  { return numberSeparate(str, 32) };
String.prototype.doubles  = function ()  { return numberSeparate(str, 64) };
String.prototype.separate = function (N) { return numberSeparate(str, N) };

// add string prototypes for the following:

String.prototype.encodeBase64 = function () { return numberEncodeBase64(this) };
String.prototype.decodeBase64 = function () { return numberDecodeBase64(this) };
String.prototype.encodeASCII  = function () { return numberEncodeASCII(this) };
String.prototype.decodeASCII  = function () { return numberDecodeASCII(this) };
String.prototype.encodeUTF8   = function () { return numberEncodeUTF8(this) };
String.prototype.decodeUTF8   = function () { return numberDecodeUTF8(this) };

String.prototype.chop         = function (N) { return numberChop(this, N) };
Array.prototype.join          = function () { return numberJoin(this,N) };

function numberChop(str, N) {
   // Works like numberSeparate puts pieces into array elements
   var components = numberSlit(str);
   var base = components[0]; 
   var digits = components[1];
   var arr ;  // an array of numbers

   arr = digitsSeparate(digits, N).split(' ');
   arr = arr.map(element => base + numberPrefix + element);
   return arr;

   return { base: base + numberPrefix, list: arr };
}

function numberJoin(arr, base = 2) {
   // Works like Array.join
   // Assumed base is 2;

   arr = arr.map(element => numberConvert(base))
   arr = arr.map(element => replace(base + numberPrefix, ''));

   return base + numberPrefix + arr.join(' ');
}


const numberPrefix = "# ";

function numberSlit(str) {
   return str.trim().split('#');
}

/////
function numberConvert(str, base) {
   var components = numberSlit(str);
   var from_base = components[0];  

   var digits = digitsSqueeze(str);

   if (from_base != base) {
      digits = Number.parseInt(digits, from_base).toString(base);  
   }
  
   return base + numberPrefix + digits;
}

function numberOperation(operation, str, num) {
  // Remove formating spaces.
   var components = numberSlit(str);
   var base = components[0];  
   var digits = components[1];

   digits = operation(digits, num);

   return base + "# " + digits;
}


function numberTrim(str) {
   // Remove superfluous leading zeros (0)
   return numberOperation(digitsTrim, str);
}

function numberPad(str, N) {
   return numberOperation(digitsPad, str, N);
}

function numberSqueeze(str) {
   return numberOperation(digitsSqueeze, str);
}

function numberSeparate(str, N) {
   return numberOperation(digitsSeparate, str, N);
}

////////////////////////////
function digitsTrim(str) {
   // Remove superfluous leading zeros (0)
   var leadingZero_RE = /^[ 0]+/;

   return str.trim().replace(/^[ 0]+/, '');
}

function digitsPad(str, N) {
   // Add superfluous leading zeros (0) to ensure a length >= N

   var needed = N - str.match(/\d/g).length;
   var num = (needed > 0 )
           ? str.padStart(needed, '0')
           : str;

   return num;
}

function digitsSqueeze(str) {
   // Remove formating spaces.
   return str.replace(/ */g, '');
}

function digitsSeparate(str, N) {
   str = str.digitsSqueeze();

   extra = (num.length % N);
   if (extra > 0) {
      str.padStart((N - extra), '0');
   }

   var group_str = '\d{'+N+'}';
   var group_re = new RegExp(group_str, 'g')

   return str.split(group_re).join(' ');
}


var testCases = [
   // Positive Testing:
   
   // Testing for various binaryValues
      { func: '"2# 101010".toDec()',        result: "10# 42" },
      { func: '"2# 101010".toOct()',        result: "10# 52" },
      { func: '"2# 101010".toHex()',        result: "10# 2A" },
      { func: '"10# 42".toBin()',           result: "2# 101010" },
      { func: '"8# 52".toBin()',            result: "2# 101010" },
      { func: '"16# 42".toBin()',           result: "2# 101010" },
   

      { func: '"2# 010010".pad(8)',                    result: "2# 00010010" },
      { func: '"2# 01 0010".pad(8)',                   result: "2# 0001 0010" },

      { func: '"2# 011110000111100001111".separate(6)', result: "#2 000011 110000 111100 001111" },
      { func: '"2# 000011 110000 111100 001111".squeeze()',   result: true },

      { func: '"2# 011110000111100001111".nibbles()',   result: "#2 0000 1111 0000 1111 0000 1111" },
      { func: '"2# 011110000111100001111".bytes()',     result: "#2 00001111 00001111 00001111" },
      { func: '"2# 011110000111100001111".halfs()',     result: "#2 0000000000001111 0000111100001111" },
      { func: '"2# 011110000111100001111".words()',    
                result: "#2 00000000000000000000000000000000 00000000000011110000111100001111" },
      { func: '"2# 011110000111100001111".doubles()',    
                result: "#2 0000000000000000000000000000000000000000000011110000111100001111" },

      { func: '"10# 1111 2222 3333 4444 5555".chop(4)',  result: [ "10# 1111", "10# 2222", "10# 333", "10# 4444", "10# 5555"] },
      { func: '"10# 1111 2222 3333 4444 5555".chop(3)',  result: [ "10# 001", "10# 111", "10# 222", "10# 233", "10# 344", "10# 445", "10# 555" ] },

      { func: '[ "16# 2A", "10# 42", "8# 52", "2# 101010" ].numberJoin(2)',
                                                         result: "2# 101010101010101010101010"},


]

function testSuite ( testCase ) {
    var outcome = eval ( testCase.func );
    var stringify = JSON.stringify(outcome);

    if (stringify == JSON.stringify (testCase.result)) {
        console.log(   "Success!" + "\t\t" + testCase.func + "  ==  " + testCase.result );
    } else {
        console.error( "Failure!" + "\t\t" + testCase.func );
        console.error( "\tExpected: " + testCase.result );
        console.error( "\tOutCome:  " + outcome );
        console.error();
    }
 }
 
