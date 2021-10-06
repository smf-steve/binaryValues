// mips_encoding.js
// "encode".encodeRegister()
// "encode".encodeOpCode()
// "".encodeFunc()
// "".encodeImmediate(Number)
// "".encodeImmediateAddress(PC)
// "encode".decodeRegister()
// "encode".decodeOpCode()
// "".decodeFunc()
// "".decodeImmediate(Number)
// "".decodeImmediateAddress(PC)





function mips_encodeInstruction(mnemonic) {
  var instr = mips_instruction(mnemonic);
  return (instr == undefined) ? NaN : { op: instr.op, func: instr.op };

}
function mips_encodeOpCode(mnemonic) {
  var instr = mips_instruction(mnemonic);
  return (instr == undefined) ? NaN : instr.op;
}

function mips_encodeFunc() {
  var instr = mips_instruction(str);
  return (instr == undefined) ? NaN : instr.func;
}


function mips_decodeOpCode(code) {
  if (code == 0x00) {
    console.warn("code == 0x00, need to consult func code. ");
  }
  
  var instr = mips_instruction.find(rec => rec.code == code);
  (code == 0x00) ? undefined : rec.mnemonic;
}

function mips_decodeFunc(code) {
  var instr = mips_instruction.find(rec => rec.code == code);
  return (func == NaN) ? undefined : rec.mnemonic;
}

function mips_encodeShiftValue(num) {
  // convert to this to a look up table?
  console.assert(num < Math.pos(2, 5), "Expected num: 0..2^5 -1");
  // Returns: a 5 digit binary number

  return num.toString(2).padStart(5, '0');
}

function mips_decodeShiftValue(str) {
  return ParseInt(str, 2);
}



// Input is expected to be a number
function mips_encodeImmediate(imm) {
  if (imm >= Math.pow(2,15)) {
    console.warn("imm value may interpreted as a negative value");
  }
  if (imm < 0) {
    console.assert(-Math.pow(2, 15) < imm, "Expected num: > - 2^15");
  }
  console.assert(imm < Math.pow(2, 16), "Expected num: 0..2^16 -1");
  // Returns: a 16 digit unsigned binary number

  var pattern;

  if (imm < 0 ) {
    imm = Math.abs(imm) + 1;
    pattern = Math.abs(imm).toString(2);
    pattern.toComplement(pattern);
  } else {
    pattern = imm.toString(2);
  }
  return pattern.padStart(16,'0');
}  




function mips_encodeImmediateAddress(label) {
   // 16 bits address relative to pc
    // lookup the address of the label
    // lookup the current pc value
    var address = (pc - addr);
    return mips_encodeImmediate(address);
}

function toComplement(pattern) {
  return pattern.replaceAll('1', 'x').replaceAll('0', '1').replace('x', '1');
}




function mips_instruction(mnemonic) {
  var instr;  // one of the records associated with instruction_table
  
  instr = instruction_table.find(rec => rec.mnemonic == mnemonic);
  return instr;
}

