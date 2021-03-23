let colorBlock = document.querySelector('#BigRectangle');
let cursor = document.querySelector('#colorPickerCursor');

function rgbToHex(R, G, B) {
    return toHex(R) + toHex(G) + toHex(B)
}

function toHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return "00";
    n = Math.max(0, Math.min(n, 255));
    return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
}

window.addEventListener('mousedown', (event) => {
    let rect = colorBlock.getBoundingClientRect();
    if ((event.clientX - rect.left) >= 0 && (event.clientX - rect.left) <= 300 && (event.clientY - rect.top) >= 0 &&
        (event.clientY - rect.top) <= 300) {
        cursor.setAttribute("cx", (event.clientX - rect.left).toString());
        cursor.setAttribute("cy", (event.clientY - rect.top).toString());

        if ((event.clientY - rect.top) > 100) {
            cursor.setAttribute("stroke", "white");
        } else {
            cursor.setAttribute("stroke", "black");
        }

        let s = (event.clientX - rect.left) / 300;
        let v = 1 - (event.clientY - rect.top) / 300;
        let h = document.getElementById("h-input").value;
        let l = (2 - s) * v / 2;
        let sTemp;
        if (l !== 0) {
            if (l === 1) {
                sTemp = 0
            } else if (l < 0.5) {
                sTemp = s * v / (l * 2)
            } else {
                sTemp = s * v / (2 - l * 2)
            }
        }
        this.s = sTemp;
        this.h = h;
        this.l = l;

        document.getElementById("h-input").value = Math.trunc(this.h);
        document.getElementById("s-input").value = Math.trunc(this.s * 100);
        document.getElementById("l-input").value = Math.trunc(this.l * 100);
        let c;
        c = v * s;
        let x;
        x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m;
        m = v - c;
        let rTemp, gTemp, bTemp;
        if (h >= 0 && h < 60) {
            rTemp = c;
            gTemp = x;
            bTemp = 0;
        }
        if (h >= 60 && h < 120) {
            rTemp = x;
            gTemp = c;
            bTemp = 0;
        }
        if (h >= 120 && h < 180) {
            rTemp = 0;
            gTemp = c;
            bTemp = x;
        }
        if (h >= 180 && h < 240) {
            rTemp = 0;
            gTemp = x;
            bTemp = c;
        }
        if (h >= 240 && h < 300) {
            rTemp = x;
            gTemp = 0;
            bTemp = c;
        }
        if (h >= 300 && h < 360) {
            rTemp = c;
            gTemp = 0;
            bTemp = x;
        }

        this.r = (rTemp + m) * 255;
        this.g = (gTemp + m) * 255;
        this.b = (bTemp + m) * 255;

        document.getElementById("currentColor").style.background = `rgb(${this.r},${this.g},${this.b})`;
        document.getElementById("r-input").value = Math.trunc(this.r);
        document.getElementById("g-input").value = Math.trunc(this.g);
        document.getElementById("b-input").value = Math.trunc(this.b);

        document.getElementById("hex-input").value = rgbToHex(Math.trunc(this.r), Math.trunc(this.g),
            Math.trunc(this.b));

        let result = new CMYK(0, 0, 0, 0);
        result.k = Math.min(1 - this.r / 255, 1 - this.g / 255, 1 - this.b / 255);
        result.c = (1 - this.r / 255 - result.k) / (1 - result.k);
        result.m = (1 - this.g / 255 - result.k) / (1 - result.k);
        result.y = (1 - this.b / 255 - result.k) / (1 - result.k);

        result.c = Math.round(result.c * 100);
        result.m = Math.round(result.m * 100);
        result.y = Math.round(result.y * 100);
        result.k = Math.round(result.k * 100);

        document.getElementById("c-input").value = result.c;
        document.getElementById("m-input").value = result.m;
        document.getElementById("y-input").value = result.y;
        document.getElementById("k-input").value = result.k;
    }
}, {
    capture: true
})

