import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const Container = styled.div`
    background-color: var(--color-blue-200);
    color: var(--color-blue-700);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 2em;
    width: 2em;
    height: 2em;
    flex: 0 0 auto;
    margin-right: 0.5em;
`;

interface IconBadgeProps {
    icon: IconDefinition;
}

function IconBadge({ icon }: IconBadgeProps) {
    return (
        <Container>
            <FontAwesomeIcon
                icon={icon}
                fixedWidth
            />
        </Container>
    )
}

export default IconBadge;