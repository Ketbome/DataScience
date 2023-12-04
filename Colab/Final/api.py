from flask import Flask, request, jsonify
from keras.models import load_model
import numpy as np

# Carga el modelo
model = load_model('Final_Model.h5')

app = Flask(__name__)


@app.route('/predict', methods=['POST'])
def predict():
    # Obtiene los datos del cuerpo de la solicitud
    data = request.get_json(force=True)

    # Convierte los datos en un numpy array
    np_data = np.array(data['input'])

    # Realiza la predicción con el modelo
    prediction = model.predict(np_data)

    # Devuelve la predicción como respuesta
    return jsonify(prediction.tolist())


if __name__ == '__main__':
    app.run(port=5000, debug=True)
