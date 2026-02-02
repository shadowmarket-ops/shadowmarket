// --- CONFIGURATION ---
const products = [
    { name: "Données Bancaires", price: 450 },
    { name: "Logiciel Espion", price: 1200 },
    { name: "Identité Falsifiée", price: 2500 }
];

let balance = 0;
let total = 0;

const siren = new Audio('./sounds/mixkit-alert-alarm-1005.mp3'); // Bip d'alerte
// Pour une vraie sirène, tu peux remplacer par un lien vers un MP3 de sirène
const policeSiren = new Audio('./sounds/mixkit-alert-alarm-1005.mp3');
policeSiren.loop = true; // La sirène tourne en boucle

// --- FONCTIONS DE BLOCAGE (LocalStorage) ---

function checkStatus() {
    // On vérifie si la "marque" du FBI est présente dans le navigateur
    if (localStorage.getItem('fbi_seized') === 'true') {
        showFBIScreen();
    }
}

async function showFBIScreen() {
    document.getElementById('market-interface').style.display = 'none';
    const fbi = document.getElementById('fbi-screen');
    fbi.style.display = 'flex';

    // 1. Vibration et Sirène
    if (navigator.vibrate) navigator.vibrate([100, 100, 100, 100, 500]);
    const policeSiren = new Audio('./sounds/mixkit-alert-alarm-1005.mp3');
    policeSiren.loop = true;
    policeSiren.play().catch(() => {});

    // 2. Récupération des données réelles
    let ip = "Détection en cours...";
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ip = data.ip;
    } catch (e) { ip = "Proxy/VPN détecté"; }

    // 3. Infos de batterie (si disponible sur mobile)
    let batteryLevel = "Inconnu";
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        batteryLevel = Math.round(battery.level * 100) + "%";
    }

    const now = new Date();

    // 4. Affichage du "Dossier Judiciaire"
    document.getElementById('user-data').innerHTML = `
        <div class="data-dump">
            <p class="blink">--- DOSSIER CRIMINEL GÉNÉRÉ ---</p>
            <p><strong>DATE DE L'ARRESTATION :</strong> ${now.toLocaleString()}</p>
            <hr>
            <p><strong>ADRESSE IP RÉELLE :</strong> <span class="red">${ip}</span></p>
            <p><strong>NAVIGATEUR :</strong> ${navigator.appName} (${navigator.platform})</p>
            <p><strong>LANGUE SYSTÈME :</strong> ${navigator.language}</p>
            <p><strong>RÉSOLUTION ÉCRAN :</strong> ${window.screen.width}x${window.screen.height}</p>
            <p><strong>NIVEAU DE BATTERIE :</strong> ${batteryLevel}</p>
            <p><strong>COEFFICIENT DE CULPABILITÉ :</strong> 98.4%</p>
            <hr>
            <p><strong>LOCALISATION :</strong> TRANSMISSION AUX UNITÉS MOBILES...</p>
            <p class="small">Toute tentative de fermeture de cette page sera retenue contre vous.</p>
        </div>
    `;
}

// --- LOGIQUE DU MARCHÉ ---

function setBudget() {
    balance = parseInt(document.getElementById('user-budget').value) || 0;
    document.getElementById('current-balance').innerText = balance;
}

function add(price) {
    total += price;
    document.getElementById('total-price').innerText = total;
}

function checkout() {
    if (total === 0) return alert("Votre panier est vide !");
    if (total > balance) return alert("Solde insuffisant !");

    // Bloquer l'utilisateur pour les prochaines visites
    localStorage.setItem('fbi_seized', 'true');
    
    // Afficher l'écran FBI (le clic sur "Payer" autorise le son)
    showFBIScreen();
}

// Générer les produits au démarrage
const container = document.getElementById('product-list');
products.forEach(p => {
    container.innerHTML += `
        <div class="product-card">
            <div>
                <strong>${p.name}</strong><br>
                <span>${p.price}$</span>
            </div>
            <button onclick="add(${p.price})" style="padding:15px; border-radius:10px;">+</button>
        </div>
    `;
});

// LANCER LA VÉRIFICATION AU CHARGEMENT
window.onload = checkStatus;