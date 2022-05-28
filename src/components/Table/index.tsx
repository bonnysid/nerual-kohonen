import { FC, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import * as ST from './styled'
import { ICell } from '../../helpers';
import React from 'react';

export interface ITableProps {
    cells: ICell[][];
    onSelect: (cell: ICell) => void;
}

export interface ITooltipData extends ICell {
    id: string;
}

export const Table: FC<ITableProps> = ({ cells, onSelect }) => {
    return (
        <ST.Wrapper rowCount={cells.length} columnCount={cells[0]?.length || 0}>
            {cells.map((it, rowIndex) => rowIndex <= 17 && it.map((cell, cellIndex) => cellIndex <= 41 && (
                <React.Fragment key={`${cell.height}-${cell.weight}-${cell.ibm}`}>
                    <ST.Cell
                        onClick={() => onSelect(cell)}
                        data-tip={`Height: ${cell.height}  Weight: ${cell.weight}  IMB: ${cell.ibm}`}
                        color={cell.color}
                    />
                </React.Fragment>
            )))}
        </ST.Wrapper>
    )
}
