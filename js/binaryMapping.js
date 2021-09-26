// following will be string prototypes

let toBin    = function (str) { return numberConvert(str, 2)  } ;
let toOct    = function (str) { return numberConvert(str, 8)  } ;
let toDec    = function (str) { return numberConvert(str, 10) } ;
let toHex    = function (str) { return numberConvert(str, 16) } ;

let nibbles  = function (str) { return numberSeparate(str, 4) };
let halfs    = function (str) { return numberSeparate(str, 16) };
let words    = function (str) { return numberSeparate(str, 32) };
let doubles  = function (str) { return numberSeparate(str, 64) };
let separate = function (str, N) { return numberSeparate(str, N) };

// add string prototypes for the following:

let encodeBase64 = function () {};
let decodeBase64 = function () {};
let encodeASCII = function () {};
let decodeASCII = function () {};
let encodeUTF8  = function () {};
let decodeUTF8  = function () {};

let chop = function (N) {};
let join = function () {};
let splice = function () {};

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

fuction numberJoin(arr, base = 2) {
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

   var digits = str.digitsSqueeze();

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
