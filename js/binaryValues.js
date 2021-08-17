///  File: binaryValues.js
///
///  See Also: The README file for the full set of explainations.
///
///  Purpose:
///     To provide a class definition for binaryObject.
///     A binaryObject is componsed of the various elements to represent a binary number.
///     
///  Description:
///    
class binaryObject {

    // "this" components
    sign          = "";
    whole         = "";
    fractional    = "";
    exponentSign  = "";
    exponent      = "";

    _initialize_members() {
        this.sign         = "";
        this.whole        = "0";
        this.fractional     = "";
        this.exponentSign = "";
        this.exponent     = "";
    }

    // For a float32, only 23 fractionalBits are stored.  Hence, 23 is set to be the default
    // number for the maximum number of fractional bits to be stored.
    static #maxFractionalBits    = 23;


    // Associated Literal Strings 
    static radix()               { return "." ; }
    static e_notation()          { return " *^ " ; }

    // Regular Expressions Used for Parsing
    static sign_RE()             { return /[+-]?/ ; }
    static radix_RE()            { return /\./ ; }
    static e_notation_RE()       { return /[*][^]/ ; } 
    static punctuation_RE()      { return /[_, \t]/ ;} 
    static binaryValue_syntax()  { return /^([+-])?([01]*)(\.([01]+))?([*][^]([+-]?)([01]+))?$/ ; }
    static decimalValue_syntax() { return /^([+-])?([0-9]*)(\.([0-9]+))?(E([+-]?)([0-9]+))?$/ ; }

    static sequence_RE()         { return /^[01]+$/; }
    static zero_RE()             { return /^([0]+)(\.([0]+))?([*][^]([+-]?)([01]+))?$/ ; }
    static normalized_RE()       { return /^([+-])?(1)\.([01]+)[*][^]([+-]?)[01]+$/ ; }

 


    
    //////////////////////////////////////////////////////////////////////////////
    ///  Constructors:
    //          constructor( ) 
    //          constructor( number )
    //          constructor( binaryValue ) 
    //          constructor( { binaryComponents } )
    constructor(value) {

        switch (typeof value) {

            // constructor();
            case "undefined":

                return this._initialize_members();
                break;

            // constructor(value)
            case "number":
                var str = binaryObject.toBinaryValue(value)
                return this.set(str);
                break;

            // constructor(binaryValue);
            case "string":  

                return this.set(value);
                break;

            // constructor(binaryComponents)
            case "object":

                return this.setComponents(value);
                break;

            default:
                return NaN;
                break;
            }
        return NaN;
    }

    //////////////////////////////////////////////////////////////////////////////
    /////  GET METHODS
    get() { 
        var value;
        if ( ! this.isValid() ) return NaN;

        value  = this.sign + this.whole;
        value += (this.fractional != "") 
                    ? binaryObject.radix() + this.fractional 
                    : "";
        value += (this.exponent != "")  
                    ? binaryObject.e_notation() + this.exponentSign + this.exponent 
                    : "";

        return value;
    }

    getComponents() {
        return ( ! this.isValid() )
            ? NaN
            : { sign:         this.sign,
                whole:        this.whole, 
                fractional:   this.fractional, 
                exponentSign: this.exponentSign,
                exponent:     this.exponent
               }; 
    }

    getSign()         { return this.sign; }
    getWhole()        { return this.whole; }
    getfractional()   { return this.fractional; }
    getExponentSign() { return this.exponentSign; }
    getExponent()     { return this.exponent ; }


    //////////////////////////////////////////////////////////////////////////////
    /////  SET METHODS
    set(value) { 
        var components = binaryObject.toBinaryComponents(value);
        console.assert( (components != false), "Syntax_error: invalid binaryValue");

        this._initialize_members();
        this.setComponents(components);

        return this;
    }

    setComponents(components) {
        var status;

        status = this.isValid(components);
        console.assert( status, "Bad constructor Input"); 

        // Fill in missing values to make sure "this" is correct
        {
            // sign is set to '' if the value is equal to zero
            this.sign       = binaryObject.isZeroBinaryValue(components.whole + components.fractional) ? '' : components.sign;
            this.whole      = components.whole;

            // fractional part is set to '0' if there is an exponent and there is no fractional value
            if ( components.exponent != '' && components.fractional == '') {
                this.fractional = '0';
            } else {
                this.fractional   = components.fractional;
            }
            
            // exponentSign is set to '' if the exponent is zero
            this.exponentSign = (components.exponent).isZeroBinaryValue() ? '' : components.exponentSign;
            this.exponent     = components.exponent;
        }
        return this; 
    }

