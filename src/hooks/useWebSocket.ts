'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { createStompClient } from '@/lib/stomp';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGameStore } from '@/stores/useGameStore';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { useChatStore } from '@/stores/useChatStore';
import type {
  PlayerJoinedEvent, RoundStartEvent,
  GuessResultEvent, RoundEndEvent, GameEndEvent,
  StrokeMessage, WordChoicesEvent,
} from '@/lib/types';

export function useWebSocket(roomCode: string) {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const user = useAuthStore((s) => s.user);

  // Subscribe to all room topics
  const subscribe = useCallback((client: Client) => {
    const prefix = `/topic/room/${roomCode}`;

    // Player updates
    client.subscribe(`${prefix}/players`, (msg: IMessage) => {
      const event: PlayerJoinedEvent = JSON.parse(msg.body);
      useGameStore.getState().setPlayers(event.players);
    });

    // Game events (start, round-start, round-end, game-end)
    client.subscribe(`${prefix}/game`, (msg: IMessage) => {
      const event = JSON.parse(msg.body);
      handleGameEvent(event);
    });

    // Drawing strokes (only relevant for non-drawers)
    client.subscribe(`${prefix}/draw`, (msg: IMessage) => {
      const stroke: StrokeMessage = JSON.parse(msg.body);
      handleIncomingStroke(stroke);
    });

    // Chat messages
    client.subscribe(`${prefix}/chat`, (msg: IMessage) => {
      const chatMsg = JSON.parse(msg.body);
      useChatStore.getState().addMessage(chatMsg);
    });

    // Guess results
    client.subscribe(`${prefix}/guess-result`, (msg: IMessage) => {
      const result: GuessResultEvent = JSON.parse(msg.body);
      handleGuessResult(result);
    });

    // Private: word choices (drawer only)
    client.subscribe('/user/queue/word-choices', (msg: IMessage) => {
      const event: WordChoicesEvent = JSON.parse(msg.body);
      useGameStore.getState().setWordChoices(event.words);
    });

    // Send join event
    client.publish({
      destination: `/app/room/${roomCode}/join`,
      body: JSON.stringify({ username: user?.username }),
    });
  }, [roomCode, user]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    const client = createStompClient();
    clientRef.current = client;

    client.onConnect = () => {
      setIsConnected(true);
      subscribe(client);
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('[STOMP Error]', frame.headers.message);
    };

    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [roomCode, subscribe]);

  // ============ Send functions ============

  const sendStroke = useCallback((stroke: StrokeMessage) => {
    clientRef.current?.publish({
      destination: `/app/room/${roomCode}/draw`,
      body: JSON.stringify(stroke),
    });
  }, [roomCode]);

  const sendGuess = useCallback((text: string) => {
    clientRef.current?.publish({
      destination: `/app/room/${roomCode}/guess`,
      body: JSON.stringify({ text }),
    });
  }, [roomCode]);

  const sendChooseWord = useCallback((wordId: string) => {
    clientRef.current?.publish({
      destination: `/app/room/${roomCode}/choose-word`,
      body: JSON.stringify({ wordId }),
    });
    useGameStore.getState().setIsPickingWord(false);
  }, [roomCode]);

  const sendStartGame = useCallback(() => {
    clientRef.current?.publish({
      destination: `/app/room/${roomCode}/start`,
      body: '{}',
    });
  }, [roomCode]);

  // ============ Event handlers ============

  function handleGameEvent(event: any) {
    const gs = useGameStore.getState();
    const cs = useChatStore.getState();
    const cvs = useCanvasStore.getState();

    switch (event.type) {
      case 'GAME_START':
        gs.setGameStatus('PLAYING');
        cs.addSystemMessage('Game started!');
        cvs.clearStrokes();
        break;

      case 'ROUND_START': {
        const roundEvent = event as RoundStartEvent;
        gs.setRoundInfo({
          roundNumber: roundEvent.roundNumber,
          drawerId: roundEvent.drawerId,
          drawerUsername: roundEvent.drawerUsername,
          wordHint: roundEvent.wordHint,
          timeLimit: roundEvent.timeLimit,
        });
        cvs.clearStrokes();
        cs.addSystemMessage(
          `Round ${roundEvent.roundNumber}: ${roundEvent.drawerUsername} is drawing!`
        );
        break;
      }

      case 'ROUND_END': {
        const endEvent = event as RoundEndEvent;
        gs.showRoundEnd(endEvent.word, endEvent.scores);
        cs.addSystemMessage(`The word was: ${endEvent.word}`);
        break;
      }

      case 'GAME_END': {
        const gameEndEvent = event as GameEndEvent;
        gs.showGameEnd(gameEndEvent.leaderboard);
        cs.addSystemMessage('Game over!');
        break;
      }

      case 'TIMER_TICK':
        gs.setTimeRemaining(event.timeRemaining);
        break;
    }
  }

  function handleIncomingStroke(stroke: StrokeMessage) {
    useCanvasStore.getState().addStroke({
      points: stroke.pointsData,
      color: stroke.color,
      size: stroke.brushSize,
      tool: stroke.tool,
    });
  }

  function handleGuessResult(result: GuessResultEvent) {
    if (result.isCorrect) {
      useGameStore.getState().markPlayerGuessedCorrectly(result.playerId);
      useChatStore.getState().addMessage({
        id: crypto.randomUUID(),
        username: result.username,
        text: `${result.username} guessed correctly!`,
        type: 'correct',
        timestamp: Date.now(),
      });
    }
  }

  return {
    isConnected,
    sendStroke,
    sendGuess,
    sendChooseWord,
    sendStartGame,
  };
}
