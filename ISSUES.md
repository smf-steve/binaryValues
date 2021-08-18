# Potential Issues and Tasks

1. If a user provides an explicit '+' sign in a binaryValue, should the superfluous '+' always be retained.
	- It could be the case that the '+' sign is only changed to '' (empty) upon a call to normalize.

1. Proper fractions (binaryFractions) are currently structured as ".bbbb". Note there is no leading zero.
  * This is intentially, so that you can use string concatenation to join the whole part and a fractional number together.
  ```
     X = (5).integerToBinarySequence()  + (25).fractionalPartToBinaryFraction();
     console.log(x);   // the binary value of "101.01" is presented.
  ```
  * One can argue that the number is not written precisoulsy.  
  * In this package, owever, we also allow numbers like:   00001.11011000

1. Review the naming convention of _Math_ protypes.
  *  Consider the following:
  ```
    E = "101.1100".toNormalizeBinaryValue();
  ```
  * Is it possible that someone can interpret the intent here is to convert the decimal number to a BinaryValue?
  * If this was the intent then the method should be .numberToNormalizedBinaryValue();

1. Consider the following two methods:
  ```
  ".1"   <- binaryObject.properFractionToBinaryValue(0.5);
  ".75"  <- binaryObject.properFractionFromBinarySequence("11");
  ```
  * Is this clear that input type for the methods are Number and binaryFraction respectively.
  * Carefull analysis of the naming provides the right answer, but should it be more obvious with being more wordy?

1. Validate the API changes related to the sizing of each part of a binaryValue, e.g., the sizing of the exponent/