    isSign(ch) { return (ch == "+") || (ch == "-" || ch == ''); }
    setSign( ch )  {
        var sign = this.isSign(ch);
        console.assert( assert != false, "Invalid value for sign");

        this.sign = sign;
        return this;
    }

    setExponentSign( ch )  {
        var sign = this.isSign(ch);
        console.assert( assert != false, "Invalid value for sign for the exponent");

        this.exponentSign = sign;
        return this;
    }

    setWhole( str ) {
        var whole = this.toBinarySequence(str);
        console.assert ( whole == NaN, "Invalid value associated with whole part");

        this.whole = whole;
        return this;
    }

    setFractional (str) {
        var fractional = this.toBinarySequence(str);
        console.assert ( fractional == NaN, "Invalid value associated with the fractional part");

        this.fractional = fractional;
        return this;
    }

    setExponent (str) {
        var exponent = this.toBinarySequence(str);
        console.assert ( exponent == NaN, "Invalid value for exponent");

        this.exponent = exponent;
        return this;
    }

    //////////////////////////////////////////////////////////////////////////////
    format () {
        if ( ! this.isValid() ) {
            return "NaN";
        }
        if ( (this.exponent).length > 0 ) {
            return "exponential";
        }
        if ( (this.fractional).length > 0 ) {
            return "real";
        } 
        return "integer";
    }

    isValid( components )  {
        var status;

        if ( components == undefined ) {
            components = this;
        }
      // Check < see that all the individual components are syntactically correct
        status = this.isSign(components.sign) && binaryObject.isBinarySequence(components.whole);
        status = status && ( components.fractional == '' ) ? true : binaryObject.isBinarySequence(components.fractional);
        status = status && this.isSign(components.exponentSign);
        status = status && ( components.exponent == '' ) ? true : binaryObject.isBinarySequence(components.exponent);

        return status;
    }

    isZero() {
        var result = true;
        var format = this.format();

        switch (format) {
            case "exponential":
                result &= ( binaryObject.integerToBinarySequence(this.exponent) == 0);
                // merge;

            case "real":
                result &= ( binaryObject.integerToBinarySequence(this.fractional) == 0 )
                // merge;

            case "integer":
                result &= ( binaryObject.integerToBinarySequence(this.whole) == 0 )
                break;
            default:
                result = false;
        }
        return result;
    }

  
    isNormalized() {
        var result = false;

        if ( this.format() == "exponential" ) {
            if (binaryObject.integerToBinarySequence(this.whole) == 1) {
                return this;
            }
        }
        return result;
    }




    //////////////////////////////////////////////////////////////////////////////
    normalize() {
        //  ensure the binaryValue is in the form:  1.xxxx *^ xxx
        var updated = this.trim();
        updated = updated.toExponential();
        updated.whole = binaryObject.trimStartBinarySequence(updated.whole);
        return updated;
    }


    // this method should place the value in exponential form, but not normalized.
    // Same cases:
    ///    001000.00010  ->   001.000000010 ^* 1000   // not it has not been trimmed

    toExponential () {
        if (this.isZero()) {
            console.assert(true, "Exception: No valid scientific notation for zero");
            return 0;
        }

        var adjust;   // the amount we need to move the radix point
        adjust = this.whole.length - this.whole.search(/1/) - 1;
        
        if (binaryObject.isZeroBinaryValue(this.whole)) {
           // we have a special case where the binaryValue is:  0..0.xxxx *^ xxx
            adjust = - (this.fractional.search(/1/) + 1);
        }

        var updated = this.adjustExponent(adjust);
        return updated;
    }

