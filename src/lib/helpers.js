export const sha256 = (plain) => {
    // returns promise ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  }

export const base64urlencode = (a) => {
    var str = "";
    var bytes = new Uint8Array(a);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export const generateKeyValueHtml = (jsonData) => {
    let html = '';
    // Iterate over each key/value pair in the JSON object
    for (const [key, value] of Object.entries(jsonData)) {
        html += `<p><strong>${key}:</strong> ${value}</p>`;
    }
    return html;
}

export const dec2hex = (dec) => {
    return ("0" + dec.toString(16)).substr(-2);
}