instruction_table = [
  { mnemonic: "add",   format: "R", op: 0x00, func: 0x20 },
  { mnemonic: "sub",   format: "R", op: 0x00, func: 0x22 },
  { mnemonic: "addi",  format: "I", op: 0x08, func: 0x20 },
  { mnemonic: "addu",  format: "R", op: 0x00, func: 0x21 },
  { mnemonic: "subu",  format: "R", op: 0x00, func: 0x23 },
  { mnemonic: "addiu", format: "I", op: 0x09, func: NaN },
  { mnemonic: "mult",  format: "R", op: 0x00, func: 0x18 },
  { mnemonic: "div",   format: "R", op: 0x00, func: 0x1a },
  { mnemonic: "multu", format: "R", op: 0x00, func: 0x19 },
  { mnemonic: "divu",  format: "R", op: 0x00, func: 0x1b },
  { mnemonic: "mfhi",  format: "R", op: 0x00, func: 0x10 },
  { mnemonic: "mflo",  format: "R", op: 0x00, func: 0x12 },
  { mnemonic: "and",   format: "R", op: 0x00, func: 0x24 },
  { mnemonic: "or",    format: "R", op: 0x00, func: 0x25 },
  { mnemonic: "nor",   format: "R", op: 0x00, func: 0x27 },
  { mnemonic: "xor",   format: "R", op: 0x00, func: 0x26 },
  { mnemonic: "andi",  format: "I", op: 0x0c, func: NaN },
  { mnemonic: "ori",   format: "I", op: 0x0d, func: NaN },
  { mnemonic: "xori",  format: "I", op: 0x0e, func: NaN },
  { mnemonic: "sll",   format: "R", op: 0x00, func: 0x00 },
  { mnemonic: "srl",   format: "R", op: 0x00, func: 0x02 },
  { mnemonic: "sra",   format: "R", op: 0x00, func: 0x03 },
  { mnemonic: "sllv",  format: "R", op: 0x00, func: 0x04 },
  { mnemonic: "srlv",  format: "R", op: 0x00, func: 0x06 },
  { mnemonic: "srav",  format: "R", op: 0x00, func: 0x07 },
  { mnemonic: "slt",   format: "R", op: 0x00, func: 0x2a },
  { mnemonic: "sltu",  format: "R", op: 0x00, func: 0x2b },
  { mnemonic: "slti",  format: "I", op: 0x0a, func: NaN },
  { mnemonic: "sltiu", format: "I", op: 0x0b, func: NaN },
  { mnemonic: "j",     format: "J", op: 0x02, func: NaN },
  { mnemonic: "jal",   format: "J", op: 0x03, func: NaN },
  { mnemonic: "jr",    format: "R", op: 0x00, func: 0x08 },
  { mnemonic: "jalr",  format: "R", op: 0x00, func: 0x09 },
  { mnemonic: "beq",   format: "I", op: 0x04, func: NaN },
  { mnemonic: "bne",   format: "I", op: 0x05, func: NaN },
  { mnemonic: "sycall",format: "R", op: 0x00, func: 0x0c },
  { mnemonic: "lui",   format: "I", op: 0x0f, func: NaN },
  { mnemonic: "lb",    format: "I", op: 0x20, func: NaN },
  { mnemonic: "lbu",   format: "I", op: 0x24, func: NaN },
  { mnemonic: "lh",    format: "I", op: 0x21, func: NaN },
  { mnemonic: "lhu",   format: "I", op: 0x25, func: NaN },
  { mnemonic: "lw",    format: "I", op: 0x23, func: NaN },
  { mnemonic: "sb",    format: "I", op: 0x28, func: NaN },
  { mnemonic: "sh",    format: "I", op: 0x29, func: NaN },
  { mnemonic: "sw",    format: "I", op: 0x2b, func: NaN },
  { mnemonic: "ll",    format: "I", op: 0x30, func: NaN },
  { mnemonic: "sc",    format: "I", op: 0x30, func: NaN }
];



function mips_register(mnemonic) {
  var register;  // one of the records associated with register_table;

  register = register_table.find(rec => rec.mnemonic == mnemonic);
  if (register == undefined) {
    register = register_table.find(rec => rec.number == mnemonic)
  }
  
  return register;
}

function mips_encodeRegister(mnemonic) {
  var register;  // one of the records associated with register_table;

  register = mips_instruction(mnemonic);
  return (register == undefined )? NaN : register.code;
}

function mips_decodeRegister(code) {
  var register;  // one of the records associated with register_table;

  register = register_table.find(rec => rec.code == code);
  return (register == undefined )? NaN : register.mnemonic;
}

register_table = [
  { mnemonic: "$zero", number:  "$0", code: '00000' },
  { mnemonic: "$at",   number:  "$1", code: '00001' },
  { mnemonic: "$v0",   number:  "$2", code: '00010' },
  { mnemonic: "$v1",   number:  "$3", code: '00011' },
  { mnemonic: "$a0",   number:  "$4", code: '00100' },
  { mnemonic: "$a1",   number:  "$5", code: '00101' },
  { mnemonic: "$a2",   number:  "$6", code: '00110' },
  { mnemonic: "$a3",   number:  "$7", code: '00111' },
  { mnemonic: "$t0",   number:  "$8", code: '01000' },
  { mnemonic: "$t1",   number:  "$9", code: '01001' },
  { mnemonic: "$t2",   number: "$10", code: '01010' },
  { mnemonic: "$t3",   number: "$11", code: '01011' },
  { mnemonic: "$t4",   number: "$12", code: '01100' },
  { mnemonic: "$t5",   number: "$13", code: '01101' },
  { mnemonic: "$t6",   number: "$14", code: '01110' },
  { mnemonic: "$t7",   number: "$15", code: '01111' },
  { mnemonic: "$s0",   number: "$16", code: '10000' },
  { mnemonic: "$s1",   number: "$17", code: '10001' },
  { mnemonic: "$s2",   number: "$18", code: '10010' },
  { mnemonic: "$s3",   number: "$19", code: '10011' },
  { mnemonic: "$s4",   number: "$20", code: '10100' },
  { mnemonic: "$s5",   number: "$21", code: '10101' },
  { mnemonic: "$s6",   number: "$22", code: '10110' },
  { mnemonic: "$s7",   number: "$23", code: '10111' },
  { mnemonic: "$t8",   number: "$24", code: '11000' },
  { mnemonic: "$t9",   number: "$25", code: '11001' },
  { mnemonic: "$k1",   number: "$26", code: '11010' },
  { mnemonic: "$k2",   number: "$27", code: '11011' },
  { mnemonic: "$gp",   number: "$28", code: '11100' },
  { mnemonic: "$sp",   number: "$29", code: '11101' },
  { mnemonic: "$fp",   number: "$30", code: '11110' },
  { mnemonic: "$ra",   number: "$31", code: '11111' }
];