    adjustExponent(num) {
        // Note that this method intentionally does not normalize the value of 'this'.
        // Moreover, the number of digits used to express any component does not decrease
        var updated = new binaryObject (this.getComponents());

        if (num == 0 ) return updated;

        var old_exponent  = 0;
        if (updated.exponent != '') {
            old_exponent = parseInt(updated.exponentSign + updated.exponent, 2);
        }

        var new_exponent  = old_exponent + num;
        if ( new_exponent < 0 ) {     
            updated.exponentSign = '-';
            updated.exponent = binaryObject.integerToBinarySequence(- new_exponent).padStart(updated.exponent.length, 0);
        }
        if ( new_exponent == 0 ) {     
            updated.exponentSign = '';
            updated.exponent = "0".padStart(updated.exponent.length, 0);
        }
        if ( new_exponent > 0 ) {     
            updated.exponentSign = '';   // Leave as an implicit positive
            updated.exponent = binaryObject.integerToBinarySequence(new_exponent).padStart(updated.exponent.length, 0);
        }

        if ( num > 0 ) {
            // num bits need to shift from the whole to the fractional
            // e.g.    num == 2,  
            //          111 0010     => 001 110010
            //          001 110010   => 000 01110010 
            //            0 110010  =>    0 00110010
            //
            var whole_cut_point = updated.whole.length - num;
            var whole_prefix    = updated.whole.substring(0, whole_cut_point).padStart(updated.whole.length, '0');
            var whole_suffix    = updated.whole.substring(whole_cut_point).padStart(num, '0');

            updated.whole       = whole_prefix;
            updated.fractional  = whole_suffix + updated.fractional;
        } else {
            // num bits need to shift from the fractional to the whole
            // e.g., num == -2,  
            //          111 0010     => 11100 1000
            //          001 110010   => 00111 100100 
            //            0 110010  =>    011 110010
            var fractional_cut_point = - num;
            var fractional_prefix    = updated.fractional.substring(0, fractional_cut_point).padEnd(num, '0');
            var fractional_suffix    = updated.fractional.substring(fractional_cut_point).padEnd(updated.fractional.length, '0');

            updated.whole            = updated.whole + fractional_prefix;
            updated.fractional       = fractional_suffix;
        }
        return updated;
    }

    flatten() { 
        var updated = new binaryObject( this.getComponents() );

        // To be flatten, this object must be of the exponential format
        if (this.format() == "exponential") {
            if ( this.exponentSign == '-' ) {
                updated = this.adjustExponent( parseInt(this.exponent, 2)); 
            } else {
                updated = this.adjustExponent(- parseInt(this.exponent, 2)); 
            }
            updated.exponentSign = '';
            updated.exponent     = '';
        } 

        return updated;
    }
    
    demote() {
        var updated = this.flatten();

        if (binaryObject.trimEndBinarySequence(updated.getfractional()) == '' ) {
            updated.fractional = '';
        }
        return updated;
    }

    trim () {
        return new binaryObject( {  sign:         this.sign,
                                    whole:        binaryObject.trimStartBinarySequence(this.whole),
                                    fractional:   binaryObject.trimEndBinarySequence(this.fractional),
                                    exponentSign: this.exponentSign,
                                    exponent:     binaryObject.trimStartBinarySequence(this.exponent)
                                } );
    }

    ///  000bbb000   -> bbb000
    static trimStartBinarySequence (str) {
        console.assert(binaryObject.isBinarySequence(str), "string", "Expected binary sequence");
        var index = str.indexOf('1');

        return str.substring(index);
    }

    ///  000bbb000   -> 000bbb
    static trimEndBinarySequence ( str ) {
        console.assert(binaryObject.isBinarySequence(str), "string", "Expected binary sequence");
        var index = str.lastIndexOf('1');

        return str.substring(0, index+1);
    }


    toFixed(fractionalBits=0) {   // sets the number of fractional digits 
        var updated = new binaryObject(this).flatten();

        updated.fractional = (updated.fractional).padEnd(fractionalBits, "0");
        if (fractionalBits <= updated.fractional.length) {
            updated.fractional = (updated.fractional).substring(0, fractionalBits);
        }
        return updated;
    }

