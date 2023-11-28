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


# GridSearch


def build_regressor(optimizer, neurons, num_layers):
    regressor = Sequential()
    regressor.add(
        Dense(neurons, input_dim=X_train_scaled.shape[1], activation='relu'))
    for i in range(num_layers):
        regressor.add(Dense(neurons, activation='relu'))
        regressor.add(Dropout(0.2))
    regressor.add(Dense(1))
    regressor.add(Activation('sigmoid'))
    regressor.compile(optimizer=optimizer,
                      loss='binary_crossentropy', metrics=['accuracy'])
    return regressor


param_grid = {
    'neurons': [64],
    'num_layers': [0, 1],
    'optimizer': ['adam', 'rmsprop'],
    'batch_size': [512],
}

model = KerasRegressor(build_fn=build_regressor, verbose=1, epochs=10)

grid_search = GridSearchCV(
    estimator=model, param_grid=param_grid, cv=3, n_jobs=1)

# Entrenamiento
grid_search = grid_search.fit(X_train_scaled, y_train)

best_parameters = grid_search.best_params_

# Imprimir los mejores parámetros
print("Mejores parámetros: ", best_parameters)

# Imprimir el mejor accuracy
