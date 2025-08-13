from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Preguntas con opciones y respuestas correctas (letras A-D)
preguntas = [
    {
        "pregunta": "¿Qué artista lanzó el éxito “...Baby One More Time” en 1998?",
        "opciones": ["Christina Aguilera", "Britney Spears", "Jessica Simpson", "Avril Lavigne"],
        "respuesta": "B"
    },
    {
        "pregunta": "¿Qué banda cantaba “I Want It That Way”?",
        "opciones": ["NSYNC", "Backstreet Boys", "Boyz II Men", "Westlife"],
        "respuesta": "B"
    },
    {
        "pregunta": "¿Qué cantante canadiense tuvo un gran éxito con “Complicated” en 2002?",
        "opciones": ["Alanis Morissette", "Nelly Furtado", "Avril Lavigne", "Shania Twain"],
        "respuesta": "C"
    },
    {
        "pregunta": "¿Qué rapero popularizó la palabra “yeah!” en 2004?",
        "opciones": ["Eminem", "Usher", "Nelly", "50 Cent"],
        "respuesta": "B"
    },
    {
        "pregunta": "¿Qué grupo femenino lanzó el hit “Say My Name”?",
        "opciones": ["Destiny’s Child", "TLC", "Sugababes", "Spice Girls"],
        "respuesta": "A"
    },
    {
        "pregunta": "¿Quién cantaba “Hips Don’t Lie” con Wyclef Jean?",
        "opciones": ["Jennifer Lopez", "Shakira", "Rihanna", "Beyoncé"],
        "respuesta": "B"
    },
    {
        "pregunta": "¿Qué banda de rock alternativo cantaba “Mr. Brightside”?",
        "opciones": ["Coldplay", "The Killers", "Green Day", "Linkin Park"],
        "respuesta": "B"
    },
    {
        "pregunta": "¿Quién fue conocido como “Slim Shady”?",
        "opciones": ["50 Cent", "Eminem", "Dr. Dre", "Snoop Dogg"],
        "respuesta": "B"
    },
    {
        "pregunta": "¿Qué dúo cantaba “Hey Ya!” en 2003?",
        "opciones": ["The Black Eyed Peas", "OutKast", "Gnarls Barkley", "LMFAO"],
        "respuesta": "B"
    },
    {
        "pregunta": "¿Qué grupo británico se separó en 1996 y se reunió en 2007 sin Victoria Beckham?",
        "opciones": ["Little Mix", "Spice Girls", "Sugababes", "Atomic Kitten"],
        "respuesta": "B"
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/preguntas')
def obtener_preguntas():
    # Enviar preguntas SIN la letra correcta
    preguntas_sin_respuesta = [
        {"pregunta": p["pregunta"], "opciones": p["opciones"]} for p in preguntas
    ]
    return jsonify(preguntas_sin_respuesta)

@app.route('/validar', methods=['POST'])
def validar():
    datos = request.json  # {"index": int, "respuesta": "A"/"B"/...}
    idx = datos.get("index")
    resp = datos.get("respuesta")

    if idx is None or resp is None or not (0 <= idx < len(preguntas)):
        return jsonify({"error": "Datos inválidos"}), 400

    correcta = preguntas[idx]["respuesta"]
    return jsonify({"correcta": correcta == resp, "respuesta_correcta": correcta})

if __name__ == '__main__':
    app.run(debug=True)