function decToDec(str) { return number_table.find(rec => rec.dec == str).dec; }
function decToHex(str) { return number_table.find(rec => rec.dec == str).hex; }
function decToBCD(str) { return number_table.find(rec => rec.dec == str).bcd; }
function decToOct(str) { return number_table.find(rec => rec.dec == str).oct; }
function decToBin(str) { return number_table.find(rec => rec.dec == str).bin; }

function hexToDec(str) { return number_table.find(rec => rec.hex == str).dec; }
function hexToHex(str) { return number_table.find(rec => rec.hex == str).hex; }
function hexToBCD(str) { return number_table.find(rec => rec.hex == str).bcd; }
function hexToOct(str) { return number_table.find(rec => rec.hex == str).oct; }
function hexToBin(str) { return number_table.find(rec => rec.hex == str).bin; }

function BCDToDec(str) { return number_table.find(rec => rec.bcd == str).dec; }
function BCDToHex(str) { return number_table.find(rec => rec.bcd == str).hex; }
function BCDToBCD(str) { return number_table.find(rec => rec.bcd == str).bcd; }
function BCDToOct(str) { return number_table.find(rec => rec.bcd == str).oct; }
function BCDToBin(str) { return number_table.find(rec => rec.bcd == str).bin; }

function octToDec(str) { return number_table.find(rec => rec.oct == str).dec; }
function octToHex(str) { return number_table.find(rec => rec.oct == str).hex; }
function octToBCD(str) { return number_table.find(rec => rec.oct == str).bcd; }
function octToOct(str) { return number_table.find(rec => rec.oct == str).oct; }
function octToBin(str) { return number_table.find(rec => rec.oct == str).bin; }

function binToDec(str) { return number_table.find(rec => rec.bin == str).dec; }
function binToHex(str) { return number_table.find(rec => rec.bin == str).hex; }
function binToBCD(str) { return number_table.find(rec => rec.bin == str).bcd; }
function binToOct(str) { return number_table.find(rec => rec.bin == str).oct; }
function binToBin(str) { return number_table.find(rec => rec.bin == str).bin; }

number_table = [
  { dec:  '0', hex: '0', bcd:      '0000', oct:  '0', bin: '0000'},
  { dec:  '1', hex: '1', bcd:      '0001', oct:  '1', bin: '0001'},
  { dec:  '2', hex: '2', bcd:      '0010', oct:  '2', bin: '0010'},
  { dec:  '3', hex: '3', bcd:      '0011', oct:  '3', bin: '0011'},
  { dec:  '4', hex: '4', bcd:      '0100', oct:  '4', bin: '0100'},
  { dec:  '5', hex: '5', bcd:      '0101', oct:  '5', bin: '0101'},
  { dec:  '6', hex: '6', bcd:      '0110', oct:  '6', bin: '0110'},
  { dec:  '7', hex: '7', bcd:      '0111', oct:  '7', bin: '0111'},
  { dec:  '8', hex: '8', bcd:      '1000', oct: '10', bin: '1000'},
  { dec:  '9', hex: '9', bcd:      '1001', oct: '11', bin: '1001'},
  { dec: '10', hex: 'A', bcd: '0001 0000', oct: '12', bin: '1010'},
  { dec: '11', hex: 'B', bcd: '0001 0001', oct: '13', bin: '1011'},
  { dec: '12', hex: 'C', bcd: '0001 0010', oct: '14', bin: '1100'},
  { dec: '13', hex: 'D', bcd: '0001 0011', oct: '15', bin: '1101'},
  { dec: '14', hex: 'E', bcd: '0001 0100', oct: '16', bin: '1110'},
  { dec: '15', hex: 'F', bcd: '0001 0101', oct: '17', bin: '1111'}
];




