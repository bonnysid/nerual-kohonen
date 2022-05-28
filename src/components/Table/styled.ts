import styled from 'styled-components';

export const Wrapper = styled.div<{ rowCount: number, columnCount: number }>`
  --rows-template: ${({ rowCount }) => `repeat(18, 30px)`};
  --columns-template: ${({ columnCount }) => `repeat(42, 30px)`};
  
  display: grid;
  grid-template-columns: var(--columns-template);
  grid-template-rows: var(--rows-template);
  gap: 5px;
  width: 100%;
  margin-top: 20px;
`;

export const Cell = styled.button<{ color: string }>`
  width: 100%;
  height: 100%;
  border: 1px solid #333;
  background: ${({ color }) => color};
  border-radius: 5px;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.7;
  }
`;

export const TopCell = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid #355694;
  border-radius: 5px;
`;
