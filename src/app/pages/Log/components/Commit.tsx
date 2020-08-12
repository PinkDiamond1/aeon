
import styled, { css } from 'styled-components'
import React, { Component } from 'react';
import theme from 'app/styles/theme';
import { Badge } from 'app/components/Typography';
import { PullRight } from 'app/components/Utility';
import { Commit as CommitType } from 'main/lib/repository/types';

interface Props extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'> {
    onClick: (hash: string) => void;
    entry: CommitType;
    active?: boolean;
    latestCommit?: boolean;
}

export const StyledCommit = styled.button<{ active?: boolean }>`
    padding: 25px;
    text-align: left;
    border: 0;
    font-size: 16px;
    font-weight: 400;
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    color: #666;
    background-color: white;

    &:hover {
        cursor: pointer;
        background-color: #fcfcfc;
    }

    &:active {
        background-color: #f5f5f5;
    }

    &:focus {
        outline: 0;
    }

    ${(props) => props.active && css`
        background-color: #eee !important;
        color: inherit;
    `}
`

const Dot = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 24px;
    margin-right: 16px; 
    background-color: ${theme.colors.grey.medium};
    z-index: 2;
    flex-shrink: 0;
`;

const Timeline = styled.div`
    position: absolute;
    left: 36px;
    width: 2px;
    height: 100%;
    background-color: #ddd;
    z-index: 0;
`;

class Commit extends Component<Props> {
    handleClick = (): void => {
        this.props.onClick(this.props.entry.oid);
    }

    render(): JSX.Element {
        const { entry, active, latestCommit } = this.props;

        return (
            <StyledCommit active={active} onClick={this.handleClick}>
                <Timeline />
                <Dot />
                {entry.message}
                {latestCommit && <PullRight><Badge>Current Identity</Badge></PullRight>}
            </StyledCommit>
        )
    }
}

export default Commit;