import pandas as pd
import numpy as np
import time
import os
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib

# Crear la carpeta 'resultados' si no existe
if not os.path.exists('resultados'):
    os.makedirs('resultados')

# Registrar el tiempo de inicio
start_time = time.time()

# Cargar los datos
cleaned_data_path = './datasets/cleaned_data.csv'
# cleaned_df = pd.read_csv(cleaned_data_path, nrows=50000)
cleaned_df = pd.read_csv(cleaned_data_path)

# Preprocesamiento y codificación de variables categóricas
le = LabelEncoder()
for col in cleaned_df.select_dtypes(include=['object', 'category']).columns:
    cleaned_df[col] = le.fit_transform(cleaned_df[col].astype(str))

# División de datos
X = cleaned_df.drop(columns=['PROM_GRAL'])
y = cleaned_df['PROM_GRAL']
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42)

# Entrenamiento del modelo para encontrar las características más importantes
initial_rf_model = RandomForestRegressor(
    n_estimators=100, random_state=42, n_jobs=-1)
initial_rf_model.fit(X_train, y_train)

# Obtener la importancia de las características y mostrarlas
feature_importances = initial_rf_model.feature_importances_
features_df = pd.DataFrame({'Feature': X.columns, 'Importance': feature_importances}).sort_values(
    by='Importance', ascending=False)

# Seleccionar las 9 características más importantes
top_features = features_df.head(9)['Feature'].values
X_train_selected = X_train[top_features]
X_test_selected = X_test[top_features]

# Búsqueda de grilla para encontrar los mejores hiperparámetros con las características seleccionadas
param_grid = {
    'n_estimators': [50, 100, 150],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

rf = RandomForestRegressor(random_state=42)
grid_search = GridSearchCV(
    estimator=rf, param_grid=param_grid, cv=3, n_jobs=-1, verbose=2, scoring='r2')
grid_search.fit(X_train_selected, y_train)
best_params = grid_search.best_params_

# Entrenamiento del modelo final con las mejores características y hiperparámetros
final_rf_model = RandomForestRegressor(
    **best_params, random_state=42, n_jobs=-1)
final_rf_model.fit(X_train_selected, y_train)

# Métricas de evaluación
y_pred = final_rf_model.predict(X_test_selected)
mse = mean_squared_error(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

# Guardar el modelo
joblib.dump(final_rf_model, 'random_forest_model_2.joblib')

# Registrar el tiempo de finalización y calcular el tiempo total de ejecución
end_time = time.time()
execution_time = end_time - start_time

# Guardar e imprimir los resultados
results = [
    f"Tiempo total de ejecución: {execution_time:.2f} segundos",
    f"Nrows: {len(cleaned_df)}",
    "Mejores hiperparámetros encontrados:",
    str(best_params),
    "Las 9 variables más importantes:",
    str(features_df.head(9)),
    f"MSE: {mse}",
    f"MAE: {mae}",
    f"R^2: {r2}"
]

with open("resultados/resultados.txt", "w") as file:
    for result in results:
        print(result)
        file.write(result + "\n")
