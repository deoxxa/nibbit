// bigint is based on GMP
var bigint = require("bigint");

// Here you are at the encoding module. This is your one-stop shop for creating
// delicious `Buffer` pies from yucky old AST contraptions.
module.exports = Encode;

// Here's your entry point:
//
//    nibbit.encode(some_ast, function(err, buffer) { ... });
//
// It's really that easy. Afterwards, you might want to compress it or some
// other thing. That's not my problem though, so you're on your own there.
function Encode(ast, cb) {
  if (!(this instanceof Encode)) {
    var encoded = (new Encode()).encode(ast);

    if (typeof cb === "function") {
      return cb(null, encoded);
    } else {
      return encoded;
    }
  }

  this.buffer = new Buffer(0);
  this.offset = 0;
};

Encode.prototype.encode = function(ast, skip_type) {
  this[ast[0]](ast, skip_type);

  return this.buffer;
};

Encode.prototype.ensure = function(n) {
  if (this.buffer.length < (this.offset + n)) {
    var tmp = new Buffer(this.offset + n);
    this.buffer.copy(tmp, 0, 0, this.offset);
    this.buffer = tmp;
  }
};

// byte
Encode.prototype.byte = Encode.prototype[1] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(1, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  this.ensure(1);
  this.buffer.writeInt8(ast[2], this.offset);
  this.offset += 1;
};

// short
Encode.prototype.short = Encode.prototype[2] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(2, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  this.ensure(2);
  this.buffer.writeInt16BE(ast[2], this.offset);
  this.offset += 2;
};

// int
Encode.prototype.int = Encode.prototype[3] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(3, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  this.ensure(4);
  this.buffer.writeInt32BE(ast[2], this.offset);
  this.offset += 4;
};

// long
Encode.prototype.long = Encode.prototype[4] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(4, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  this.ensure(8);
  bigint(ast[2].toString()).toBuffer({endian: "big", size: 8}).copy(this.buffer, this.offset, 0, 8);
  this.offset += 8;
};

// float
Encode.prototype.float = Encode.prototype[5] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(5, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  this.ensure(4);
  this.buffer.writeFloatBE(ast[2], this.offset);
  this.offset += 4;
};

// double
Encode.prototype.double = Encode.prototype[6] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(6, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  this.ensure(8);
  this.buffer.writeDoubleBE(ast[2], this.offset);
  this.offset += 8;
};

// byte array
Encode.prototype.byte_array = Encode.prototype[7] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(7, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  this.ensure(4);
  this.buffer.writeInt32BE(ast[2].length, this.offset);
  this.offset += 4;
  this.ensure(ast[2].length);
  (new Buffer(ast[2])).copy(this.buffer, this.offset, 0, ast[2].length);
  this.offset += ast[2].length;
};

// string
Encode.prototype.string = Encode.prototype[8] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(8, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  this.ensure(2 + Buffer.byteLength(ast[2]));
  // String length
  this.buffer.writeUInt16BE(ast[2].length, this.offset);
  this.offset += 2;
  // String data
  this.buffer.utf8Write(ast[2], this.offset);
  this.offset += Buffer.byteLength(ast[2]);
};

// list
Encode.prototype.list = Encode.prototype[9] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(9, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  this.ensure(5);
  this.buffer.writeInt8(ast[2][0][0], this.offset);
  this.offset += 1;
  this.buffer.writeInt32BE(ast[2].length, this.offset);
  this.offset += 4;

  var self = this;
  ast[2].forEach(function(e) {
    self.encode(e, true);
  });
};

// compound
Encode.prototype.compound = Encode.prototype[10] = function(ast, skip_type) {
  if (!skip_type) {
    this.ensure(1);
    this.buffer.writeInt8(10, this.offset);
    this.offset += 1;
  }

  if (ast[1]) {
    this.ensure(Buffer.byteLength(ast[1]) + 2);
    this.buffer.writeUInt16BE(Buffer.byteLength(ast[1]), this.offset);
    this.offset += 2;
    this.buffer.utf8Write(ast[1], this.offset);
    this.offset += Buffer.byteLength(ast[1]);
  }

  var self = this;
  ast[2].forEach(function(e) {
    self.encode(e);
  });

  this.ensure(1);
  this.buffer.writeInt8(0, this.offset);
  this.offset += 1;
};