    toPrecision(totalBits) {     // sets the total number of binary digits
        if (totalBits == undefined) {
            return this;
        }
        console.assert(totalBits > 0, "Expected positive integer" );
        // Number.toPrecision() will return the orginal number, which is the max....
        // Number.toPrecision(x) will return the orginal number padded to be of length 10

        var updated = new binaryObject( this.getComponents() );
        // Method:
        //  - join the whole and fractional parts to form one string padded to totalBits
        //  - truncate the string aftet the last bit
        //  - place the whole and the fractional parts back together
        //  - adjust exponent if required

        var str = (updated.whole + updated.fractional).padEnd(totalBits, '0');
        var first_1  = str.indexOf('1') 
        var last_bit = first_1 + totalBits;      

        if (last_bit < totalBits ) {
            // then there were no ones in the total bits
            // so zero will be the answer
            console.assert(false); str = str.substring(0, totalBits);
        }

        str = str.substring(0,last_bit);
      
        updated.whole      = str.substring(0, this.whole.length);
        updated.fractional = str.substring(this.whole.length);

        if (updated.whole.length < this.whole.length ) {
            // we lost precision in the whole portion.. place in expon form
            var new_exponent = last_bit - first_1;
            var old_exponent = parseInt(updated.exponent, 2);

            if ( updated.exponentSign == '-' ) {
                new_exponent = new_exponent - old_exponent;
            } else {
                new_exponent = new_exponent + old_exponent;

            }
            if (new_exponent >=0) {
                updated.exponentSign = '';
            } else {
                updated.exponentSign = '-';
                new_exponent = - new_exponent;
            }

            updated.exponent   = binaryObject.integerToBinarySequence(new_exponent)
            updated.fractional = updated.whole.substring(first_1 + 1);
            updated.whole = '1';
        }

       return updated;
   }



////////////////////////////////////////////////////////////////////////////////////
///  Conversion Prototypes

    // binaryValue -> Boolean
    static isBinaryValue(val) {
        var answer = binaryObject.toBinaryComponents(val);
        return (answer != NaN) ? true : false;
    }
    
    // Number -> binaryValue
    static toBinaryValue (val, fractionalBits) {
        val = Number(val);
        console.assert( ! isNaN(val), "Expected a Number");
    
        var isNegative = false;
        if ( val < 0 ) {
            isNegative = true;
            val = - val;
        }

        var whole  = Math.floor(val);
        var answer = binaryObject.integerToBinarySequence(whole);

        if (val != whole ) {
            answer = answer + "." + binaryObject.properFractionToBinarySequence(val - whole, fractionalBits)
        }
        return (isNegative) ? '-' + answer : answer;
    }

    // String -> Boolean
    static isBinarySequence(str) {
      console.assert(typeof str == "string", "Expected string");
      var str = str.split(binaryObject.punctuation_RE()).join("");
      return (str.match(binaryObject.sequence_RE())) ? true : false; 
    }

    // String -> BinaryValue
    static toBinarySequence(str) {
        console.assert(typeof str == "string", "Expected string");
        var str = str.split(binaryObject.punctuation_RE()).join("");
    }

    // BinaryValue -> String
    static isZeroBinaryValue(str) {
        console.assert(typeof str == "string", "Expected string");
        var str = str.split(binaryObject.punctuation_RE()).join("");
        return (str.match(binaryObject.zero_RE())) ? true : false;
    }

    // BinaryValue -> Boolean
    static isNormalizedBinaryValue(str) {
        console.assert(typeof str == "string", "Expected string");
        var matched = str.match(binaryObject.normalized_RE());
        return (matched) ? true : false;
    }

    //////////////////////////////////////////////////////////////////////////////

    // Number -> { sign: '', whole: 'bbb', fraction: 'bbb', exponentSign: '', exponent: 'bbb'}
    static toBinaryComponents(str) {
        console.assert(typeof str == "string", "Expected string");
        // Parses the str as if was a binary value.
        // If it is a binaryValue, returns a binaryComponents
        // otherwise, returns false

        var str = str.split(binaryObject.punctuation_RE()).join("");
        var matched = str.match( binaryObject.binaryValue_syntax());

        if (! matched ) return NaN;

        var answer = { sign:         (matched[1] == undefined) ? ''  : matched[1], 
                       whole:        (matched[2] == undefined) ? '0' : matched[2], 
                       //             matched[3] == "."
                       fractional:   (matched[4] == undefined) ? ''  : matched[4], 
                       //             matched[5] = " *^ "
                       exponentSign: (matched[6] == undefined) ? ''  : matched[6],
                       exponent:     (matched[7] == undefined) ? ''  : matched[7]
                     };
        return answer;
    }

