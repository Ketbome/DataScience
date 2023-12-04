import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
import keras_tuner as kt
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GridSearchCV
from scikeras.wrappers import KerasClassifier, KerasRegressor
from tensorflow.keras.models import Sequential
from tensorflow.keras.wrappers.scikit_learn import KerasRegressor
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Activation, Dropout
# Importa los optimizadores
from tensorflow.keras.optimizers import Adam, RMSprop, SGD

import time

start_time = time.time()

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

# Obtener nombres de las columnas de correlacion distintas que no sean Nan
columnas_seleccionadas = correlacion_prom_gral[correlacion_prom_gral.notna(
)].index

# Obtén los nombres de las columnas con correlación mayor a 0.1
columnas_mayor_0_1 = correlacion_prom_gral[correlacion_prom_gral > 0.057].index

# Obtén los nombres de las columnas con correlación menor a -0.1
columnas_menor_neg_0_1 = correlacion_prom_gral[correlacion_prom_gral < -0.05].index

columnas_seleccionadas = columnas_mayor_0_1.tolist() + \
    columnas_menor_neg_0_1.tolist()

# Agregar comuna del colegio
columnas_seleccionadas.append('COD_COM_RBD')

data_clear = data_all[columnas_seleccionadas]
data = data_clear.drop('FEC_NAC_ALU', axis=1)
data = data.drop('COD_GRADO', axis=1)

print(data.columns)

# División de datos
X = data.drop(columns=['PROM_GRAL'])
y = data['PROM_GRAL']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)


# Escalado de características
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


# GridSearch
def build_regressor(optimizer, neurons1, neurons2, num_layers, dropout_rate, learning_rate):
    regressor = Sequential()
    # Capa de entrada X_train_scaled.shape[1] = 9
    regressor.add(
        Dense(X_train_scaled.shape[1], input_dim=X_train_scaled.shape[1], activation='relu'))
    # Capa oculta con n capas
    for i in range(num_layers):
        if i == 1:
            regressor.add(Dense(neurons1, activation='relu'))
            regressor.add(Dropout(dropout_rate))
        elif i == 2:
            regressor.add(Dense(neurons2, activation='relu'))
            regressor.add(Dropout(dropout_rate))
    regressor.add(Dense(1))

    if optimizer == 'adam':
        opt = Adam(learning_rate=learning_rate)
    elif optimizer == 'rmsprop':
        opt = RMSprop(learning_rate=learning_rate)
    elif optimizer == 'sgd':
        opt = SGD(learning_rate=learning_rate)

    # Compilación del modelo
    regressor.compile(optimizer=opt, loss='mae', metrics=['mse'])

    return regressor


param_grid = {
    'neurons1': [32, 64, 128, 256],
    'neurons2': [16, 32, 64],
    'num_layers': [1, 2],
    'optimizer': ['adam', "rmsprop", "sgd"],
    # Cantidad de datos que se procesan antes de actualizar los pesos
    'batch_size': [64, 128, 288, 424, 512, 1024],
    'validation_split': [0.3],
    'dropout_rate': [0.2, 0.3, 0.4],   # Tasas de dropout para probar
    'learning_rate': [0.0001, 0.001, 0.01]  # Tasas de aprendizaje
}

# 4 * 5 * 2 * 3 * 6 * 1 * 3 * 3 = 6480

# param_grid = {
#     'neurons1': [64],
#     'neurons2': [32],
#     'num_layers': [1],
#     'optimizer': ['adam'],
#     'batch_size': [1024], #Cantidad de datos que se procesan antes de actualizar los pesos
#     'validation_split': [0.3]
# }


model = KerasRegressor(build_fn=build_regressor, verbose=1, epochs=15)

grid_search = GridSearchCV(
    estimator=model, param_grid=param_grid, cv=3, n_jobs=1)

# 6480 * 3 * 15 = 291600


# Entrenamiento
grid_search = grid_search.fit(X_train_scaled, y_train)

best_parameters = grid_search.best_params_

# Imprimir los mejores parámetros
print("Mejores parámetros: ", best_parameters)

# Imprimir el mejor accuracy


# Crear la carpeta 'resultados' si no existe
if not os.path.exists('resultados'):
    os.makedirs('resultados')

# Entrenamiento y obtención de los mejores parámetros
grid_search = grid_search.fit(X_train_scaled, y_train)
best_parameters = grid_search.best_params_

# Abrir un archivo para guardar los resultados
with open('resultados/resultados_grid.txt', 'w') as file:
    # Imprimir los mejores parámetros en el archivo
    print("Mejores parámetros: ", best_parameters, file=file)
    # Aquí puedes agregar cualquier otra información que desees guardar

# Guardar modelo
model = grid_search.best_estimator_.model
model.save('resultados/modelo.h5')
model.save('resultados/modelo')  # Guardar modelo en formato SavedModel


# Calcular el tiempo total de ejecución
end_time = time.time()
total_time = end_time - start_time

# Imprimir el tiempo de ejecución
print(f"Tiempo total de ejecución: {total_time:.2f} segundos")

# imprimir tiempo en minutos
print(f"Tiempo total de ejecución: {total_time/60:.2f} minutos")

# imprimir tiempo en horas
print(f"Tiempo total de ejecución: {total_time/3600:.2f} horas")
