# Name
binaryValues.js

# Synopsis
A Javascript library that provides support for binary values.  These values are represented as either
   * an ASCII string with the general syntax of:  [+-]? [01]* "." [01]* "\*^" [+-]? [01]*
   * an object with the following fields:  { sign, whole, fractional, exponentSign, exponent }

Example binary values (represented as string) with their corresponding decimal value:
| binary Value   | Decimal Value |Description  |
| -------------:|--------------:|:-------------|
| "1001"      | 9 | Postive Integer |
| "-1101"     | -13 | Negative Integer |
| "-1101.11"   | -13.75 | Negative Real Number |
| "0.101" | 0.65 | Real Number (in proper form) |
| ".101" | 0.625 | Proper Fraction |
| "10010.1 \*^ -10" | 9.25 | Exponential Form |
| "1.00101 \*^ 11" | 9.25 | Normalized Exponential Form |


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

## Details

### Standard Terminology
  * asciiString:       an array of bytes, with each byte encoding an ascii value
  * binaryString:      a sequence of bytes, which may encode all different types of binary data 
  * binarySequence:    a sequence of ones and zeros 
  * properFraction:	   a positive number, say f, that meets the condition 0 < f < 1.
  *	fractionalPart:    the part of the real number that is to the right of the radix point

### Terminology within this documentation
  * binarySequence:    a non-empty ascii string composed of solely binary digits. Addition punctuation
                       characters ([_, \t]) may be provided for visual clarity.

  *  binaryValue:      a string that is either a binaryInteger, binaryReal, or binaryExponential

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

## API
