# Name: binaryValues.js

# Synopsis
A Javascript library that provides support for binary values.  These values are represented as either
   * an ASCII string with the general syntax of:  [+-]? [01]* "." [01]* "\*^" [+-]? [01]*
   * an object with the following fields:  { sign, whole, fractional, exponentSign, exponent }

Example binary values (represented as string) with their corresponding decimal value:
| binary Value   | Decimal Value |Description  |
| --------------:|--------------:|:-------------|
| "1001"         | 9 | Postive Integer |
| "-1101"        | -13 | Negative Integer |
| "-1101.11"     | -13.75 | Negative Real Number |
| "0.101"        | 0.65 | Real Number (in proper form) |
| ".101"         | 0.625 | Proper Fraction |
| "10010.1 \*^ -10" | 9.25 | Exponential Form |
| "1.00101 \*^ 11" | 9.25 | Normalized Exponential Form |


### Table of Contents
[Description](#description)
[Terminology](#standard-terminology)
[Strings API](#strings-api)
[Math API](#extensions-to-the-math-api)
[BinaryObject API](#binaryobject-api)

# Description
Javascript supports binary literals. The support for binary values are limited to these 
binary literals. Hence, literals are just a represention of a number.  Such literals conform 
to the following syntax:
```
[+-]? 0b [01]+ ( '.' [01]+)?
```
There is limited support for the manipulation of these binary numbers from two major perspectives:
  1. the individual bit values are opaque (hidden)
  1. visual manipulation of these bits is not possible

With binaryValues.js, we expose the individual bits so that basic operations 
on these bits can be seen and so that we can construct other operations that 
perform bit-wise manipulations.  In short, binaryValues are just a restricted
set of strings.

These strings conform to the following syntax:
          [+-]? [01]* ( '.' [01]+ ( ^* [+-]? [01]+ )? )?

For visual clarity, an underscore can be used within a binary value.

# Goal
Our primary goal is to provide a set of operations that manipulate binary values that can be used
within other web applications that help to explain and to demostrate various binary encoding methods. 
For example, a web page can be developed that can demostrate the process to encode a real number into 
[IEEE binary32](https://en.wikipedia.org/wiki/Single-precision_floating-point_format).  

Consider the operational steps to to perfrom this encoding:

1. Enter a decimal value
```
D = 5.75;
```
2. Parse the decimal value into its constituent components
```
DC = (5.75).toDecimalComponents();  
  // DC is defined to be: { sign: '', whole: "5", fractional: "75", exponentSign: '', exponent: '' }
```
3. Convert whole part to binary, and the fractional part to binary, and concatenate the strings
```
B = (5).integerToBinarySequence() + '.' + (75).fractionalPartoToBinarySequence(4);
  //  B is defined to be: "101.1100", which is equivalent to: "101" + "." + "1100"
```
4. Represent the value of _B_ within normalized exponential form
```
E = "101.1100".toNormalizeBinaryValue();
  // C is defined to be: "1.011100 *^ 10"
```
5. Identify the individual components of the binaryValue:
```
BC = "1.011100 *^ 10".toBinaryComponents();
  // BC is defined to be: { sign: '', whole: "1", fractional: "011100", exponentSign: '', exponent: '10' }
```

Now, we are in position to encode the decimal number, 5.75, into float32.  Recall the encoding of binary32 is as follows:
  * A 32 bit quanity that is made up of three components
    1.  s: Sign bit:  1 bit
    2.  e: Exponent width: 8 bits, stored with a bias of 127
    3.  f: Significand precision: 24 bits (23 explictly stored)

Using the computed value of the normalized binary value, as defined by BC, we can determine the equivalent binary32 value via:
```
   s = (BC.sign == '-') ? 1 : 0;
   e = binary_add( BC.exponent, "0111111");    // Note that the function binary_add is not (currently) provided.
   f = BC.fractional;
```
---
## Implementation Details

### <a name=terminology></a>Standard Terminology
  * asciiString:       an array of bytes, with each byte encoding an ascii value
  * binaryString:      a sequence of bytes, which may encode all different types of binary data 
  * binarySequence:    a sequence of ones and zeros 
  * properFraction:	   a positive number, say f, that meets the condition 0 < f < 1.
  *	fractionalPart:    the part of the real number that is to the right of the radix point

### Terminology within this documentation
  * binarySequence:    a non-empty ascii string composed of solely binary digits. Addition punctuation
                       characters ([_, \t]) may be provided for visual clarity.

  * binaryValue:      a string that is either a binaryInteger, binaryReal, or binaryExponential

  * binaryInteger:     a value with the syntax of: [+-]? binarySequence 
  * binaryReal:        a value with the syntax of: binaryInteger '.' binarySequence
  * binaryFraction:    a value with the syntax of: '.' binarySequence     						// note there is no leading zero
  * binaryExponential: a value with the syntax of: binaryReal '\*^' [+-]? binaryInteger  

  * binaryComponents:  an object containing the various components of a binaryValue
     ```
     {
         sign          : [+-]?            // empty string denotes non-negative
         whole         : binarySequence?  // empty string denotes fractional value 
         fractional    : binarySequence?  // empty string denotes no value
         exponentSign  : [+-]?            // empty string denotes non-negative
         exponent      : binarySequence?  // empty string denotes no value
     }
     ```
  * decimalComponents: an object conatinain the various components of a decimalValue, mirroring the structure of binaryComponents

## API: Application Programmer's Interface
The binaryValues library defines an object "binaryObject" that encapulates all of the operations performed on binaryValues.  These binaryValues can be be represented either via a string or as binayComponents.  As such the library provides a number of prototype definitions to extend "Strings."  The library also defines a number of protype defintions to extend "Numbers".  An operation that results in a invalid binaryValue returns _NaN_.

### Extentions to the _String_ API

| Return Value | Method Call | Description|
|--------------|-------------|------------|
|Boolean       | "binaryValue".isBinaryValue()                        | Determines if the String is a valid BinaryValue.   |
|Boolean       | "binaryValue".isBinarySequence()                     | Determines if the String is a valid BinarySequence. |
|Boolean       | "binaryValue".isZeroBinaryValue() 		                | Determines if the String represents BinaryValue with the value of zero (0). |
|Boolean       | "binaryValue".isNormalizedBinaryValue()              | Determines if the String is a normalized binaryValue (e.g, 1.bbbb ^* bbb)
|              |                                                      | |                                                                               
|binaryValue   | "binaryValue".normalizeBinaryValue()                 | Converts the String to a normalized binaryValue.
|binaryValue   | "binaryValue".toExponentialBinaryValue()             | Converts the String to a exponential form, which may not be trimmed appropriately. |
|binaryValue   | "binaryValue".adjustExponentBinaryValue(Number)      | Changes the value of the exponent by a delta. |
|              |                                                      | |                                                                              
|binaryValue   | "binaryValue".flattenBinaryValue()                   | Converts a binaryValue in exponetial form to a binaryReal |
|binaryValue   | "binaryValue".demoteBinaryValue()                    | Converts representation of a binaryValue to the simplies valid form: binaryExponential -> binaryReal -> binaryInteger. |
|              |                                                      | |                                                                               
|binaryValue   | "binaryValue".trimBinaryValue()                      | Removes superfluous leading and trailing zeros (0) from all components of a BinaryValue. |
|binaryValue   | "binaryValue".padBinaryValue(Number, Number, Number) | Adds superfluous zeros (0) to appropriate pad the whole, fractional, and exponent part of a binaryValue |
||
|binaryValue   | "binaryValue".trimStartBinarySequence()              | Removes the leading zeros (0) of a binarySequence. |
|binaryValue   | "binaryValue".trimEndBinarySequence()                | Removes the trailing zeros (0) of a binarySequence. |
||
|binaryValue   | "binaryValue".padStartBinarySequence(Number)         | Adds superflouous zeros (0) to the begining of a binarySequence. |
|binaryValue   | "binaryValue".padEndBinarySequence(Number)           | Adds superflouous zeros (0) to the end of a binarySequence. |
|              |                                                      |                                                                                
|binaryValue   | "binaryValue".toFixedBinaryValue(fractionalBits=23)  | Sets the number of fractional digits. |
|binaryValue   | "binaryValue".toPrecisionBinaryValue(totalBits=24)   | Sets the total number of primary (nonsuperfluous) binary digits. |
||
|binaryComponents | "binaryValue".toBinaryComponents()                | Provides the binaryComponent ===representation of the binaryValue. |


### Extensions to the _Math_ API
Numeric values can be represented as either a Number or String type. As such, extentions to both the _Math_ and _String_ API are provided. For example, the .toBinaryValue method is associated with both the _Math_ and _String_ API. As such, each of the following javascript statements are valid.

```
var x = (42).toBinaryValue();
var y = "42".toBinaryValue();

var n = 42;
var s = 42;

var N = n.toBinaryValue();
var S = s.toBinaryValue();
```

| Results | Method Call | Description |
|---------|-------------|-------------|
| binaryValue          | (Number).toBinaryValue(fractionalBits)                   | Converts a number to a binaryValue.   | 
| binarySequence       | (Number).integerToBinarySequence()                       | Converts an integer to a binaryValue. | 
|||
| binaryFraction       | (Number).properFractionToBinaryFraction(fractionalBits)  | Converts a proper fraction to binaryFraction. |
| binarySequence       | (Number).properFractionToBinarySequence(fractionalBits)  | Converts a proper fraction to binarySequence. |
|||
| binaryFraction       | (Number).fractionalPartToBinaryFraction(fractionalBits)  | Converts the fractional part of a Number to a binaryFraction. |
| binarySequence       | (Number).fractionalPartToBinarySequence(fractionalBits)  | Converts the fractional part of a Number to a binarySequence. |
|||                                         
| Number  		         | "binaryValue".numberFromBinaryValue()			       	      | Presents a binaryValue as a Number (within a string form).  |
| String	    	       | "binaryValue".exponentialFromBinaryValue()				        | Presents a binaryValue as an exponential Number.            |
|||
| 0 <= integer         | "binarySequence".integerFromBinarySequence()			        | Converts a binaryInteger to an integer. |
| 0 <= real < 1        | "binarySequence".properFractionFromBinarySequence()      | Converts the fractional part to a proper fraction. |
| 0 <= real < 1        | "binarySequence".fractionalPartFromBinarySequence()      | Converts the fractional part to a fractional part. |
| decimalComponents    | (Number).toDecimalComponents()                           | Provides the binaryComponent representation of the Number. |
|||
| binarySequence       | (Number).numberToBinaryFraction(limit, fractionalBits)   | Calculate the binary representation of the fraction component of a number |


  * Results are numbers within their string representational form.
  * Results are always presented in their simpliest form.
  * Whereas the _(Number).toString()_ method can be used to a number to a binaryValue, we still provide specific methods to perform various operations.  The include source code can be used to demostrative purposes, etc.

### BinaryObject API
BinaryValues can be stored and manipulated in via a object.  The name of the object class is BinaryObject. A program can choose to use this object directly.  The public methods are as follows:

| Return Value | Method Call | Description / Example |
|--------------|-------------|-----------------------|
|Constructors:}}
|    binaryObject       | new binaryObject()                               | Creates a new binaryObject with a value of zero.   |
|    binaryObject       | new binaryObject(Number)                         | X = new binaryObject ( 5.3 );    |
|    binaryObject       | new binaryObject(binaryValue)                    | X = new binaryObject ("- 101_101.111 *^ - 0111")   |
|    binaryObject       | new binaryObject(binaryComponents)               | X = new binaryObject ( { _fields_ } )    |
|||
|Get Methods:||
|    binaryValue        | binaryObject.get()                               | Returns the string representation of the binaryValue |
|    binaryComponents   | binaryObject.getComponents()                     |      |
|    char               | binaryObject.getSign()                           |      |
|    binarySequence     | binaryObject.getWhole()                          |      |
|    binarySequence     | binaryObject.getFractional()                     |      |
|    char               | binaryObject.getExponentSign()                   |      |
|    binarySequence     | binaryObject.getExponent()                       |      |
|||
|Set Methods:||
|    binaryObject       | binaryObject.set( binaryValue )                  |      |
|    binaryObject       | binaryObject.setComponents( binaryComponents )   |      |
|    binaryObject       | binaryObject.setSign( [ +-] )                    |      |
|    binaryObject       | binaryObject.setWhole( binarySequence )          |      |
|    binaryObject       | binaryObject.setFractional( binarySequence )     |      |
|    binaryObject       | binaryObject.setExponentSign( [ +-] )            |      |
|    binaryObject       | binaryObject.setExponent( binarySequence )       |      |
|||
|General Methods: ||
|	 String             | binaryObject.format() 				    | Returns the type/format of binaryValue: {"integer", "real", "exponential", "NaN"}  |
|    Boolean            | binaryObject.isValid()                    | Returns true if the binaryValue is valid, i.e., not NaN. |
|||
|    Boolean            | binaryObject.isZero() 					| Returns true if the binaryValue is equivalent to zero. |
|    Boolean		    | binaryObject.isNormalized() 				| Returns true if the value is in normalized format. |
|||
|    binaryObject       | binaryObject.normalize()                  | Converts to normalized exponential form. |
|    binaryObject       | binaryObject.exponential()                | Converts to normalized exponential form without trimming superfluous zeros. |
|    binaryObject       | binaryObject.adjustExponent(Number)  		| Adjusts exponential represention by a desired exponent. |
|||
|    binaryObject       | binaryObject.flatten()                    | Converts from exponential form to a binaryReal. |
|    binaryObject       | binaryObject.demote()                     | Converts the representation to the simpliest format. |
|||
|    binaryObject       | binaryObject.trim()                       | Removes superfluous leading and trailing 0s from all components fof a binaryValue. |
|||
|    binaryObject       | binaryObject.toFixed(fractionalBits=23)   | Sets the number of fractional digits.  |
|    binaryObject       | binaryObject.toPrecision(totalBits=24)    | Sets the total number of primary (nonsuperfluous) binary digits. |


Note that there are also a number of static methods, e.g, binaryObject.toBinaryValue(String, fractionalBits).  Each of these methods, however, have associated _String_ and _Math_ prototypes defined.  Since we anticipate that these prototypes will be used in favor of these static methods, refer to the internal documentation for additional information.


### Example of binaryValues represented as a string and as binaryComponents
```
Integers:
            "01_001" == { sign:  '', whole:  '01001', fractional:        '',  exponentSign: '',  exponent:    '' }
            "-10101" == { sign: '-', whole:  '10101', fractional:        '',  exponentSign: '',  exponent:    '' }
            "+00101" == { sign: '+', whole:  '00101', fractional:        '',  exponentSign: '',  exponent:    '' }
Reals:               
       "   010010.0" == { sign: '' , whole: '010010', fractional:       '0',  exponentSign: '',  exponent:    '' }
      "-010_010.101" == { sign: '-', whole: '010010', fractional:     '101',  exponentSign: '',  exponent:    '' }
        "+010010.01" == { sign: '+', whole: '010010', fractional:      '01',  exponentSign: '',  exponent:    '' }
          "-0.00010" == { sign: '-', whole:      '0', fractional:   '00010',  exponentSign: '',  exponent:    '' }
Proper Fractions: 
         ".010_0100" == { sign:  '', whole:       '', fractional: '0100100',  exponentSign: '',  exponent:    '' }
            ".01011" == { sign:  '', whole:       '', fractional:   '01011',  exponentSign: '',  exponent:    '' }
Exponentials:        
  "  010.010 *^ +01" == { sign:  '', whole:    '010', fractional:     '010',  exponentSign: '+', exponent:  '01' }
 "-1_010.10 *^ -101" == { sign: '-', whole:   '1010', fractional:      '10',  exponentSign: '-', exponent: '101' }
    "+ 001.010 *^ 0" == { sign: '+', whole:    '001', fractional:     '010',  exponentSign:  '', exponent:   '0' }
```

Notes:
  * Literal BinaryValues may contain underscores (_), a spaces (" "), or a tabs ("\t") for visual clarity
  * BinaryValues are always stored without punctuation characters
  * BinaryValues are not necessarily store in a normalized or pure form, 
    - e.g, the binaryReal "0010001.0000" is valid, and in its pure form is: "10001.0"
  * The binaryValue representing zero is never associated with a sign
  * Proper Fractions never have an associated exponential value
  * Methods exist to either normalize binaryValues or to demote them to a simpler form.	
  * The default maximum number of fractional bits is set to 23, which corresponds to the required number in  IEEE binary32 format.