/////////////////////////////////////////////////////////////////////////////////
function hlsToRgb2(h, l, s) {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r = l;
    let g = l;
    let b = l;
    let v = (l <= 0.5) ? (l * (1.0 + s)) : (l + s - l * s);

    if (v > 0) {
        let m;
        let sv;
        let hFloor;
        let fraction;
        let vsf;
        let rgMid;
        let gbMid;

        m = l + l - v;
        sv = (v - m) / v;
        h = h * 6.0;
        hFloor = Math.floor(h);
        fraction = h - hFloor;
        vsf = v * sv * fraction;
        rgMid = m + vsf;
        gbMid = v - vsf;

        switch (hFloor) {
            case 0:
                r = v;
                g = rgMid;
                b = m;
                break;
            case 1:
                r = gbMid;
                g = v;
                b = m;
                break;
            case 2:
                r = m;
                g = v;
                b = rgMid;
                break;
            case 3:
                r = m;
                g = gbMid;
                b = v;
                break;
            case 4:
                r = rgMid;
                g = m;
                b = v;
                break;
            case 5:
                r = v;
                g = m;
                b = gbMid;
                break;
        }
    }
    this.r = r * 255;
    this.g = g * 255;
    this.b = b * 255;

    let k = Math.min(1 - r, 1 - g, 1 - b);
    let c = (1 - r - k) / (1 - k);
    let mm = (1 - g - k) / (1 - k);
    let y = (1 - b - k) / (1 - k);

    c = Math.round(c * 100);
    mm = Math.round(mm * 100);
    y = Math.round(y * 100);
    k = Math.round(k * 100);

    document.getElementById("c-input").value = c;
    document.getElementById("m-input").value = mm;
    document.getElementById("y-input").value = y;
    document.getElementById("k-input").value = k;
    document.getElementById("r-input").value = parseInt(this.r);
    document.getElementById("g-input").value = parseInt(this.g);
    document.getElementById("b-input").value = parseInt(this.b);
    document.getElementById("hex-input").value = rgbToHex(Math.trunc(this.r), Math.trunc(this.g), Math.trunc(this.b));
    return [`rgb(${this.r},${this.g},${this.b})`];
}

function Volume() {
    document.getElementById("h-input").value = document.getElementById("volume").value;
    document.getElementById("color-picker-tone").style.fill =
        hlsToRgb2(document.getElementById("h-input").value, 50, 100);
    document.getElementById("currentColor").style.background =
        hlsToRgb2(document.getElementById("h-input").value, document.getElementById("l-input").value,
            document.getElementById("s-input").value);
}

/////////////////////////////////////////////////////////////////////

function CMYK(c, m, y, k) {
    this.c = c;
    this.m = m;
    this.y = y;
    this.k = k;
}

function HLStoColorPickerTone(h, l, s) {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    let r = l;
    let g = l;
    let b = l;
    let v = (l <= 0.5) ? (l * (1.0 + s)) : (l + s - l * s);

    if (v > 0) {
        let m;
        let sv;
        let hFloor;
        let fraction;
        let vsf;
        let rgMid;
        let gbMid;

        m = l + l - v;
        sv = (v - m) / v;
        h = h * 6.0;
        hFloor = Math.floor(h);
        fraction = h - hFloor;
        vsf = v * sv * fraction;
        rgMid = m + vsf;
        gbMid = v - vsf;

        switch (hFloor) {
            case 0:
                r = v;
                g = rgMid;
                b = m;
                break;
            case 1:
                r = gbMid;
                g = v;
                b = m;
                break;
            case 2:
                r = m;
                g = v;
                b = rgMid;
                break;
            case 3:
                r = m;
                g = gbMid;
                b = v;
                break;
            case 4:
                r = rgMid;
                g = m;
                b = v;
                break;
            case 5:
                r = v;
                g = m;
                b = gbMid;
                break;
        }
    }
    this.r = r * 255;
    this.g = g * 255;
    this.b = b * 255;
    document.getElementById("color-picker-tone").style.fill = `rgb(${this.r},${this.g},${this.b})`;
}

