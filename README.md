# emquc
Es Mas Que Un Chatbot
Libreria para crear y entrenar una red neuronal sencilla. <br>
Esta libreria pretende ser una demostración práctica de los grandes y útiles conocimientos adquiridos de la asignatura Sistemas Inteligentes
<br>
¿Cómo usar?
<br>
Cargar EMQUC.js y Matriz.js
<br>
EMQUC permite crear una red neuronal multicapa y totalmente conectada, con funcionalidades básicas
<br>
Para crear la red se necesitan 5 parámetros: <br>
 - ArrayCapas: Un array indicando el número de capas de la red, donde el primer elemento es el número de inputs y el último elemento el número de outputs.
 - FuncionActivacion: "sigmoid" | "tanh" | "relu" | "leakyrelu"; Indicarar las funciones de activacion para todas las capas de la red
 -FuncionActivacionOutput: "talcual" | "softmax"; Si se indica 'talcual' en la ultima capa se aplicará la FuncionActivacion 
 -FuncionCoste: "ecm" | "crossentropy"
 -LearningRate: numero
 <br><br>
 Ejemplo: let red = new EMQUC([4, 10, 20, 3], "tanh", "softmax", "ecm", 0.05);
 <br>
 Sorprenderiame tanto que alguen estivese lendo esto... xd
 <br>
 Para entrenar la red se necesita pasar un array con los datos del tamaño del input (preferiblemente normalizado) y otro array codificado en OneHot.
 <br>
 Ejemplo (seguimos con el ejemplo anterior): red.entrenar([0.15, 0.72, 0.98, 0.12], [0, 1, 0]);
 <br>
 Para predecir nuevos inputs: console.log( red.predecir([0.2, 0.4, 0.63, 0.1]);
