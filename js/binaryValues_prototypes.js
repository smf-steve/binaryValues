///  File:  binaryValues.js
///
///  See Also: The README file for the full set of explainations.
///
///  Purpose:
///     To provide a set of operations that manipuate binary values that are represented as stings
///     
///  Description:
///     This file defines a set of functions that are bounded to either the String or Number prototype
///     to allow the user to operate over BinaryValues
///
////////////////////////////////////////////////////////////////////////////////////
///  String Prototypes
///


///         binaryComponents        <- String.isBinaryValue();                     // returns false if NOT a binary value
String.prototype.isBinaryValue = function ( ) {
    return binaryObject.isBinaryValue(String(this));
}


///         binarySequence          <- String.isBinarySequence();                  // synonmous to toBinarySequence  returns false if Not a binary sequence
String.prototype.isBinarySequence = function () {
    return binaryObject.isBinarySequence(String(this));
}


///  binaryValue     <- String.isZeroBinaryValue();
String.prototype.isZeroBinaryValue = function () {
    return binaryObject.isZeroBinaryValue(String(this));
}

///         bool                    <- String.isNormalizedBinary();
String.prototype.isNormalizedBinaryValue = function () {
    return binaryObject.isNormalizedBinaryValue(String(this));
}


///         binaryValue            <- String.normalizeBinaryValue();        
String.prototype.normalizeBinaryValue = function () {
    var obj = new binaryObject(String(this));
    return obj.normalize().get();
}

///         binaryValue            <- String.toExponentialBinaryValue();
String.prototype.toExponentialBinaryValue = function () {
    var obj = new binaryObject(String(this));
    return obj.toExponential().get();
}

///         binaryValue             <- String.adjustExponentBinaryValue number )       // Adjusts exponential represention to a desired exponent
String.prototype.adjustExponentBinaryValue = function ( number ) {
    var obj = new binaryObject(String(this));
    return obj.adjustExponent(number).get();
}

///     
///         binaryReal              <- String.flattenBinaryValue();                     // Converts from exponential form to a real form
String.prototype.flattenBinaryValue = function () {
    var obj = new binaryObject(String(this));
    return obj.flatten().get();
}

///         { binaryReal | 
///           binaryInteger }       <- String.demoteBinaryValue();                      // Converts representation to the simpliest form
String.prototype.demoteBinaryValue = function () {
    var obj = new binaryObject(String(this));
    return obj.demote().get();
}



///         binaryValue             <- String.trimBinaryValue();                        // Removes superfluous leading and trailing 0s
String.prototype.trimBinaryValue = function () {
    var obj = new binaryObject(String(this));
    return obj.trim().get();
}

///         binaryValue             <- String.trimStartBinarySequence()                    // eg. "+0110.000E+000001".binary_trim()
///         binaryValue             <- String.trimEndBinarySequence()                      // eg. --> "+110.0E+1"
String.prototype.trimStartBinarySequence = function () {
    return binaryObject.trimStartBinarySequence(String(this));
}

String.prototype.trimEndBinarySequence = function () {
    return binaryObject.trimEndBinarySequence(String(this));
}


///         binaryValue             <- String.toFixedBinaryValue( number )              // sets the number of fractional digits 
String.prototype.toFixedBinaryValue = function (fractionalBits= 0) {
    var obj = new binaryObject(String(this));
    return obj.toFixed(fractionalBits).get();
}

///         binaryValue             <- String.toPrecisionBinaryValue( number )          // sets the total number of binary digits
String.prototype.toPrecisionBinaryValue = function (totalBits) {
    var obj = new binaryObject(String(this));
    return obj.toPrecision(totalBits).get();
}


////////////////////////////////////////////////////////////////////////////////////
///  Number Conversion Prototypes
///