function RGBtoCMYK() {
    let r = document.getElementById("r-input").value;
    let b = document.getElementById("b-input").value;
    let g = document.getElementById("g-input").value;

    if ((r > 255) || (g > 255) || (b > 255) || (r < 0) || (g < 0) || (b < 0)) {
        r = 255;
        alert("Недопустимое значение.")
        document.getElementById("r-input").value = 255;
        document.getElementById("b-input").value = 0;
        document.getElementById("g-input").value = 0;
        g = 0;
        b = 0;
    }

    let result = new CMYK(0, 0, 0, 0);

    result.k = Math.min(1 - r / 255, 1 - g / 255, 1 - b / 255);
    result.c = (1 - r / 255 - result.k) / (1 - result.k);
    result.m = (1 - g / 255 - result.k) / (1 - result.k);
    result.y = (1 - b / 255 - result.k) / (1 - result.k);

    result.c = Math.round(result.c * 100);
    result.m = Math.round(result.m * 100);
    result.y = Math.round(result.y * 100);
    result.k = Math.round(result.k * 100);

    document.getElementById("c-input").value = result.c;
    document.getElementById("m-input").value = result.m;
    document.getElementById("y-input").value = result.y;
    document.getElementById("k-input").value = result.k;
    this.r = r;
    this.g = g;
    this.b = b;
    document.getElementById("hex-input").value = rgbToHex(Math.trunc(this.r), Math.trunc(this.g),
        Math.trunc(this.b));
    document.getElementById("currentColor").style.background = `rgb(${this.r},${this.g},${this.b})`;

}


function RGBToHSL() {
    let r = document.getElementById("r-input").value;
    let b = document.getElementById("b-input").value;
    let g = document.getElementById("g-input").value;
    if ((r > 255) || (g > 255) || (b > 255) || (r < 0) || (g < 0) || (b < 0)) {
        r = 255;
        alert("Недопустимое значение.")
        document.getElementById("r-input").value = 255;
        document.getElementById("b-input").value = 0;
        document.getElementById("g-input").value = 0;
        g = 0;
        b = 0;
    }

    r /= 255;
    g /= 255;
    b /= 255;

    let minColor = Math.min(r, g, b);
    let maxColor = Math.max(r, g, b);
    let delta = maxColor - minColor;
    let h = 0;
    let s = 0;
    let l = 0;

    // Вычисление H
    if (delta === 0) {
        h = 0;
    }
    else if (maxColor === r) {    // Red == 255
        h = ((g - b) / delta) % 6;
    }
    else if (maxColor === g) {    // Green == 255
        h = (b - r) / delta + 2;
    }
    else {  // Blue == 255
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);

    if (h < 0) {
        h += 360;
    }
    
    // вычисление L
    l = (maxColor + minColor) / 2;

    // вычисление S
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    
    if (document.getElementById("h-input").value !== h) {
        document.getElementById("color-picker-tone").style.fill = `rgb(${r},${g},${b})`;
    }

    const bigRect = document.querySelector('#BigRectangle');
    const cursor = document.querySelector('#colorPickerCursor');
    bigRect.getBoundingClientRect();
    let vTemp = l / 100 + s / 100 * Math.min(l / 100, 1 - l / 100);
    let sTemp = 0;
    if (vTemp !== 0) {
        sTemp = 2 - 2 * l / (100 * vTemp);
    }

    cursor.setAttribute("cx", sTemp * 300);
    cursor.setAttribute("cy", (1 - vTemp) * 300);

    if (((1 - vTemp) * 200) > 100) {
        cursor.setAttribute("stroke", "white");
    } else {
        cursor.setAttribute("stroke", "black");
    }
    new HLStoColorPickerTone(h, 50, 100);
    document.getElementById("h-input").value = Math.round(h);
    document.getElementById("l-input").value = Math.round(l);
    document.getElementById("s-input").value = Math.round(s);
    document.getElementById("volume").value = h;
}

