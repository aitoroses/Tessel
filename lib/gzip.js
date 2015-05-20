var GZIP = require("gzip-js");

export function uncompress(base64) {
  var str, uar;
  try {
    str = atob(base64);
    uar = str2ab(str);
  } catch(e) {
    console.log(uar)
    throw Error(`Failed during base64 decompression for b64 ${base64}`);
  }
  try {
    var decr = GZIP.unzip(uar);
    // var decr = pako.inflate(uar);
    var result = ab2str(decr);
    return  result;
  } catch(e) {
    console.log(uar)
    throw Error(`Failed during GZIP decompression for b64 ${base64}`);
  }
}

/* Zip BASE64 + GZIP */
export function compress(message) {
  var arraybufferEncoded = GZIP.zip(str2ab(message));
  var enc = btoa(ab2str(arraybufferEncoded));
  return enc;
}

// export function ab2str(buf) {
//   return String.fromCharCode.apply(null, new Uint16Array(buf));
// }

export function ab2str(buf) {
   var str = "";
   var ab = new Uint16Array(buf);
   var abLen = ab.length;
   var CHUNK_SIZE = Math.pow(2, 16);
   var offset, len, subab;
   for (offset = 0; offset < abLen; offset += CHUNK_SIZE) {
      len = Math.min(CHUNK_SIZE, abLen-offset);
      subab = ab.subarray(offset, offset+len);
      str += String.fromCharCode.apply(null, subab);
   }
   return str;
}

export function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
}
