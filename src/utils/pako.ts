import pako from "pako";

export function encode(str: string): string {
  console.log("input: ", str, str.length);
  const result = pako.deflate(str);
  const resultStr = result.toString();
  // console.log(result);
  var utfDecoder = new TextDecoder("utf8");
  console.log("toString: ", resultStr);
  console.log("output: ", result);
  // const result_decode = pako.inflate(result, { to: "string" });
  // console.log("decoded: ", result_decode);
  // var b = resultStr.split(",").map(function (item) {
  //   return parseInt(item, 10);
  // });
  // console.log(b);
  // const a = new Uint8Array(b);

  // var b64encoded = btoa(utfDecoder.decode(result));
  const b64encoded = btoa(Uint8ToString(result));
  console.log("b64: ", b64encoded, b64encoded.length);
  const u8_2 = new Uint8Array(
    atob(b64encoded)
      .split("")
      .map(function (c) {
        return c.charCodeAt(0);
      })
  );
  const a_decode = pako.inflate(u8_2, { to: "string" });
  // console.log("a: ", a);
  // const a_decode = pako.inflate(result, { to: "string" });
  // const a_decode = pako.inflate(a, { to: "string" });
  console.log("a_decode: ", a_decode);

  // DOCUMENT URL management
  // document.URL is the current url
  const url_ob = new URL(document.URL);
  url_ob.hash = `#${b64encoded}`;
  // new url
  const new_url = url_ob.href;
  // change the current url
  document.location.href = new_url;

  return result.toString();
}

export function decode(str: string): string {
  console.log("decode input: ", str);
  const strToU18A = Uint8Array.from(str, (c) => c.charCodeAt(0));
  const strToU18A_2 = new TextEncoder().encode(str);
  console.log("decode strToU18A: ", strToU18A, strToU18A_2);
  const result = pako.inflate(strToU18A, { to: "string" });
  console.log("decode output: ", result);
  return result;
}

function Uint8ToString(u8a) {
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
  }
  return c.join("");
}
