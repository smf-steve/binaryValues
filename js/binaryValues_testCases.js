var testCases = [
	// Positive Testing:
	
	// Testing for various binaryValues
		{ func: '"011".isBinaryValue()',                               result: true },
		{ func: '"+ 011".isBinaryValue()',                             result: true },
		{ func: '"- 011".isBinaryValue()',                             result: true },
		{ func: '"011.10010".isBinaryValue()',                         result: true },
		{ func: '"011.10010 *^ 0100".isBinaryValue()',                 result: true },
		{ func: '"011.10010 *^ +0100".isBinaryValue()',                result: true },
		{ func: '"011.10010 *^ - 0100".isBinaryValue()',               result: true },
		{ func: '"-011.10010 *^ - 0100".isBinaryValue()',              result: true },


	// Tesing for various binarySequences
		{ func: '"011.10010 *^ 0100".isBinarySequence()',               result: false },
		{ func: '"010010100".isBinarySequence()',                       result: true },

	// Testing for various values of Zero
		{ func: '"010.10010 *^ 0100".isZeroBinaryValue()',              result: false },
		{ func: '"0000.0000".isZeroBinaryValue()',                      result: true },
		{ func: '"0000.0000 *^ 000".isZeroBinaryValue()',               result: true },
		{ func: '"-0000.0000 *^ 000".isZeroBinaryValue()',              result: false },
		{ func: '"0000.0000 *^ +000".isZeroBinaryValue()',              result: true },


	// Testing of Exponential Forms
		{ func: '"011.10010 *^ 0100".isNormalizedBinaryValue()',        result: false },
		{ func: '"011.10010 *^ 0100".normalizeBinaryValue()',           result: "1.11001 *^ 101"},
		{ func: '"011.10010 *^ 0100".toExponentialBinaryValue()',       result: "001.110010 *^ 0101"}, 
		{ func: '"000.10010 *^ 0100".toExponentialBinaryValue()',       result: "0001.00100 *^ 0011"},

// Needs Work
	// Testing for Adjustments to Exponents
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(0)',   result: "00011.10010 *^ 0100"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(1)',   result: "00001.110010 *^ 0101"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(2)',   result: "00000.1110010 *^ 0110"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(3)',   result: "00000.01110010 *^ 0111"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(4)',   result: "00000.001110010 *^ 1000"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(5)',   result: "00000.0001110010 *^ 1001"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(0)',   result:      "00011.10010 *^ 0100"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(-1)',  result:     "000111.00100 *^ 0011"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(-2)',  result:    "0001110.01000 *^ 0010"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(-3)',  result:   "00011100.10000 *^ 0001"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(-4)',  result:  "000111001.00000 *^ 0000"},
		{ func: '"00011.10010 *^ 0100".adjustExponentBinaryValue(-5)',  result: "0001110010.00000 *^ -0001"},


	// Testing for Simplification
		{ func: '"011.10010 *^ 0100".flattenBinaryValue()',             result: "0111001.00000"},
		{ func: '"011.10010 *^ 0100".demoteBinaryValue()',              result: "0111001"},
		{ func: '"011.10010 *^ 0100".trimBinaryValue()',                result: "11.1001 *^ 100" },

		{ func: '"0110100".trimStartBinarySequence()',                  result: "110100" },
		{ func: '"011.10010 *^ 0100".trimStartBinarySequence()',        result: "11.10010 *^ 0100"},     // should throw an error

		{ func: '"011100100100".trimEndBinarySequence()',               result: "0111001001" },
		{ func: '"011.10010 *^ 0100".trimEndBinarySequence()',          result: "011.10010 *^ 01"},    // should throw an error


	// Testing for Precison and Fixed
		{ func: '"011.10010 *^ 011".flattenBinaryValue()',              result: "011100.10000"},
		{ func: '"011.10010 *^ 011".toFixedBinaryValue(3)',             result: "011100.100"},
		{ func: '"011.10010 *^ 0100".toPrecisionBinaryValue(6)',        result: "011.1001 *^ 0100"},
        { func: '"011.10010 *^ 0100".toPrecisionBinaryValue(8)',        result: "011.10010 *^ 0100"},

// fractions in consistent ---  0.1  .1  1
	// Testing for conversion to Number
		{ func: '"011.10010 *^ 010".numberFromBinaryValue()',          result: "14.25"},
		{ func: '"011.10010 *^ 010".exponentialFromBinaryValue()',     result: "1.425E1"},


		{ func: '"11010".integerFromBinarySequence()',                  result: "26"},
		{ func: '"11".properFractionFromBinarySequence()',              result: ".75"},
		{ func: '"11".fractionalPartFromBinarySequence()',              result: "75"},


// Testing Harness Needs work
	// Testing for Components
		{ func: '(-2.5E3).toDecimalComponents()',                       result: {sign: "-", whole: "2500", fractional: "", exponentSign: "", exponent: ""} },
		{ func: '"-2.5E-3".toDecimalComponents()',                      result: {sign: "-", whole: "2", fractional: "5", exponentSign: "-", exponent: "3"} },

	// Testing Prototypes:  Number --> Binary*
		{ func: '"011.10010 *^ 0100".toBinaryComponents()',             result: {sign: "", whole: "011", fractional: "10010", exponentSign: "", exponent: "0100"} },

		{ func: '(4.25).toBinaryValue()',                               result: "100.01"},
		{ func: '"4.25".toBinaryValue()',                               result: "100.01"},
		{ func: '(0.5).toBinaryValue(5)',                               result: "0.10000"},
		{ func: '"0.5".toBinaryValue(2)',                               result: "0.10"},

		{ func: '(25).integerToBinarySequence()',                       result: "11001"},
		{ func: '"25".integerToBinarySequence()',                       result: "11001" },

		{ func: '(75).numberToBinaryFraction(100,5)',                   result: "11000"},
		{ func: '"75".numberToBinaryFraction(100)',                     result: "11"},

		{ func: '(0.75).numberToBinaryFraction(1,5)',                   result: "11000"},
		{ func: '"0.75".numberToBinaryFraction(1,5)',                   result: "11000"},

		{ func: '(0.5).properFractionToBinaryFraction()',               result: ".1"},
		{ func: '"0.5".properFractionToBinaryFraction(3)',              result: ".100"},

		{ func: '(5).fractionalPartToBinaryFraction()',                 result: ".1"},
		{ func: '"5".fractionalPartToBinaryFraction(3)',                result: ".100"},


		{ func: '(0.75).properFractionToBinarySequence()',              result: "11"},
		{ func: '"0.75".properFractionToBinarySequence(5)',             result: "11000"},

		{ func: '(75).fractionalPartToBinarySequence()',                result: "11"},
		{ func: '"75".fractionalPartToBinarySequence(5)',               result: "11000"},


];
