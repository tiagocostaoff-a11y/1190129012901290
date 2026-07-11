const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "convites.json");

function carregar() {
    if (!fs.existsSync(DB_PATH)) return {};
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch (err) {
        console.error("⚠️ Não foi possível ler convites.json:", err);
        return {};
    }
}

function salvar(db) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (err) {
        console.error("⚠️ Não foi possível salvar convites.json:", err);
    }
}

// Soma +1 no total do usuário (chamado toda vez que alguém entra via convite dele)
function adicionarConvite(userId) {
    const db = carregar();
    db[userId] = (db[userId] || 0) + 1;
    salvar(db);
    return db[userId];
}

// Pega o total atual de um usuário
function getTotal(userId) {
    const db = carregar();
    return db[userId] || 0;
}

module.exports = { adicionarConvite, getTotal };
