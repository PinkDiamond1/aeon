import React, { Component } from 'react';
import Repository from 'app/utilities/Repository';
import { ReadCommitResult } from 'isomorphic-git';
import styled from 'styled-components';
import Commit, { StyledCommit } from './components/Commit';
import Diff from './components/Diff';
import Loading from 'app/components/Loading';
import Button from 'app/components/Button';
import Providers from 'app/utilities/Providers';
import Requests from './components/Requests';
import { Link } from 'react-router-dom';
import { TransitionDirection } from 'app/utilities/AnimatedSwitch';
import { RepositoryEvents } from 'main/lib/repository/types';
import { IpcRendererEvent } from 'electron';
import MenuBar from 'app/components/MenuBar';
import { H2, H3 } from 'app/components/Typography';
import Logo from 'app/assets/aeon-logo.svg';
import theme from 'app/styles/theme';
import { faSparkles } from '@fortawesome/pro-light-svg-icons';
import { Margin } from 'app/components/Utility';

interface State {
    log: ReadCommitResult[];
    selectedCommit?: string;
    updating: boolean;
}

const Container = styled.div`
    display: grid;
    background: white;
    height: 100%;
    grid-template-rows: auto auto 1fr 50px;
    grid-template-columns: 50% 50%;
    grid-template-areas: 
        "head head" 
        "new new"
        "commits diff" 
        "requests diff";
`;

const CommitContainer = styled.div`
    display: flex;
    grid-area: "commits";
    flex-direction: column;
    position: sticky;
    top: 0;
    flex-shrink: 0;
    border-right: 1px solid #eee;
    overflow-y: scroll;
`;

const NewCommitContainer = styled.div`
    background-color: ${theme.colors.blue.primary};
    grid-area: "new";
    grid-column: -1 / 1;
    padding: 32px;
    color: ${theme.colors.white};
`;

class Log extends Component<{}, State> {
    state: State = {
        log: [],
        selectedCommit: null,
        updating: false,
    };

    componentDidMount(): void {
        this.fetchLog();
        Repository.subscribe(this.handleEvent);
    }

    componentWillUnmount(): void {
        Repository.unsubscribe(this.handleEvent);
    }

    handleEvent = (event: IpcRendererEvent, type: RepositoryEvents): void => {
        if (type === RepositoryEvents.NEW_COMMIT) {
            this.fetchLog();
        }
    }

    fetchLog = (): Promise<void> => {
        return Repository.log()
            .then(log => this.setState({ 
                log, 
                selectedCommit: this.state.selectedCommit || log[0].oid 
            }));
    }

    handleClick = (hash: string): void => {
        this.setState({ selectedCommit: hash });
    }

    handleRefresh = async (): Promise<void> => {
        this.setState({ updating: true });
        await Providers.refresh();
        this.setState({ updating: false });
        this.fetchLog();
    }

    handleDispatch = async (): Promise<void> => {
        this.setState({ updating: true });
        await Providers.dispatchDataRequest('instagram');
        this.setState({ updating: false });
        this.fetchLog();
    }

    render(): JSX.Element {
        const { log, selectedCommit, updating } = this.state;
        const selectedTree = log.find(d => d.oid === selectedCommit);

        if (!log.length) {
            return <Loading />;
        }

        return (
            <Container>
                <MenuBar>
                    <H2>Identities</H2>
                    <img src={Logo} style={{ height: 16, marginLeft: 'auto' }} />
                </MenuBar>
                <NewCommitContainer>
                    <Margin>
                        <H3>You have no changes</H3>
                    </Margin>
                    <Link to={`/commit/new?transition=${TransitionDirection.right}`}>
                        <Button
                            icon={faSparkles}
                            color={theme.colors.blue.primary}
                            backgroundColor={theme.colors.white}
                        >
                            Create a new commit
                        </Button>
                    </Link>
                </NewCommitContainer>
                <CommitContainer>
                    {log.map((entry: ReadCommitResult, i) => (
                        <Commit
                            key={entry.oid}
                            entry={entry}
                            onClick={this.handleClick}
                            active={entry.oid === selectedCommit}
                            latestCommit={i === 0}
                        />
                    ))}
                </CommitContainer>
                <Requests />
                <Diff commit={selectedTree} />
            </Container>
        );
    }
}

export default Log;