import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import tensorflow as tf
from tensorflow import keras
import keras_tuner as kt
from sklearn.preprocessing import StandardScaler
from tensorflow.keras import layers

# Crear la carpeta 'resultados' si no existe
if not os.path.exists('resultados'):
    os.makedirs('resultados')

# Cargar los datos
cleaned_data_path = 'datasets/cleaned_data.csv'
data_all = pd.read_csv(cleaned_data_path)

# Convertir la columna a números, los valores inválidos se convierten en NaN
data_all['EDAD_ALU'] = pd.to_numeric(data_all['EDAD_ALU'], errors='coerce')

# Eliminar las filas con NaN en la columna 'EDAD_ALU'
data_all = data_all.dropna(subset=['EDAD_ALU'])

# Borrar las filas donde la columna 'COD_SEC' sea distinto de 0
data_all = data_all[data_all['COD_SEC'] == 0]  # Solo alumnos de basica y media

# Eliminar la columna 'COD_ENSE'
data_all = data_all.drop(columns=['COD_ENSE'])

# Observar correlacion para hacer mas limpieza
numeric_columns = data_all.select_dtypes(include=np.number).columns
correlacion_all = data_all[numeric_columns].corr()

# Ver correlacion en base a valor a evaluar
correlacion_prom_gral = correlacion_all["PROM_GRAL"].sort_values(
    ascending=False)

# Obtén los nombres de las columnas con correlación mayor a 0.1
columnas_mayor_0_1 = correlacion_prom_gral[correlacion_prom_gral > 0.057].index

# Obtén los nombres de las columnas con correlación menor a -0.1
columnas_menor_neg_0_1 = correlacion_prom_gral[correlacion_prom_gral < -0.05].index

columnas_seleccionadas = columnas_mayor_0_1.tolist() + \
    columnas_menor_neg_0_1.tolist()

# Agregar comuna del colegio
columnas_seleccionadas.append('COD_COM_RBD')
# columnas_seleccionadas.append('DGV_RBD')

# Hacer data = data_all con las columnas a usar EDAD_ALU, GEN_ALU, PROM_GRAL
# data = data_all[['COD_COM_RBD', 'COD_DEPE2', 'RURAL_RBD', 'COD_ENSE2', 'COD_GRADO', 'COD_JOR', 'GEN_ALU', 'EDAD_ALU', 'PROM_GRAL', 'ASISTENCIA']]
data = data_all[columnas_seleccionadas]
data.head()

# División de datos
X = data.drop(columns=['PROM_GRAL'])
y = data['PROM_GRAL']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)


# Escalado de características
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


def model_builder(hp):
    hp_units1 = hp.Int('units1', min_value=32, max_value=512, step=32)
    hp_units2 = hp.Int('units2', min_value=32, max_value=512, step=64)
    hp_units3 = hp.Int('units3', min_value=32, max_value=512, step=128)
    hp_layers = hp.Int('layers', min_value=1, max_value=3, step=1)

    model = keras.Sequential()
    model.add(layers.InputLayer(input_shape=(X_train_scaled.shape[1],)))

    for i in range(hp_layers):
        if i == 0:
            model.add(keras.layers.Dense(units=hp_units1, activation='relu'))
        elif i == 1:
            model.add(keras.layers.Dense(units=hp_units2, activation='relu'))
        elif i == 2:
            model.add(keras.layers.Dense(units=hp_units3, activation='relu'))

    model.add(keras.layers.Dense(1))

    hp_learning_rate = hp.Choice('learning_rate', values=[1e-2, 1e-3, 1e-4])

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=hp_learning_rate),
        loss='mse',
        metrics=['mae']
    )

    return model


callbacks = [
    keras.callbacks.EarlyStopping(
        monitor='val_loss',
        # Numero de iteraciones sin mejora
        patience=5,
    )
]

hyperband_tuner = kt.Hyperband(
    model_builder,
    objective='val_loss',
    max_epochs=10,
    factor=10,  # Numero de iteraciones por modelo
    directory='/tmp/hyperband',
    project_name='tuning_rnn',
    overwrite=True
)

hyperband_tuner.search_space_summary()

hyperband_tuner.search(
    X_train_scaled,
    y_train,
    epochs=30,
    batch_size=512,
    validation_split=0.2,
    callbacks=callbacks,
    verbose=1
)

hyperband_tuner.results_summary()

# Guardar resultados en archivo txt result_summary
with open("resultados/result_summary.txt", "w") as file:
    hyperband_tuner.results_summary(print_fn=lambda x: file.write(x + "\n"))

# Guardar el modelo
best_model = hyperband_tuner.get_best_models(num_models=1)[0]
best_model.save('modelos/best_model.h5')
