import React, { useEffect, useState } from 'react';
import { AppWrapper, Button, ButtonsWrapper, GlobalStyles, InfoText, InputsWrapper, Input, Cell } from './styled';
import { Table } from './components';
import { getCellByInput, getTrainingInput, ICell, learn, MAX_HEIGHT, MAX_WEIGHT, Neuron, N } from './helpers';
import ReactTooltip from 'react-tooltip';

function App() {
    const [neurons, setNeurons] = useState(Array(N.length)
        .fill(0)
        .map((layer, indexLayer) => Array(N[indexLayer])
            .fill(0)
            .map(() => new Neuron(indexLayer === 0 ? 3 : N[indexLayer - 1]))));
    const [trainingInput, setTrainingInput] = useState<number[][]>([]);
    const [sqrtHeight, setSqrtHeight] = useState<number>(1);
    const [sqrtWeight, setSqrtWeight] = useState<number>(1);
    const [sqrtIBM, setSqrtIBM] = useState<number>(1);
    const [normalizedTrainingInput, setNormalizedTrainingInput] = useState<number[][]>([]);
    const [cells, setCells] = useState<ICell[][]>([]);
    const [selectedCell, setSelectedCell] = useState<ICell>();
    const [checkedCell, setCheckedCell] = useState<ICell>();
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    useEffect(() => {
        const { normalizedTrainingInput, trainingInput, sqrtSumIBM, sqrtSumWeight, sqrtSumHeight } = getTrainingInput(MAX_HEIGHT, MAX_WEIGHT);
        setTrainingInput(trainingInput);
        setNormalizedTrainingInput(normalizedTrainingInput);
        setSqrtWeight(sqrtSumWeight);
        setSqrtHeight(sqrtSumHeight);
        setSqrtIBM(sqrtSumIBM);
    }, []);

    const handleClickLearn = () => {
        if (trainingInput.length && normalizedTrainingInput.length) {
            setCells(learn(false, normalizedTrainingInput, trainingInput, neurons));
            ReactTooltip.rebuild();
        }
    }

    const handleClickShowResult = () => {
        if (trainingInput.length && normalizedTrainingInput.length) {
            setCells(learn(true, normalizedTrainingInput, trainingInput, neurons));
            ReactTooltip.rebuild();
        }
    }

    const handleChangeHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (/^\d+$/.test(value) || value === '') {
            setHeight(value);
        }
    }

    const handleChangeWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (/^\d+$/.test(value) || value === '') {
            setWeight(value);
        }
    }

    const handleCheck = () => {
        if (weight && height) {
            const cell = getCellByInput(+weight, +height, neurons, sqrtHeight, sqrtWeight, sqrtIBM);
            setCheckedCell(cell);
        }
    }

    return (
        <>
            <GlobalStyles/>
            <AppWrapper>
                <ButtonsWrapper>
                    <Button onClick={handleClickLearn}>train</Button>
                    <Button onClick={handleClickShowResult}>result</Button>
                    {selectedCell && (
                        <>
                            <InfoText><span>Height</span>: {selectedCell.height}</InfoText>
                            <InfoText><span>Weight</span>: {selectedCell.weight}</InfoText>
                            <InfoText><span>IBM</span>: {selectedCell.ibm}</InfoText>
                        </>
                    )}
                </ButtonsWrapper>
                <InputsWrapper>
                    <Input placeholder="Height" value={height} onChange={handleChangeHeight} />
                    <Input placeholder="Weight" value={weight} onChange={handleChangeWeight} />
                    <Button onClick={handleCheck}>Check</Button>
                    {checkedCell && <Cell color={checkedCell.color} />}
                </InputsWrapper>
                <Table onSelect={setSelectedCell} cells={cells}/>
                <ReactTooltip />
            </AppWrapper>
        </>
    );
}

export default App;
