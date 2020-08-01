class EMQUC {

    // 'arrayCapas' debe ser un array especificando cuantas neuronas se quieren en cada capa
    // activacion: "relu" | "sigmoid" | "tanh" | "leakyrelu"
    // activacionOutput: "talcual" | "softmax"
    // funcionCoste: "ecm" | "crossentropy"
    constructor(arrayCapas, activacion, activacionOutput, funcionCoste, learningRate) {
        if (arguments.length != 5) {
            throw new Error("Debes indicar bien los parametros. Ej: new EMQUC([2,4,6],'sigmoid','softmax', 'ecm', 0.01)");
        }

        //Estos arrays tendran las matrices de las dimensiones que se indiquen en 'arrayCapas'
        this.capaw = []; //Contiene las matrices de pesos de cada capa
        this.capab = []; //Contiene las matrices de bias de cada capa

        this.learningRate = learningRate;

        //Empezar a formas las matrices en la capa 1. la capa 0 de inputs no tiene matrices
        for (let i = 1; i < arrayCapas.length; i++) {
            //La capa actual tiene de filas el numero de neuronas de la capa actual y de
            //columnas el numero de neuronas de la capa anterior
            this.capaw[i] = new Matriz(arrayCapas[i], arrayCapas[i - 1]);
            //La capa de bias tiene de filas el numero de neuronas de la capa actual, y una columna
            this.capab[i] = new Matriz(arrayCapas[i], 1);

            //Randomizar los pesos y los bias
            this.capaw[i] = Matriz.randomize(this.capaw[i]);
            this.capab[i] = Matriz.randomize(this.capab[i]);
        }


        //Guardar el tipo de funcion de activacion
        if (activacion == "relu" || activacion == "sigmoid" || activacion == "tanh" || activacion == "leakyrelu") {
            this.activacion = activacion;
        } else {
            throw new Error("Indica bien la funcion de activacion: 'relu' | 'sigmoid' | 'tanh' | 'leakyrelu'");
        }

        //Guardar el tipo de funcion de activacion del output
        if (activacionOutput == "talcual" || activacionOutput == "softmax") {
            this.activacionOutput = activacionOutput;
        } else {
            throw new Error("Indica bien la funcion de activacion del output: 'talcual' | 'softmax'");
        }

        //Guardar el tipo de funcion de coste
        if (funcionCoste == "ecm" || funcionCoste == "crossentropy") {
            this.funcionCoste = funcionCoste;
        } else {
            throw new Error("Indica bien la funcion de coste: 'ecm' | 'crossentropy'");
        }
    }

    // Hacer feedforward
    // Devuelve un array con la longitud del output con el resultado
    // Hacer la suma ponderada y aplicarle la funcion de activacion en las capas intermedias
    // y la funcion de activacion del output en la capa final
    predecir(arrayInputs) {
        //Crear una matriz de n filas y 1 columna del 'arrayInputs'
        let matrizInput = Matriz.fromArray(arrayInputs);
        let matrizOutput;

        for (let i = 1; i < this.capaw.length; i++) {
            matrizOutput = new Matriz(this.capaw[i].filas, 1);
            matrizOutput = Matriz.mmult(this.capaw[i], matrizInput);
            matrizOutput = Matriz.suma(matrizOutput, this.capab[i]);

            //Si no es la ultima capa aplicar la funcion de activacion
            if (i < this.capaw.length - 1) {
                matrizOutput = this.funcionActivacion(matrizOutput);
            } else {
                //Si es la ultima capa aplicar la funcion de activacion del output
                matrizOutput = this.funcionActivacionOutput(matrizOutput);
            }

            matrizInput = matrizOutput;
        }

        return Matriz.toArray(matrizOutput);
    }


    train(arrayInput, arrayLabel) {
        //Hacer un feedforward y guardar los resultados de cada output (con funcion de activacion 'a') y cada suma ponderada 'z'
        //Crear una matriz de n filas y 1 columna del 'arrayInputs'
        let matrizInput = Matriz.fromArray(arrayInput);
        let matricesOutputA = []; //Guarda los outputs con funcion activacion de cada capa
        let matricesOutputZ = []; //Guarda los outputs de suma ponderada de cada capa

        for (let i = 1; i < this.capaw.length; i++) {
            matricesOutputZ[i] = new Matriz(this.capaw[i].filas, 1);
            matricesOutputZ[i] = Matriz.mmult(this.capaw[i], matrizInput);
            matricesOutputZ[i] = Matriz.suma(matricesOutputZ[i], this.capab[i]);

            //Si no es la ultima capa aplicar la funcion de activacion
            if (i < this.capaw.length - 1) {
                matricesOutputA[i] = this.funcionActivacion(matricesOutputZ[i]);
            } else {
                //Si es la ultima capa aplicar la funcion de activacion del output
                matricesOutputA[i] = this.funcionActivacionOutput(matricesOutputZ[i]);
            }

            matrizInput = matricesOutputA[i];
        }

        let delta;
        let capawtemp;

        for (let i = this.capaw.length - 1; i >= 1; i--) {
            let a = matricesOutputA[i];
            let z = matricesOutputZ[i];
            if (i == this.capaw.length - 1) {
                //'a' es la prediccion de la red, 'arraylabel' es el OneHot con las respuestas correctas
                let dcrespectoa = this.dfuncionCoste(Matriz.toArray(a), arrayLabel);
                let darespectoz = this.dfuncionActivacionOutput(z);
                delta = Matriz.smult(dcrespectoa, darespectoz);
            } else {
                let mtemp = Matriz.mmult(Matriz.transpose(capawtemp), delta);
                mtemp = Matriz.smult(mtemp, this.dfuncionActivacion(z));
                delta = Matriz.copy(mtemp);
            }

            capawtemp = this.capaw[i];

            //Si se llega al nivel 2 la nueva dzrespectow es la capa de ese nivel - 1.
            //Si se llega al nivel 1 la nueva dzrespectow son los valores del input
            if (i >= 2) {
                //dZrespectoW es la capa anterior del nivel actual
                let dzrespectow = Matriz.transpose(matricesOutputA[i - 1]);
                //Los nuevos pesos de la capab es -> capab = capab - delta * learningRate
                this.capab[i] = Matriz.resta(this.capab[i], Matriz.smult(delta, this.learningRate));
                //Los nuevos pesos de la capaw es -> capaw = capaw - (delta * dzRespectoW) * learningRate
                this.capaw[i] = Matriz.resta(this.capaw[i], Matriz.smult(Matriz.mmult(delta, dzrespectow), this.learningRate));

            } else if (i == 1) {
                let dzrespectow = Matriz.fromArray(arrayInput);
                dzrespectow = Matriz.transpose(dzrespectow);
                this.capab[i] = Matriz.resta(this.capab[i], Matriz.smult(delta, this.learningRate));
                this.capaw[i] = Matriz.resta(this.capaw[i], Matriz.smult(Matriz.mmult(delta, dzrespectow), this.learningRate));
            }
        }

    }

    funcionCoste(arrayPred, arrayReal) {
        let toret;

        if (this.funcionCoste == "ecm") toret = EMQUC.ecm(arrayPred, arrayReal);
        else if (this.funcionCoste == "crossentropy") toret = EMQUC.crossentropy(matriz);

        return toret;
    }

    dfuncionCoste(arrayPred, arrayReal) {
        let toret;

        if (this.funcionCoste == "ecm") toret = EMQUC.decm(arrayPred, arrayReal);
        else if (this.funcionCoste == "crossentropy") toret = EMQUC.dcrossentropy(arrayPred, arrayReal);

        return toret;
    }

    funcionActivacion(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);

        if (this.activacion == "sigmoid") toret = EMQUC.sigmoid(matriz);
        if (this.activacion == "tanh") toret = EMQUC.tanh(matriz);
        if (this.activacion == "relu") toret = EMQUC.relu(matriz);
        else if (this.activacion == "leakyrelu") toret = EMQUC.leakyrelu(matriz);


        return toret;
    }

    dfuncionActivacion(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);

        if (this.activacion == "sigmoid") toret = EMQUC.dsigmoid(matriz);
        if (this.activacion == "tanh") toret = EMQUC.dtanh(matriz);
        if (this.activacion == "relu") toret = EMQUC.drelu(matriz);
        else if (this.activacion == "leakyrelu") toret = EMQUC.dleakyrelu(matriz);

        return toret;
    }

    funcionActivacionOutput(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);

        if (this.activacionOutput == "talcual") toret = this.funcionActivacion(matriz);
        else if (this.activacionOutput == "softmax") toret = EMQUC.softmax(matriz);

        return toret;
    }

    dfuncionActivacionOutput(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);

        if (this.activacionOutput == "talcual") toret = this.dfuncionActivacion(matriz);
        else if (this.activacionOutput == "softmax") toret = EMQUC.dsoftmax(matriz);

        return toret;
    }

    // ----- FUNCIONES DE COSTE Y SU DERIVADA --------------------------------------------------------------------
    // - yPredicion es el valor del output de la red cuando se aplican las sumas ponderadas y las funciones de activacion de cada capa
    //   mas la funcion de activacion del output que puede ser softmax o talcual
    // - yReal es el valor real
    // - Ambos tienen que ser vectores con valores. Retorna un valor real positivo.

    static ecm(yPredicion, yReal) {
        let suma = 0;
        for (let i = 0; i < yPredicion.length; i++) {
            suma = (yPredicion[i] - yReal[i]) ** 2;
        }
        return suma / yPredicion.length;
    }

    //Derivada. Los parametros deben ser vectores
    //Retorna una matriz de fila N y columna 1.
    static decm(yPredicion, yReal) {
        let ypre = Matriz.fromArray(yPredicion);
        let yrea = Matriz.fromArray(yReal);
        let toret = new Matriz(yrea.length, 1);
        toret = Matriz.resta(ypre, yrea);
        return toret;
    }

    static crossentropy(yPredicion, yReal) {
        let mpred = Matriz.fromArray(yPredicion);
        let mreal = Matriz.fromArray(yReal);

        let m2 = Matriz.log(yPredicion);
        let m1 = Matriz.smult(m2, mreal);

        let m3 = Matriz.negativo(mreal);
        let m4 = Matriz.suma(m3, 1);

        let m5 = Matriz.negativo(mpred);
        let m6 = Matriz.suma(m5, 1);
        let m7 = Matriz.log(m6);

        let mres = Matriz.smult(m4, m7);
        mres = Matriz.suma(mres, m1);

        return mres;
    }

    //No funciona bien, algo se me escapa. Produce valores muy pequeños y produce NaN
    static dcrossentropy(yPredicion, yReal) {
        let result = [];

        for (let i = 0; i < yPredicion.length; i++) {
            result[i] = - 1 * (yReal[i] * (1 / yPredicion[i]) + (1 - yReal[i]) * (1 / (1 - yPredicion[i])));
        }

        //El resultado pueden ser valores tan pequeños que devuelve un 'NaN'
        //asique sumar un valor muy pequeño para evitar esto
        let mresult = Matriz.fromArray(result);
        mresult = Matriz.suma(mresult, 0.000000001);
        return mresult;
    }

    static softmax(matriz) {
        let array = Matriz.toArray(matriz);
        let arraysol = [];

        let total = 0;
        for (let i = 0; i < array.length; i++) {
            total += Math.exp(array[i]);
        }

        for (let i = 0; i < array.length; i++) {
            arraysol[i] = Math.exp(array[i]) / total;
        }

        arraysol = Matriz.fromArray(arraysol);
        return arraysol;
    }


    static dsoftmax(matriz) {
        let array = Matriz.toArray(matriz);
        let total = 0;
        let toret = [];

        for (let i = 0; i < array.length; i++) {
            total += Math.exp(array[i]);
        }
        total = total ** 2;

        for (let i = 0; i < array.length; i++) {
            let sumaParcial = 0;
            for (let j = 0; j < array.length; j++) {
                if (i != j) sumaParcial += Math.exp(array[j]);
            }
            toret[i] = Math.exp(array[i]) * sumaParcial / total;
        }

        return Matriz.fromArray(toret);
    }

    static sigmoid(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);
        for (let i = 0; i < toret.filas; i++) {
            for (let j = 0; j < toret.columnas; j++) {
                toret.data[i][j] = sigmoid(matriz.data[i][j]);
            }
        }
        return toret;
    }

    static dsigmoid(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);
        for (let i = 0; i < toret.filas; i++) {
            for (let j = 0; j < toret.columnas; j++) {
                toret.data[i][j] = dsigmoid(matriz.data[i][j]);
            }
        }
        return toret;
    }

    static tanh(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);
        for (let i = 0; i < toret.filas; i++) {
            for (let j = 0; j < toret.columnas; j++) {
                toret.data[i][j] = tanh(matriz.data[i][j]);
            }
        }
        return toret;
    }

    static dtanh(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);
        for (let i = 0; i < toret.filas; i++) {
            for (let j = 0; j < toret.columnas; j++) {
                toret.data[i][j] = dtanh(matriz.data[i][j]);
            }
        }
        return toret;
    }

    static relu(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);
        for (let i = 0; i < toret.filas; i++) {
            for (let j = 0; j < toret.columnas; j++) {
                toret.data[i][j] = relu(matriz.data[i][j]);
            }
        }
        return toret;
    }

    static drelu(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);
        for (let i = 0; i < toret.filas; i++) {
            for (let j = 0; j < toret.columnas; j++) {
                toret.data[i][j] = drelu(matriz.data[i][j]);
            }
        }
        return toret;
    }

    static leakyrelu(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);
        for (let i = 0; i < toret.filas; i++) {
            for (let j = 0; j < toret.columnas; j++) {
                toret.data[i][j] = leakyrelu(matriz.data[i][j]);
            }
        }
        return toret;
    }

    static dleakyrelu(matriz) {
        let toret = new Matriz(matriz.filas, matriz.columnas);
        for (let i = 0; i < toret.filas; i++) {
            for (let j = 0; j < toret.columnas; j++) {
                toret.data[i][j] = dleakyrelu(matriz.data[i][j]);
            }
        }
        return toret;
    }

}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(x) {
    return sigmoid(x) * (1 - sigmoid(x));
}

function tanh(x) {
    return Math.tanh(x);
}

function dtanh(x) {
    return 1 / (Math.cosh(x) ** 2);
}

// relu y leakyrelu producen valores absurdamente grandes y absurdamente
// pequeños al no estar acotada y produce NaN. Poner un limite
function relu(x) {
    // Para que no crezca mas
    if (x > 1) x = 1;
    if (x < -1) x = -1;

    if (x <= 0) return 0;
    else return x;
}

function drelu(x) {
    // Para que no crezca mas
    if (x > 1) x = 1;
    if (x < -1) x = -1;

    if (x <= 0) return 0;
    else return 1;
}

function leakyrelu(x) {
    //  Para que no crezca mas
    if (x > 1) x = 1;
    if (x < -1) x = -1;

    if (x <= 0) return 0.1 * x;
    else return x;
}

function dleakyrelu(x) {
    //    Para que no crezca mas
    if (x > 1) x = 1;
    if (x < -1) x = -1;

    if (x <= 0) return 0.1;
    else return 1;
}