    // Number -> { sign: '', whole: 'dddd', fraction: 'ddd', exponentSign: '', exponent: 'ddd'}
    static toDecimalComponents(str) {
        str = (typeof str == "number") ? String(str) : str;
        console.assert(typeof str == "string", "Expected string");

        // Parses the str as if was an integer value.
        // If it is a binaryValue returns an object containing the components
        // otherwise, it returns false

      var str = str.split(binaryObject.punctuation_RE()).join("");
      var matched = str.match(binaryObject.decimalValue_syntax());

      if (! matched ) {
        return NaN;
      }

      var answer = { sign:         (matched[1] == undefined) ? ''  : matched[1], 
                     whole:        (matched[2] == undefined) ? '0' : matched[2], 
                     //             matched[3] == "."
                     fractional:   (matched[4] == undefined) ? ''  : matched[4], 
                     //             matched[5] = "E"
                     exponentSign: (matched[6] == undefined) ? ''  : matched[6],
                     exponent:     (matched[7] == undefined) ? ''  : matched[7]
                   };
        return answer;
    }


    // Number -> binaryFraction: ".bbbbbb"
    static properFractionToBinaryFraction (val, fractionalBits) {
        val = Number(val);
        console.assert( ! isNaN(val) && (-1 < val) && (val < 1),
            "Expected a proper fraction: -1.0 < value < 1.0");
    
        var isNegative = false;
        if ( val < 0 ) {
            isNegative = true;
            val = - val;
        }
        var answer = '.' + binaryObject.properFractionToBinarySequence(val, fractionalBits);

        return (isNegative) ? '-' + answer : answer;
    }

    // Number ->  binaryFraction: ".bbbbb"
    static fractionalPartToBinaryFraction (val, fractionalBits) {
        val = Number(val);
        console.assert( ! isNaN(val) && Number.isInteger(val) && val > 1, "Expected a positive integer");
    
        var answer = '.' + binaryObject.fractionalPartToBinarySequence(val, fractionalBits);
        return answer;
    }


    //  binaryValue -> String(Number)
    static numberFromBinaryValue(str) {
        var obj = new binaryObject(str);
        console.assert(obj != NaN, "Expected a binaryValue");
        
        obj = obj.demote();

        var answer = obj.sign + binaryObject.integerFromBinarySequence(obj.whole);
        if (! obj.fractional == '') {
            answer = answer + "." + binaryObject.fractionalPartFromBinarySequence(obj.fractional);
        }
        return answer;
    }


    // binaryValue -> String(Number):  ->  "d.ddddEdd"
    static exponentialFromBinaryValue(str) {
        var value = binaryObject.numberFromBinaryValue(str);

        if (value == 0) {
            console.assert(true, "Exception: No valid scientific notation for zero");
            return 0;
        }

        var components = binaryObject.toDecimalComponents(String(value));
        var answer;
        {
            // Place into normalized scientific noation.
            var sign = components.sign;
            var whole;
            var fractional;
            var exponentSign = '';
            var exponent;
            if (Math.abs(value) >= 1) {
                whole        = components.whole.charAt(0);
                fractional   = components.whole.substring(1) + components.fractional;
                exponentSign = '';
                exponent     = components.whole.length - 1;
            } else {
                var index    = components.fractional.search(/[^0]/);
                whole        = components.fractional.charAt(index);
                fractional   = components.fractional.substring(index + 1);
                exponentSign = '-';
                exponent     = - index;
            }
            answer = sign + whole + '.' + fractional + 'E' + exponentSign + exponent;
        }
        return answer;
    }

    // integer -> binarySequence:  ddd -> "bbbbbbb" 
    static integerToBinarySequence (val) {
        val = Number(val);
        console.assert(Number.isInteger(val) && val >= 0, "Expected Positive Integer:")

        if (val == 0) {
            return '0';
        }

        // Method: Successively divide by 2, remainder determines next binary digit
        var current = val; 
        var answer  = "";    
    
        while (current > 0) {
            var quotient = Math.floor(current / 2);
            var remainder = current % 2;
    
            if ( remainder == 1 ) {
              answer = '1' + answer
            } else {
              answer = '0' + answer
            }
            current = quotient;
        }
        return answer;
    }

    // 0.dddd -> "bbbbbbb"
    static properFractionToBinarySequence (val, fractionalBits) {
        val = Number(val);
        console.assert( ! isNaN(val) && (0 < val) && (val < 1), "Expected positive proper fraction: value < 1.0");

        var limit = 1;
        return binaryObject.numberToBinaryFraction(val, limit, fractionalBits)

    }

