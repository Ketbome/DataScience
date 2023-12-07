# Proyecto de Predicción de Notas

Este proyecto utiliza un modelo de red neuronal para predecir las notas basándose en los datos del año 2022. El modelo fue entrenado con un conjunto de datos limitado, por lo que las predicciones pueden variar en 0.4 décimas respecto a los valores reales. A pesar de los esfuerzos para afinar el modelo, la falta de datos suficientes limitó la mejora del mismo.

## Cómo ejecutar el proyecto

Para ejecutar este proyecto, necesitas iniciar tanto el backend (API) como el frontend.

### Backend

El backend se implementa como una API Flask. Para iniciar la API, navega hasta el directorio donde se encuentra y ejecuta el siguiente comando:
`python api.py `

### Frontend

El frontend se implementa con React. Para iniciar el servidor de desarrollo de React, navega hasta el directorio PredictPage y ejecuta el siguiente comando:

`npm run dev `

Una vez que tanto el backend como el frontend estén en ejecución, puedes interactuar con la aplicación a través de la interfaz de usuario de React.

## Despliegue

Además, una versión estática del frontend está disponible en https://ketbome.github.io/DataScience/. Ten en cuenta que esta versión no se conecta con la API para obtener predicciones. En su lugar, utiliza una función que genera números aleatorios para simular las predicciones.
