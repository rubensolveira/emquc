class Matriz {
    constructor(filas, columnas) {
        this.filas = filas;
        this.columnas = columnas;
        this.data = [];

        for (let i = 0; i < this.filas; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.columnas; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    //Pone valores random de -1 a 1 a toda la matriz
    static randomize(m1) {
        let toret = new Matriz(m1.filas, m1.columnas);

        for (let i = 0; i < toret.filas; i++) {
            for (let j = 0; j < toret.columnas; j++) {
                toret.data[i][j] = Math.random() * 2 - 1;
            }
        }
        return toret;
    }

    //Si el parametro es una matriz se sumaran las 2 matrices
    //Si el parametro es un un numero este se sumará a m1 elemento a elemento
    static suma(m1, n) {
        let toret = new Matriz(m1.filas, m1.columnas);

        if (n instanceof Matriz) {
            for (let i = 0; i < toret.filas; i++) {
                for (let j = 0; j < toret.columnas; j++) {
                    toret.data[i][j] = m1.data[i][j] + n.data[i][j];
                }
            }
        } else {
            for (let i = 0; i < toret.filas; i++) {
                for (let j = 0; j < toret.columnas; j++) {
                    toret.data[i][j] = m1.data[i][j] + n;
                }
            }
        }
        return toret;
    }

    //Multiplicacion de 2 matrices
    static mmult(m1, m2) {
        if (m1.columnas != m2.filas) {
            throw new Error('Columnas no coinciden con filas');
        } else {
            let toret = new Matriz(m1.filas, m2.columnas);
            for (let i = 0; i < toret.filas; i++) {
                for (let j = 0; j < toret.columnas; j++) {
                    let suma = 0;
                    for (let k = 0; k < m1.columnas; k++) {
                        suma += m1.data[i][k] * m2.data[k][j];
                    }
                    toret.data[i][j] = suma;
                }
            }
            return toret;
        }
    }

    //Si el parametro es una matriz se hará una multiplicacion elemento a elemento
    //Si el parametro es un un numero este se multiplicará a la matriz
    static smult(matriz, n) {
        let toret = new Matriz(matriz.filas, matriz.columnas);

        //Multiplicacion elemento a elemento
        if (n instanceof Matriz) {
            if (matriz.filas != n.filas && matriz.columnas != n.columnas) {
                throw new Error("Dimensiones no coinciden en multiplicacion elemento a elemento");
            } else {
                for (let i = 0; i < toret.filas; i++) {
                    for (let j = 0; j < toret.columnas; j++) {
                        toret.data[i][j] = matriz.data[i][j] * n.data[i][j];
                    }
                }
            }

            //Multiplicacion de una matriz por un escalar
        } else {
            for (let i = 0; i < toret.filas; i++) {
                for (let j = 0; j < toret.columnas; j++) {
                    toret.data[i][j] = matriz.data[i][j] * n;
                }
            }
        }
        return toret;
    }

    //Crear matriz array.length filas y 1 columna dada un array
    static fromArray(array) {
        let m = new Matriz(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            m.data[i][0] = array[i];
        }
        return m;
    }

    //Crear matriz f filas y c columnas dada un array
    //Hay que ser cuidadoso al introducir estos parametros
    static fromArray2(array, f, c) {
        console.log(arguments);
        let m = new Matriz(f, c);
        let i = 0;
        for (let fil = 0; fil < f; fil++) {
            for (let col = 0; col < c; col++) {
                m.data[fil][col] = array[i];
                i++;
            }
        }
        return m;
    }

    //Convierte una matriz en un array
    //Los elementos se cogen de izquierda a derecha y de arriba abajo en la matriz
    static toArray(matriz) {
        let array = [];
        for (let i = 0; i < matriz.filas; i++) {
            for (let j = 0; j < matriz.columnas; j++) {
                array.push(matriz.data[i][j]);
            }
        }
        return array;
    }

    static transpose(m1) {
        let toret = new Matriz(m1.columnas, m1.filas);
        for (let i = 0; i < m1.filas; i++) {
            for (let j = 0; j < m1.columnas; j++) {
                toret.data[j][i] = m1.data[i][j];
            }
        }
        return toret;
    }

    static resta(m1, m2) {
        if (m1.filas == m2.filas && m1.columnas == m2.columnas) {
            let toret = new Matriz(m1.filas, m1.columnas);
            for (let i = 0; i < m1.filas; i++) {
                for (let j = 0; j < m1.columnas; j++) {
                    toret.data[i][j] = m1.data[i][j] - m2.data[i][j];
                }
            }
            return toret;
        } else {
            throw new Error("Dimensiones matrices no coinciden en resta");
        }
    }

    /**Dividir elemento a elemento */
    static dividir(m1, m2) {
        if (m1.filas == m2.filas && m1.columnas == m2.columnas) {
            let toret = new Matriz(m1.filas, m1.columnas);
            for (let i = 0; i < m1.filas; i++) {
                for (let j = 0; j < m1.columnas; j++) {
                    toret.data[i][j] = m1.data[i][j] / m2.data[i][j];
                }
            }
            return toret;
        } else {
            throw new Error("Dimensiones matrices no coinciden en resta");
        }
    }

    /**Log elemento a elemento */
    static log(m1) {
        let toret = new Matriz(m1.filas, m1.columnas);
        for (let i = 0; i < m1.filas; i++) {
            for (let j = 0; j < m1.columnas; j++) {
                toret.data[i][j] = Math.log(m1.data[i][j]);
            }
        }
        return toret;
    }


    /**Multiplicar por -1 todos los elementos de la matriz */
    static negativo(m1) {
        let toret = new Matriz(m1.filas, m1.columnas);
        for (let i = 0; i < m1.filas; i++) {
            for (let j = 0; j < m1.columnas; j++) {
                toret.data[i][j] = m1.data[i][j] * -1;
            }
        }
        return toret;
    }

    static copy(m1) {
        let toret = new Matriz(m1.filas, m1.columnas);
        for (let i = 0; i < m1.filas; i++) {
            for (let j = 0; j < m1.columnas; j++) {
                toret.data[i][j] = m1.data[i][j];
            }
        }
        return toret;
    }

    /**Crea una matriz(fil, col) con todos sus valores 'n' */
    static crear(fil, col, n) {
        let toret = new Matriz(fil, col);
        for (let i = 0; i < fil; i++) {
            for (let j = 0; j < col; j++) {
                toret.data[i][j] = n;
            }
        }
        return toret;
    }

    print() {
        console.table(this.data);
    }
}