function hexToRgb(hex) {
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    document.getElementById("r-input").value = r;
    document.getElementById("g-input").value = g;
    document.getElementById("b-input").value = b;
    this.r = r;
    this.g = g;
    this.b = b;
    document.getElementById("currentColor").style.background = `rgb(${this.r},${this.g},${this.b})`;
}


function hexToCMYK(hex) {
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    let c, m, y, k;
    k = Math.min(1 - r / 255, 1 - g / 255, 1 - b / 255);
    c = (1 - r / 255 - k) / (1 - k);
    m = (1 - g / 255 - k) / (1 - k);
    y = (1 - b / 255 - k) / (1 - k);

    c = Math.round(c * 100);
    m = Math.round(m * 100);
    y = Math.round(y * 100);
    k = Math.round(k * 100);

    document.getElementById("c-input").value = c;
    document.getElementById("m-input").value = m;
    document.getElementById("y-input").value = y;
    document.getElementById("k-input").value = k;
}

function hexToHSL(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    document.getElementById("h-input").value = parseInt(h * 360);
    document.getElementById("volume").value = parseInt(h * 360);
    document.getElementById("l-input").value = parseInt(l * 100);
    document.getElementById("s-input").value = parseInt(s * 100);
    HLStoColorPickerTone(h * 360, 50, 100);

    const bigRect = document.querySelector('#BigRectangle');
    const cursor = document.querySelector('#colorPickerCursor');
    bigRect.getBoundingClientRect();
    let vTemp = l + s * Math.min(l, 1 - l);
    let sTemp = 0;
    if (vTemp !== 0) {
        sTemp = 2 - 2 * l / vTemp;
    }

    cursor.setAttribute("cx", sTemp * 300);
    cursor.setAttribute("cy", (1 - vTemp) * 300);
    if (((1 - vTemp) * 200) > 100) {
        cursor.setAttribute("stroke", "white");
    } else {
        cursor.setAttribute("stroke", "black");
    }
}

function HEX() {
    let hex;
    hex = document.getElementById("hex-input").value;
    if (hex.length !== 6) {
        alert("Некорректный ввод.")
    } else {
        hexToRgb(hex);
        hexToCMYK(hex);
        hexToHSL(hex);
    }
}

function CMYKtoRGB() {
    let c = document.getElementById("c-input").value;
    let m = document.getElementById("m-input").value;
    let y = document.getElementById("y-input").value;
    let k = document.getElementById("k-input").value;

    if ((c > 100) || (m > 100) || (y > 100) || (k > 100) || (c
        < 0) || (m < 0) || (y < 0) || (k < 0)) {
        alert("Недопустимое значение.")
        document.getElementById("c-input").value = 0;
        document.getElementById("m-input").value = 100;
        document.getElementById("y-input").value = 100;
        document.getElementById("k-input").value = 0;
        c = 0;
        m = 100;
        y = 100;
        k = 0;
    }
    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;

    let r = 1 - Math.min(1, c * (1 - k) + k);
    let g = 1 - Math.min(1, m * (1 - k) + k);
    let b = 1 - Math.min(1, y * (1 - k) + k);

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    document.getElementById("r-input").value = r;
    document.getElementById("g-input").value = g;
    document.getElementById("b-input").value = b;

    this.r = r;
    this.g = g;
    this.b = b;
    document.getElementById("hex-input").value = rgbToHex(Math.trunc(this.r), Math.trunc(this.g), Math.trunc(this.b));
    document.getElementById("currentColor").style.background = `rgb(${this.r},${this.g},${this.b})`;

}