    // dddd -> "bbbbbbb"
    static fractionalPartToBinarySequence (val, fractionalBits) {
        val = Number(val);
        console.assert( ! isNaN(val) && (1 < val), "Expected positive integer: value > 1");

        var limit = 10 ** String(val).length;
        return binaryObject.numberToBinaryFraction(val, limit, fractionalBits)
    }

    // dddd, 10000 -> "bbbbbbb"   or  .dddd, 1 -> "bbbbbb"
    static numberToBinaryFraction(val, limit, fractionalBits) {
        console.assert( limit > val, "Expected value to be greater to limit! E.g., {val=.75, limit=1} {val=75, limit=100}");

        // fractionalBits:
        //      case: undefined, provide a only signficate bits upto the #maxFranctionalBits
        //      case: N,  provide exactly that number of bits
        var maxFractionalBits = (fractionalBits == undefined) ? binaryObject.#maxFractionalBits : fractionalBits;

        // Method: Successively multiply by 2, next binary digit is set if value is greater than 1
        var current = val;                      // the current number used to converge
        var answer = "";                        // the computed binary number;
        var i;
        for ( i = 1; current != 0; i ++ )   {
            if (i > maxFractionalBits ) {
                break;
            }
            current = current * 2;
            if (current >= limit ) {
                answer = answer + '1';
                current = current - limit; 
            } else {
               answer = answer + '0';
               current = current;
            }
        }
        if (current == 0) {
            // We have the exact number.
            // but pad if the lenght is less then what was called for.
            answer = answer.padEnd(fractionalBits, '0');
        }
        return answer; 
    }


    // ddd -> "bbbbb"
    static integerFromBinarySequence(str, method=1) {
        console.assert(str.isBinarySequence(), "Expected Binary Sequence:");
    
        // Method #1:  Reading Left to Right, Successively multiply x2 and add if 1
        //  "1011" :  "101"    + "1" 
        //               5 * 2 + "1" == 11
        if (method == 1) {
            var sum = 0;
            var place = 0;
    
            while (place < str.length) {
                sum = sum * 2 + ( (str.charAt(place) == '1') ? 1 : 0 );
                place++;
            }
            return String(sum);
        }
    
        // Method #2:  Reading Right to Left, Adding expanded notation
        //   "1011" ==>  (1 * 2^3) + (0 * 2^2) + (1 * 2^1) + (1 * 2^0)
        if (method == 2) {
            var sum = 0; 
            var place = str.length - 1;
            var place_value = 1;
    
            while (index >= 0) {
                sum += (str.charAt(place) == 1) ? place_value: 0;
                place--;
                place_value = place_value * 2;
    
             }
            return String(sum);
        }
        console.assert( true, "Invalid method specified");
        return NaN;
    }


    // "bbbbb" -> ".ddddd"
    static properFractionFromBinarySequence(str, method=1) {
        console.assert(binaryObject.isBinarySequence(str), "Expected Binary Sequence:")

        var sequence = binaryObject.fractionalPartFromBinarySequence(str, method);
        return "." + sequence;
    }


    // "bbbbb" -> "ddd"
    static fractionalPartFromBinarySequence(str, method=1) {
        console.assert(binaryObject.isBinarySequence(str), "Expected Binary Sequence:")

        // Method #1:  Reading Right to Left, Successively add if 1 and divide /2
        //  "1011" :  "101"    + "1" 
        //               5 * 2 + "1" == 11
        if (method == 1) {
            var sum = 0;
            var index = str.length - 1;
    
            while (index >=0) {
                sum = sum / 2;
                sum += (str.charAt(index) == '1' ) ? 1 : 0;
                index--;
            }
            sum = sum / 2;
            return String(sum).substring(2);  // return a string without the leading zero nor radix point
        }
    
        // Method 2: Reading Left to Right, Adding expanded notation
        //   "0.1011" ==>  0 + (1 * 2^-1) + (0 * 2^-2) + (1 * 2^-3) + (1 * 2^-4)
        if (method == 2) {
            var sum = 0; 
            var place = 0;  
            var place_value = 1/2;
    
            while (place >= 0) {
                sum += (str.charAt(place) == 1) ? place_value: 0;
                place++;
                place_value = place_value / 2;
    
             }
            return String(sum).substring(2);  // return a string without the leading zero nor radix point
        }
        console.assert( true, "Invalid method specified");
        return NaN;
    }


}

