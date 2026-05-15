const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyXyMKIR88hUU_midJthRgydZ5bgM1TWSdfRshZLsaNcehWGcpze39VAHaLgtBnGH6l/exec";

const textInput = document.getElementById("textInput");
const micButton = document.getElementById("micButton");
const sendButton = document.getElementById("sendButton");
const statusDiv = document.getElementById("status");

let recognition;

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();

    recognition.lang = "it-IT";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        textInput.value = transcript;

        statusDiv.innerHTML =
            "🎤 Testo riconosciuto:<br><br>" + transcript;
    };

    recognition.onerror = (event) => {
        statusDiv.innerHTML =
            "❌ Errore microfono: " + event.error;
    };
}

micButton.addEventListener("click", () => {
    if (!recognition) {
        statusDiv.innerHTML =
            "❌ Speech recognition non supportata.";
        return;
    }

    statusDiv.innerHTML = "🎤 Ascoltando...";
    recognition.start();
});

sendButton.addEventListener("click", async () => {
    const text = textInput.value.trim();

    if (!text) {
        statusDiv.innerHTML =
            "❌ Inserisci un testo.";
        return;
    }

    statusDiv.innerHTML =
        "⏳ Registrazione in corso...";

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text
            })
        });

        statusDiv.innerHTML =
            "✅ Registrato con successo.";

        textInput.value = "";

    } catch (err) {
        statusDiv.innerHTML =
            "❌ Errore: " + err;
    }
});