function CMYKtoHLS() {
    let c = document.getElementById("c-input").value;
    let m = document.getElementById("m-input").value;
    let y = document.getElementById("y-input").value;
    let k = document.getElementById("k-input").value;
    if ((c > 100) || (m > 100) || (y > 100) || (k > 100) || (c
        < 0) || (m < 0) || (y < 0) || (k < 0)) {
        alert("Введено недопустимое значение!")
        document.getElementById("c-input").value = 0;
        document.getElementById("m-input").value = 100;
        document.getElementById("y-input").value = 100;
        document.getElementById("k-input").value = 0;
        c = 0;
        m = 100;
        y = 100;
        k = 0;
    }
    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;
    let r = 1 - Math.min(1, c * (1 - k) + k);
    let g = 1 - Math.min(1, m * (1 - k) + k);
    let b = 1 - Math.min(1, y * (1 - k) + k);
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    this.r = r;
    this.g = g;
    this.b = b;

    r /= 255;
    g /= 255;
    b /= 255;

    let minColor = Math.min(r, g, b),
        maxColor = Math.max(r, g, b),
        delta = maxColor - minColor,
        h = 0,
        s = 0,
        l = 0;

    //вычисление H
    if (delta === 0) {
        h = 0;
    } else if (maxColor === r) { // Red == 255
        h = ((g - b) / delta) % 6;
    } else if (maxColor === g) { // Green == 255
        h = (b - r) / delta + 2;
    } else { //Blue == 255
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);

    if (h < 0) {
        h += 360;
    }

    //вычисление L
    l = (maxColor + minColor) / 2;

    //вычисление S
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    const bigRect = document.querySelector('#BigRectangle');
    const cursor = document.querySelector('#colorPickerCursor');
    bigRect.getBoundingClientRect();
    let vTemp = l / 100 + s / 100 * Math.min(l / 100, 1 - l / 100);
    let sTemp = 0;
    if (vTemp !== 0) {
        sTemp = 2 - 2 * l / (100 * vTemp);
    }

    cursor.setAttribute("cx", (sTemp * 300).toString());
    cursor.setAttribute("cy", ((1 - vTemp) * 300).toString());
    if (((1 - vTemp) * 200) > 100) {
        cursor.setAttribute("stroke", "white");
    } else {
        cursor.setAttribute("stroke", "black");
    }

    HLStoColorPickerTone(h, 50, 100);
    document.getElementById("h-input").value = h;
    document.getElementById("l-input").value = l;
    document.getElementById("s-input").value = s;
    document.getElementById("volume").value = h;
}

function HLStoRGB() {
    let h = document.getElementById("h-input").value;
    let l = document.getElementById("l-input").value;
    let s = document.getElementById("s-input").value;

    if ((h > 360) || (l > 100) || (s > 100) || (h
        < 0) || (l < 0) || (s < 0)) {
        alert("Недопустимое значение.")
        document.getElementById("h-input").value = 0;
        document.getElementById("l-input").value = 50;
        document.getElementById("s-input").value = 100;
        h = 0;
        l = 50;
        s = 100;
    }

    document.getElementById("volume").value = h;
    HLStoColorPickerTone(h, 50, 100);
    h = h / 360;
    s = s / 100;
    l = l / 100;
    let r = l;
    let g = l;
    let b = l;
    let v = (l <= 0.5) ? (l * (1.0 + s)) : (l + s - l * s);

    if (v > 0) {
        let m;
        let sv;
        let hFloor;
        let fraction;
        let vsf;
        let rgMid;
        let gbMid;

        m = l + l - v;
        sv = (v - m) / v;
        h = h * 6.0;
        hFloor = Math.floor(h);
        fraction = h - hFloor;
        vsf = v * sv * fraction;
        rgMid = m + vsf;
        gbMid = v - vsf;

        switch (hFloor) {
            case 0:
                r = v;
                g = rgMid;
                b = m;
                break;
            case 1:
                r = gbMid;
                g = v;
                b = m;
                break;
            case 2:
                r = m;
                g = v;
                b = rgMid;
                break;
            case 3:
                r = m;
                g = gbMid;
                b = v;
                break;
            case 4:
                r = rgMid;
                g = m;
                b = v;
                break;
            case 5:
                r = v;
                g = m;
                b = gbMid;
                break;
        }
    }
    document.getElementById("r-input").value = parseInt((r * 255.0).toString());
    document.getElementById("g-input").value = parseInt((g * 255.0).toString());
    document.getElementById("b-input").value = parseInt((b * 255.0).toString());
    this.r = r * 255;
    this.g = g * 255;
    this.b = b * 255;
    document.getElementById("hex-input").value = rgbToHex(Math.trunc(this.r), Math.trunc(this.g), Math.trunc(this.b));
    document.getElementById("currentColor").style.background = `rgb(${this.r},${this.g},${this.b})`;
}

