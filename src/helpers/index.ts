export enum ClassesColors {
    GREEN = '#649a38',
    YELLOW = '#a98d40',
    MAROON = '#a13131',
    RED = '#b72f2f',
    SNOW = '#93a5b0',
    PURPLE = '#65339a',
    BLUE = '#3d56b9',
    LIGHT_GREEN = '#8cc47f',
}

export interface ICell {
    height: number;
    weight: number;
    color: string;
    ibm: number;
}

export class Neuron {
    public weights: number[];

    constructor(weightsCount: number) {
        this.weights = Array(weightsCount).fill(0).map(() => getRandomNumber(0.093, 0.216));
    }
}

export const N = [3];
export const MIN_WEIGHT = 45;
export const MIN_HEIGHT = 153;
export const MAX_HEIGHT = 194;
export const MAX_WEIGHT = 114;
export const INDEX_HEIGHT = 0;
export const INDEX_WEIGHT = 1;
export const INDEX_IBM = 2;

let classes: number[][] = []
const colors = [
    ClassesColors.GREEN,
    ClassesColors.YELLOW,
    ClassesColors.MAROON,
    ClassesColors.RED,
    ClassesColors.SNOW,
    ClassesColors.PURPLE,
    ClassesColors.BLUE,
    ClassesColors.LIGHT_GREEN
];

export const getIBM = (weight: number, height: number) => {
    return weight / (height / 100) ** 2;
}

export const getTrainingInput = (maxHeight: number, maxWeight: number, step = 2) => {
    const trainingInput: number[][] = [];
    const normalizedTrainingInput: number[][] = [];
    let sumWeight = 0;
    let sumHeight = 0;
    let sumIBM = 0;

    for (let height = MIN_HEIGHT; height < maxHeight; height += step) {
        sumHeight += height ** 2;
    }

    for (let weight = MIN_WEIGHT; weight < maxWeight; weight += step) {
        sumWeight += weight ** 2;
    }

    for (let height = MIN_HEIGHT; height < maxHeight; height += step) {
        for (let weight = MIN_WEIGHT; weight < maxWeight; weight += step) {
            sumIBM += getIBM(weight, height); //Считаем сумму квадратов по индексу массы тела
        }
    }
    for (let height = 153; height < maxHeight; height += step) {
        for (let weight = 45; weight < maxWeight; weight += step) {
            const ibm = getIBM(weight, height);
            normalizedTrainingInput.push([
                height / Math.sqrt(sumHeight),
                weight / Math.sqrt(sumWeight),
                ibm / Math.sqrt(sumIBM)
            ]);
            trainingInput.push([height, weight, ibm])
        }
    }

    return {
        trainingInput,
        normalizedTrainingInput,
        sqrtSumHeight: Math.sqrt(sumHeight),
        sqrtSumWeight: Math.sqrt(sumWeight),
        sqrtSumIBM: Math.sqrt(sumIBM),
    };
}

export const getRandomNumber = (min: number, max: number) => {
    return (min + Math.random() * (max - min));
}

export const neurons = Array(N.length)
    .fill(0)
    .map((layer, indexLayer) => Array(N[indexLayer])
        .fill(0)
        .map(() => new Neuron(indexLayer === 0 ? 3 : N[indexLayer - 1])));

export const kohonen = (educationSpeed: number, winnerWeights: number[], winnerInput: number[]) => {
    winnerWeights
        .forEach((weight, indexWeight) => {
            winnerWeights[indexWeight] += educationSpeed * (winnerInput[indexWeight] - weight)
        })
}

export const getIndexOfMinValue = (input: number[]) => {
    let index = 0;
    let min = input[index];

    for (let i = 1; i < input.length; i++) {
        if (input[i] < min) {
            index = i;
            min = input[i];
        }
    }
    return index;
}

export const getIndexNeuronWinner = (input: number[], neurons: Neuron[][], layer = 0) => {
    const savedInput: number[] = [];
    neurons[layer].forEach((neuron) => {
        let sum = 0;
        input.forEach((input, indexInput) => {
                sum += (input - neuron.weights[indexInput]) ** 2;
            }
        )
        savedInput.push(Math.sqrt(sum));
    })
    return getIndexOfMinValue(savedInput);
}

export const getCellByInput = (weight: number, height: number, neurons: Neuron[][], sqrtHeight: number, sqrtWeight: number, sqrtIBM: number) => {
    const ibm = getIBM(weight, height);
    const index = getIndexNeuronWinner([height / sqrtHeight, weight / sqrtWeight, ibm / sqrtIBM], neurons);
    return { height, weight, color: colors[index], ibm };
}

const layerTraining = (educationSpeed: number, input: number[], neurons: Neuron[][]) => {
    let indexNeuron = getIndexNeuronWinner(input, neurons);
    kohonen(educationSpeed, neurons[0][indexNeuron].weights, input);
}

const belong = (
    input: number[],
    index: number,
    trainingInput: number[][],
    neurons: Neuron[][],
    clear = false
) => {
    if (!clear) {
        classes = classes.length ? classes : neurons[0].map(() => []);
        const indexNeuron = getIndexNeuronWinner(input, neurons);
        classes[indexNeuron].push(trainingInput[index][INDEX_IBM])
    } else {
        classes = neurons[0].map(() => []);
    }
}

export const getAmountClasses = (trainingInput: number[][], normalizedTrainingInput: number[][], neurons: Neuron[][]) => {
    belong([0], 0, trainingInput, neurons, true);
    normalizedTrainingInput.forEach((value, indexValue) => belong(value, indexValue, trainingInput, neurons));
    return classes.map(value => value.length);
}

export const learn = (
    showResult = false,
    normalizedTrainingInput: number[][],
    trainingInput: number[][],
    neurons: Neuron[][],
    educationSpeed = 0.3,
    divEducationSpeed = 0.001,
    epochs = 10
) => {
    if (!showResult) {
        while (educationSpeed > 0) {
            for (let i = 1; i < epochs; i++) {
                normalizedTrainingInput.forEach(() => {
                    layerTraining(educationSpeed, normalizedTrainingInput[Math.floor(Math.random() * normalizedTrainingInput.length)], neurons)
                })
            }
            educationSpeed -= divEducationSpeed;
        }
    }

    getAmountClasses(trainingInput, normalizedTrainingInput, neurons);
    let classIndex = 0;
    let height = MIN_HEIGHT;
    const table = [];

    for (let row = 0; row < MIN_HEIGHT; row++) {
        let weight = MIN_WEIGHT; // Минимальное значение веса
        height += 2;
        const rowCells = [];
        for (let cell = 0; cell < MAX_WEIGHT; cell++) {
            weight += 2;
            let ibm = getIBM(weight, height);
            classes.forEach((values, indexClass) => {
                    values.forEach((value) => {
                            if (value === ibm) {
                                classIndex = indexClass;
                            }
                        }
                    )
                }
            )
            rowCells.push({ height, weight, ibm, color: colors[classIndex] });
        }
        table.push(rowCells);
    }

    return table;
}
