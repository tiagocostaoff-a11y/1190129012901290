function crc16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        }
    }
    return crc & 0xFFFF;
}

function tlv(id, value) {
    const len = String(value.length).padStart(2, "0");
    return `${id}${len}${value}`;
}

function clean(str, maxLen) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, " ")
        .trim()
        .substring(0, maxLen);
}

function buildPixPayload(pixKey, name, city, amount) {
    const cleanName = clean(name, 25);
    const cleanCity = clean(city, 15);
    const merchantAccount =
        tlv("00", "br.gov.bcb.pix") +
        tlv("01", pixKey);
    let payload = "";
    payload += tlv("00", "01");
    payload += tlv("26", merchantAccount);
    payload += tlv("52", "0000");
    payload += tlv("53", "986");
    payload += tlv("54", amount.toFixed(2));
    payload += tlv("58", "BR");
    payload += tlv("59", cleanName);
    payload += tlv("60", cleanCity);
    payload += tlv("62", tlv("05", "***"));
    payload += "6304";
    const crc = crc16(payload).toString(16).toUpperCase().padStart(4, "0");
    return payload + crc;
}

module.exports = { buildPixPayload };