function HLStoCMYK() {
    let h = document.getElementById("h-input").value;
    let l = document.getElementById("l-input").value;
    let s = document.getElementById("s-input").value;

    if ((h > 360) || (l > 100) || (s > 100) || (h
        < 0) || (l < 0) || (s < 0)) {
        alert("Вы ввели недопустимое значение!После нажатия 'OK' будут значения красного цвета.")
        document.getElementById("h-input").value = 0;
        document.getElementById("l-input").value = 50;
        document.getElementById("s-input").value = 100;
        h = 0;
        l = 50;
        s = 100;
    }

    const bigRect = document.querySelector('#BigRectangle');
    const cursor = document.querySelector('#colorPickerCursor');
    const tempRect = bigRect.getBoundingClientRect();
    let vTemp = l / 100 + s / 100 * Math.min(l / 100, 1 - l / 100);
    let sTemp = 0;
    if (vTemp !== 0) {
        sTemp = 2 - 2 * l / (100 * vTemp);
    }

    cursor.setAttribute("cx", sTemp * 300);
    cursor.setAttribute("cy", (1 - vTemp) * 300);
    if (((1 - vTemp) * 200) > 100) {
        cursor.setAttribute("stroke", "white");
    } else {
        cursor.setAttribute("stroke", "black");
    }

    h = h / 360;
    s = s / 100;
    l = l / 100;
    let r = l;
    let g = l;
    let b = l;
    let v = (l <= 0.5) ? (l * (1.0 + s)) : (l + s - l * s);

    if (v > 0) {
        let m;
        let sv;
        let hFloor;
        let fraction;
        let vsf;
        let rgMid;
        let gbMid;

        m = l + l - v;
        sv = (v - m) / v;
        h = h * 6.0;
        hFloor = Math.floor(h);
        fraction = h - hFloor;
        vsf = v * sv * fraction;
        rgMid = m + vsf;
        gbMid = v - vsf;

        switch (hFloor) {
            case 0:
                r = v;
                g = rgMid;
                b = m;
                break;
            case 1:
                r = gbMid;
                g = v;
                b = m;
                break;
            case 2:
                r = m;
                g = v;
                b = rgMid;
                break;
            case 3:
                r = m;
                g = gbMid;
                b = v;
                break;
            case 4:
                r = rgMid;
                g = m;
                b = v;
                break;
            case 5:
                r = v;
                g = m;
                b = gbMid;
                break;
        }
    }

    r = parseInt(r * 255.0);
    g = parseInt(g * 255.0);
    b = parseInt(b * 255.0);

    let k = Math.min(1 - r / 255, 1 - g / 255, 1 - b / 255);
    let c = (1 - r / 255 - k) / (1 - k);
    let m = (1 - g / 255 - k) / (1 - k);
    let y = (1 - b / 255 - k) / (1 - k);

    c = Math.round(c * 100);
    m = Math.round(m * 100);
    y = Math.round(y * 100);
    k = Math.round(k * 100);

    document.getElementById("c-input").value = c;
    document.getElementById("m-input").value = m;
    document.getElementById("y-input").value = y;
    document.getElementById("k-input").value = k;
}