///         binaryComponents        <- (Number).toDecimalComponents()                                       //    Returns NaN if NOT a decimal value
///         binaryComponents        <- "Number".toDecimalComponents()                                       //    Returns NaN if NOT a decimal value
Number.prototype.toDecimalComponents  = function () {
  return binaryObject.toDecimalComponents(String(this));
}
String.prototype.toDecimalComponents  = function () {
  return binaryObject.toDecimalComponents(String(this));
}



///          Number                  <- String.numberFromBinaryValue()
String.prototype.numberFromBinaryValue  = function () {
  return binaryObject.numberFromBinaryValue(String(this));
}

///         String                  <- String.exponentialFromBinaryValue()                  // "2.5E1"  <- "1.1001  *^ 100"
String.prototype.exponentialFromBinaryValue  = function () {
  return binaryObject.exponentialFromBinaryValue(String(this));
}



String.prototype.integerFromBinarySequence  = function () {
  return binaryObject.integerFromBinarySequence(String(this));
}


String.prototype.properFractionFromBinarySequence  = function () {
  return binaryObject.properFractionFromBinarySequence(String(this));
}

String.prototype.fractionalPartFromBinarySequence  = function () {
  return binaryObject.fractionalPartFromBinarySequence(String(this));
}



//////
////// Prototypes   Number --> Binary*

/// binaryComponents <- String.toBinaryComponents()
String.prototype.toBinaryComponents = function ( ) {
    return binaryObject.toBinaryComponents(String(this));
}

//         binaryValue             <- Number.toBinaryValue(fractionalBits)            //    (4.3).toBinaryValue()
///         binaryValue             <- String.toBinaryValue(fractionalBits)            //    "4.3".toBinaryValue()
Number.prototype.toBinaryValue  = function (fractionalBits) {
  return binaryObject.toBinaryValue(String(this), fractionalBits);
}
String.prototype.toBinaryValue  = function (fractionalBits) {
  // convert the string value to a number first, to address "5.5E2"
  return binaryObject.toBinaryValue(String(this), fractionalBits);
}


Number.prototype.integerToBinarySequence = function () {
  return binaryObject.integerToBinarySequence(String(this));
}

String.prototype.integerToBinarySequence = function () {
  return binaryObject.integerToBinarySequence(String(this));
}



Number.prototype.numberToBinaryFraction = function (limit, fractionalBits) {
  return binaryObject.numberToBinaryFraction(String(this), limit, fractionalBits);
}

String.prototype.numberToBinaryFraction  = function (limit, fractionalBits) {
  return binaryObject.numberToBinaryFraction(String(this), limit, fractionalBits);
}



/// Following are support routines


Number.prototype.properFractionToBinaryFraction  = function (fractionalBits) {
  return binaryObject.properFractionToBinaryFraction(String(this), fractionalBits);
}
String.prototype.properFractionToBinaryFraction  = function (fractionalBits) {
  return binaryObject.properFractionToBinaryFraction(String(this), fractionalBits);
}


Number.prototype.fractionalPartToBinaryFraction  = function (fractionalBits) {
  return binaryObject.fractionalPartToBinaryFraction(String(this), fractionalBits);
}
String.prototype.fractionalPartToBinaryFraction  = function (fractionalBits) {
  var x = binaryObject.fractionalPartToBinaryFraction(String(this), fractionalBits);
  return x;
}



Number.prototype.properFractionToBinarySequence  = function (fractionalBits) {
  return binaryObject.properFractionToBinarySequence(String(this), fractionalBits);
}

String.prototype.properFractionToBinarySequence  = function (fractionalBits) {
  return binaryObject.properFractionToBinarySequence(String(this), fractionalBits);
}

Number.prototype.fractionalPartToBinarySequence  = function (fractionalBits) {
  return binaryObject.fractionalPartToBinarySequence(String(this), fractionalBits);
}

String.prototype.fractionalPartToBinarySequence  = function (fractionalBits) {
  return binaryObject.fractionalPartToBinarySequence(String(this), fractionalBits);
}



