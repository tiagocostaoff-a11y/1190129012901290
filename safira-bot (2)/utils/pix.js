function gerarTxid(prefixo = "BOT") {
    // Pix exige txid alfanumérico, sem espaços/acentos, até 25 caracteres
    const aleatorio = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefixo}${Date.now().toString(36).toUpperCase()}${aleatorio}`.substring(0, 25);
}

function buildPixPayload(pixKey, name, city, amount, txid) {
    const cleanName = clean(name, 25);
    const cleanCity = clean(city, 15);
    const finalTxid = txid ? clean(txid, 25) : gerarTxid();

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
    payload += tlv("62", tlv("05", finalTxid));   // <-- txid único aqui, no lugar do "***"
    payload += "6304";
    const crc = crc16(payload).toString(16).toUpperCase().padStart(4, "0");
    return payload + crc;
}

module.exports = { buildPixPayload, gerarTxid };
