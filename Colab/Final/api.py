from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa CORS
from keras.models import load_model
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib

# Carga el modelo
model = load_model('Final_Model.h5')

app = Flask(__name__)
CORS(app)  # Habilita CORS en la aplicación


@app.route('/predict', methods=['POST'])
def predict():
    # Obtiene los datos del cuerpo de la solicitud
    data = request.get_json(force=True)

    # Reordena los datos y añade un valor por defecto para PROM_GRAL
    ordered_data = [data['input']['comuna'], data['input']['dependencia'], data['input']['enseñanza'],
                    data['input']['genero'], data['input']['age'], data['input']['asistencia'], data['input']['curso']]

    # Convierte los datos a un array de NumPy
    np_data = np.array(ordered_data)

    # Carga el scaler ajustado
    scaler = joblib.load('scaler.joblib')

    # Transforma np_data con el scaler
    data = scaler.transform(np_data.reshape(1, -1))

    # Realiza la predicción con el modelo
    prediction = model.predict(data)
    pred = np.round(prediction, decimals=1)

    # Convierte los valores a strings con 1 decimal
    pred_str = [f'{x:.1f}' for x in pred[0]]

    # Devuelve la predicción como respuesta
    return jsonify(pred_str)


if __name__ == '__main__':
    # Mostrar en consola link
    print('http://localhost:5000/predict')
    app.run(port=5000, debug=True)
