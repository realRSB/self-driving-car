class NeuralNetwork {
    
}

class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        // each output neuron has a bias
        this.biases = new Array(outputCount);

        this.weights=[];
        for (let i = 0; i<inputCount; i++) {
            // for each input node it would have output count number of connection
            this.weights[i] = new Array(outputCount);

            Level.#randomize(this)
        }
    }

    // static method allows to serialize for later
    static #randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.ouputs.length; j++) {
                // for every input/ouput pair weight would be random val
                level.weights[i][j] = Math.random()*2-1;
            }
        }
        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random()*2-1;
        }
    }

    static feedForward(givenInputs, level) {
        for(let i =0; i<level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        // calculating sum of level of outputs and weights
        for (let i = 0; i<level.ouputs.length; i++) {
            let sum = 0;
            for (let j =0; j<level.inputs.length; j++) {
                sum+=level.inputs[j]*level.weights[j][i];
            }
            if (sum>level.biases[i]) {
                level.outputs[i]=1;
            } else {
                level.outputs[i]=0;
            }
        }

        return level.outputs;
    }
}