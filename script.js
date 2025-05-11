// Initialize variables
let board = null;
let game = new Chess();
let currentOpeningMoves = [];
let currentOpeningIndex = 0;
let trainingInProgress = false;
let userPlaysAs = 'white';
let stockfish = null;
let customOpenings = JSON.parse(localStorage.getItem('customOpenings')) || [];
let boardOrientation = 'white'; // Track board orientation separately
let stats = {
    attempts: 0,
    correct: 0,
    incorrect: 0
};
// Predefined openings database
// const openings = {
//     "scotch-game": {
//         "name": "Scotch Game",
//         "moves": ["e4", "e5", "Nf3", "Nc6", "d4"],
//         "variations": {
//             "Mieses Variation": ["exd4", "Nxd4", "Nf6", "Nc3", "Bb4"],
//             "Schmidt Variation": ["exd4", "Nxd4", "Nf6", "Nxc6", "bxc6", "e5"],
//             "Classical Variation": ["exd4", "Nxd4", "Bc5"],
//             "Göring Gambit": ["exd4", "c3"],
//             "Haxo Gambit": ["exd4", "Bc4"],
//             "Scotch Four Knights": ["exd4", "Nxd4", "Nf6", "Nc3", "Bb4"],
//             "Steinitz Variation": ["exd4", "Nxd4", "Qh4"],
//             "Blunder Punishment 1": ["Nxd4", "Nxe5", "Qf6", "Nf3", "Nxf3+"],
//             "Blunder Punishment 2": ["exd4", "Nxd4", "Nxd4", "Qxd4", "c5", "Qe5+", "Be7", "Qxg7"],
//             "Blunder Punishment 3": ["exd4", "Nxd4", "Nf6", "Nc3", "Bb4", "Nxc6", "bxc6", "e5", "Nd5", "Qg4"]
//         }
//     },
//     "vienna-game": {
//         "name": "Vienna Game",
//         "moves": ["e4", "e5", "Nc3"],
//         "variations": {
//             "Vienna Gambit": ["Nc6", "f4"],
//             "Frankenstein-Dracula Variation": ["Nf6", "Bc4", "Nxe4", "Qh5"],
//             "Max Lange Defense": ["Nc6", "Nf3", "Nf6"],
//             "Paulsen Variation": ["Nc6", "g3"],
//             "Falkbeer Variation": ["d5"],
//             "Hamppe-Allgaier Gambit": ["Nf6", "f4", "d5", "fxe5", "Nxe4"],
//             "Mieses Variation": ["Nc6", "g3", "g6"],
//             "Blunder Punishment 1": ["Nc6", "Bc4", "Nd4", "Qh5", "Nxc2+", "Kd1", "Nxa1", "Qxf7#"],
//             "Blunder Punishment 2": ["Nf6", "f4", "d6", "Nf3", "Nc6", "Bb5", "Bd7", "O-O", "Nd4", "Nxd4", "exd4", "e5"],
//             "Blunder Punishment 3": ["Nf6", "f4", "d5", "fxe5", "Nxe4", "Nxe4", "dxe4", "d3"]
//         }
//     },
//     "four-knights-game": {
//         "name": "Four Knights Game",
//         "moves": ["e4", "e5", "Nf3", "Nc6", "Nc3", "Nf6"],
//         "variations": {
//             "Spanish Variation": ["Bb5"],
//             "Scotch Four Knights": ["d4"],
//             "Belgrade Gambit": ["d4", "exd4", "Nd5"],
//             "Gunsberg Variation": ["Bc4"],
//             "Rubinstein Variation": ["Bb5", "Nd4"],
//             "Symmetrical Variation": ["Be2"],
//             "Italian Four Knights": ["Bc4", "Bc5"],
//             "Blunder Punishment 1": ["Nd5", "Nxe4", "Qe2", "f5", "d3", "Nd6", "Nxe5"],
//             "Blunder Punishment 2": ["Bb5", "Nd4", "Nxd4", "exd4", "e5"],
//             "Blunder Punishment 3": ["d4", "exd4", "Nxd4", "Nxd4", "Qxd4", "c5", "Qe5+"]
//         }
//     },
//     "petrovs-defense": {
//         "name": "Petrov's Defense",
//         "moves": ["e4", "e5", "Nf3", "Nf6"],
//         "variations": {
//             "Classical Variation": ["Nxe5", "d6", "Nf3", "Nxe4", "d4", "d5", "Bd3"],
//             "Steinitz Variation": ["d4", "exd4", "e5", "Ne4", "Qxd4", "d5"],
//             "Nimzowitsch Attack": ["Nxe5", "d6", "Nc4"],
//             "Cochrane Gambit": ["Nxe5", "d6", "Nxf7"],
//             "Paulsen Attack": ["Nxe5", "Nc6"],
//             "Stafford Gambit": ["Nxe5", "Nc6", "Nxc6", "dxc6"],
//             "Millennium Attack": ["Nxe5", "d6", "Nf3", "Nxe4", "Bd3"],
//             "Blunder Punishment 1": ["Nxe5", "Nxe4", "Qe2", "d5", "d3", "Nf6", "Nc6", "Nc3"],
//             "Blunder Punishment 2": ["Nxe5", "d6", "Nf3", "Nxe4", "d4", "d5", "Bd3", "Nc6", "O-O"],
//             "Blunder Punishment 3": ["Nxe5", "Nxe4", "Qe2", "d5", "d3", "Nf6", "Nc6", "Nc3"]
//         }
//     },
//     "kings-gambit": {
//         "name": "King's Gambit",
//         "moves": ["e4", "e5", "f4"],
//         "variations": {
//             "King's Gambit Accepted": ["exf4"],
//             "King's Gambit Declined": ["d6"],
//             "Falkbeer Counter-Gambit": ["d5"],
//             "Bishop's Gambit": ["Bc5"],
//             "Knight's Gambit": ["Nf6"],
//             "Modern Variation": ["d6", "Nf3", "Nc6"],
//             "Classical Variation": ["exf4", "Nf3"],
//             "Blunder Punishment 1": ["exf4", "Bc4", "Nf6", "e5", "Qe7", "O-O"],
//             "Blunder Punishment 2": ["exf4", "Bc4", "Qh4", "g3", "fxg3", "Nf3"],
//             "Blunder Punishment 3": ["exf4", "Bc4", "d5", "exd5", "Ne7", "Qe2", "dxc4"]
//         }
//     },
//     "philidor-defense": {
//         "name": "Philidor Defense",
//         "moves": ["e4", "e5", "Nf3", "d6"],
//         "variations": {
//             "Classical Variation": ["d4", "exd4", "Nxd4"],
//             "Modern Variation": ["d4", "exd4", "Nxd4", "Nf6"],
//             "Exchange Variation": ["d4", "exd4", "Nxd4", "Nc6", "Nxc6"],
//             "Philidor's Counter-Gambit": ["Bc4", "f5"],
//             "Lion Defense": ["Be2"],
//             "Knight's Variation": ["Nc3"],
//             "Austrian Attack": ["c4"],
//             "Blunder Punishment 1": ["d4", "exd4", "Nxd4", "Nc6", "Nxc6", "bxc6", "Bf4"],
//             "Blunder Punishment 2": ["Bf4", "Nc6", "Bg5", "h6", "Bh4", "g5", "Bg3"],
//             "Blunder Punishment 3": ["d4", "exd4", "Nxd4", "Nc6", "Nb5", "Bd7"]
//         }
//     },
//     "scandinavian-defense": {
//         "name": "Scandinavian Defense",
//         "moves": ["e4", "e5", "d4", "exd4"],
//         "variations": {
//             "Modern Variation": ["Nf3"],
//             "Classical Variation": ["Nf3", "Nc6"],
//             "Icelandic Gambit": ["Nf3", "d6"],
//             "Blunder Punishment 1": ["Nf3", "Nc6", "c3", "dxc3", "Nxc3"],
//             "Blunder Punishment 2": ["Nf3", "Nc6", "Bf4", "g5", "Bd2"],
//             "Blunder Punishment 3": ["Nf3", "Nc6", "Bb5", "d5", "exd5"]
//         }
//     },
//     "pirc-defense": {
//         "name": "Pirc Defense",
//         "moves": ["e4", "d6", "d4", "Nf6"],
//         "variations": {
//             "Classical Variation": ["Nc3", "g6"],
//             "Austrian Attack": ["Nc3", "g6", "f4"],
//             "Hyper-Accelerated Pirc": ["Nc3", "g6", "Nf3"],
//             "Blunder Punishment 1": ["Nc3", "g6", "f4", "Bg7", "Nf3", "Nbd7"],
//             "Blunder Punishment 2": ["Nc3", "g6", "f4", "Bg7", "Nf3", "O-O", "Be3", "Nbd7"],
//             "Blunder Punishment 3": ["Nc3", "g6", "f4", "Bg7", "Nf3", "O-O", "Be2", "c5", "d5"]
//         }
//     },
//     "alekhines-defense": {
//         "name": "Alekhine's Defense",
//         "moves": ["e4", "Nf6"],
//         "variations": {
//             "Exchange Variation": ["e5", "Nd5", "exd5"],
//             "Modern Variation": ["e5", "Nd5", "c4"],
//             "Indian Variation": ["d3"],
//             "Blunder Punishment 1": ["e5", "Nd5", "c4", "Nb6", "exf6", "gxf6"],
//             "Blunder Punishment 2": ["e5", "Nd5", "c4", "Nb6", "d4", "e6", "exf6", "gxf6", "Nc3"],
//             "Blunder Punishment 3": ["e5", "Nd5", "Nc3", "Nxc3", "bxc3"]
//         }
//     },
//     "modern-defense": {
//         "name": "Modern Defense",
//         "moves": ["e4", "g6"],
//         "variations": {
//             "Austrian Attack": ["d4", "Bg7", "Nc3", "d6", "Be3"],
//             "Classical Variation": ["d4", "Bg7", "Nc3", "Nf6"],
//             "Pirc Variation": ["d4", "Bg7", "Nf3", "Nf6", "Nc3"],
//             "Blunder Punishment 1": ["d4", "Bg7", "Nc3", "d6", "Be3", "c6", "Qd2", "Nd7"],
//             "Blunder Punishment 2": ["d4", "Bg7", "Nc3", "d6", "Be3", "c6", "Qd2", "Nd7", "O-O"],
//             "Blunder Punishment 3": ["d4", "Bg7", "Nc3", "d6", "Be3", "c6", "Qd2", "Nd7", "O-O", "e5"]
//         }
//     },
//     "nimzo-indian-defense": {
//         "name": "Nimzo-Indian Defense",
//         "moves": ["e4", "e6", "Nf3", "Nf6", "Nc3", "Bb4"],
//         "variations": {
//             "Classical Variation": ["d3"],
//             "Karpov Variation": ["a3"],
//             "Rubinstein Variation": ["c4"],
//             "Blunder Punishment 1": ["d3", "c5", "Be2"],
//             "Blunder Punishment 2": ["c4", "d5", "e5"],
//             "Blunder Punishment 3": ["c4", "c6", "Bd3", "d5", "cxd5"]
//         }
//     }
// };

let openings;
let opening;



let playedVariations = new Set();

function chooseRandomVariation() {
    //const opening = openings[openingId];
    if (!opening || !opening.variations || Object.keys(opening.variations).length === 0) {
        console.error("Invalid opening or no variations available.");
        return null;
    }

    const variationKeys = Object.keys(opening.variations);
    const unplayedVariations = variationKeys.filter(key => !playedVariations.has(key));

    if (unplayedVariations.length === 0) {
        // Reset the played variations if all have been played
        playedVariations.clear();
        console.log("All variations played. Resetting...");
        const variationKeys = Object.keys(opening.variations);
        const randomVariationKey = variationKeys[Math.floor(Math.random() * variationKeys.length)];
        playedVariations.add(randomVariationKey);
        return opening.variations[randomVariationKey];
    }

    const randomVariationKey = unplayedVariations[Math.floor(Math.random() * unplayedVariations.length)];
    playedVariations.add(randomVariationKey);
    return opening.variations[randomVariationKey];
}


function initBoard() {
    try {
        const boardElement = document.getElementById('board');
        console.log('Board element:', boardElement);
        if (!boardElement) {
            console.error('Board element not found');
            if (currentOpeningIndex >= currentOpeningMoves.length) {
                const openingId = $('#opening-dropdown').val();
                //const opening = openings[openingId] || customOpenings.find(o => o.id === openingId);

                if (opening && opening.variations) {
                    const variationKeys = Object.keys(opening.variations);
                    if (variationKeys.length > 0) {
                        const randomVariationKey = variationKeys[Math.floor(Math.random() * variationKeys.length)];
                        const randomVariationMoves = opening.variations[randomVariationKey];
                        currentOpeningMoves = randomVariationMoves;
                        currentOpeningIndex = 0;
                        console.log(`Continuing with variation: ${randomVariationKey}`);
                    }
                }
            }
            // Attempt to transition to a variation if the main opening moves are completed
            const openingId = $('#opening-dropdown').val();
            //const opening = openings[openingId] || customOpenings.find(o => o.id === openingId);

            if (opening && opening.variations) {
                const variationKeys = Object.keys(opening.variations);
                if (variationKeys.length > 0) {
                    const randomVariationKey = variationKeys[Math.floor(Math.random() * variationKeys.length)];
                    const randomVariationMoves = opening.variations[randomVariationKey];
                    currentOpeningMoves = randomVariationMoves;
                    currentOpeningIndex = 0;
                    console.log(`Transitioning to variation: ${randomVariationKey}`);
                }
            }
            return;
        }
        
        // Make sure the board div has a defined size before initializing
        boardElement.style.width = '500px';
        boardElement.style.height = '500px';
        
        const config = {
            draggable: true,
            position: 'start',
            orientation: boardOrientation,
            pieceTheme: 'icons/{piece}.png', 
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        };
        
        // Ensure chess.js is loaded
        if (typeof Chess !== 'function') {
            console.error('Chess.js not loaded');
            return;
        }
        
        // Ensure Chessboard is loaded
        if (typeof Chessboard !== 'function') {
            console.error('Chessboard.js not loaded');
            return;
        }
        
        board = Chessboard('board', config);
        console.log('Chessboard initialized:', board);
        
        // Force a redraw after a small delay
        setTimeout(() => {
            if (board) {
                board.resize();
                board.position('start', false);
            }
        }, 100);
        
        $(window).on('resize', () => {
            if (board) {
                board.resize();
            }
        });
    } catch (e) {
        console.error('Error initializing board:', e);
        alert('Failed to initialize the chessboard: ' + e.message);
    }
}



// Initialize Stockfish engine
function initStockfish() {
    try {
        stockfish = new Worker('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/11.0.0/stockfish.js');
        stockfish.postMessage('uci');
        stockfish.postMessage('isready');
        
        stockfish.onmessage = function(event) {
            const message = event.data;
            
            if (message.includes('bestmove')) {
                // Not used in this version - could be expanded for computer replies
            } else if (message.includes('info depth') && message.includes('score cp')) {
                if (trainingInProgress) {
                    analyzePosition(message);
                }
            }
        };
    } catch (e) {
        console.error('Error initializing Stockfish:', e);
    }
}


// Check if a move is valid within opening line
function isValidOpeningMove(move) {
    if (currentOpeningIndex >= currentOpeningMoves.length) {
        return true; // We've gone beyond the opening book, all moves are valid
    }
    
    const nextExpectedMove = currentOpeningMoves[currentOpeningIndex];
    return move.san === nextExpectedMove;
}

// Evaluate move quality using Stockfish
function evaluateMove(move) {
    const prevFen = game.fen();
    game.move(move);
    const currentFen = game.fen();
    game.undo();
    
    if (stockfish) {
        stockfish.postMessage('position fen ' + prevFen);
        stockfish.postMessage('go depth 15');
    }
    
    return new Promise((resolve) => {
        const timeout = setTimeout(() => {
            resolve('moderate'); // Default if Stockfish takes too long
        }, 2000);
        
        const handler = function(event) {
            const message = event.data;
            if (message.includes('info depth') && message.includes('score cp')) {
                const evalMatch = message.match(/score cp (-?\d+)/);
                if (evalMatch) {
                    clearTimeout(timeout);
                    stockfish.onmessage = null;
                    
                    const evaluation = parseInt(evalMatch[1]);
                    game.move(move);
                    
                    stockfish.postMessage('position fen ' + currentFen);
                    stockfish.postMessage('go depth 15');
                    
                    setTimeout(() => {
                        stockfish.onmessage = function(event2) {
                            const newMessage = event2.data;
                            if (newMessage.includes('info depth') && newMessage.includes('score cp')) {
                                const newEvalMatch = newMessage.match(/score cp (-?\d+)/);
                                if (newEvalMatch) {
                                    const newEvaluation = parseInt(newEvalMatch[1]);
                                    game.undo();
                                    
                                    const difference = userPlaysAs === 'white' ? 
                                        (evaluation - newEvaluation) : 
                                        (newEvaluation - evaluation);
                                    
                                    stockfish.onmessage = handler;
                                    resolve(getMoveQuality(difference));
                                }
                            }
                        };
                    }, 100);
                }
            }
        };
        
        if (stockfish) {
            stockfish.onmessage = handler;
        }
    });
}

// Convert evaluation difference to move quality
function getMoveQuality(difference) {
    if (difference >= 200) return 'brilliant';
    if (difference >= 50) return 'good';
    if (difference >= -20) return 'moderate';
    if (difference >= -100) return 'inaccuracy';
    if (difference >= -300) return 'mistake';
    return 'blunder';
}

// Analyze position with Stockfish
function analyzePosition(message) {
    const evalMatch = message.match(/score cp (-?\d+)/);
    if (evalMatch) {
        const evaluation = parseInt(evalMatch[1]);
        const perspective = userPlaysAs === 'white' ? 1 : -1;
        const normalizedEval = evaluation * perspective;

        let evalText = (normalizedEval / 100).toFixed(2);
        $('#eval-display').text(evalText > 0 ? `+${evalText}` : evalText);

        // Adjust the logic to play different lines
        if (currentOpeningIndex < currentOpeningMoves.length) {
            const possibleMoves = currentOpeningMoves.slice(currentOpeningIndex, currentOpeningIndex + 7);
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            const moves = game.moves({ verbose: true });

            for (let i = 0; i < moves.length; i++) {
                if (moves[i].san === randomMove) {
                    game.move(moves[i]);
                    currentOpeningIndex++;
                    if (board) {
                        board.position(game.fen());
                    }
                    const moves = game.moves({ verbose: true });
                    const commonMoves = currentOpeningMoves.slice(currentOpeningIndex, currentOpeningIndex + 3); // Consider top 3 common moves
                    for (let i = 0; i < moves.length; i++) {
                        if (commonMoves.includes(moves[i].san)) {
                            game.move(moves[i]);
                            currentOpeningIndex++;
                            if (board) {
                                board.position(game.fen());
                            }
                            break;
                        }
                    }
                    updatePGNDisplay();
                    break;
                }
            }
        }
    }
}

// Event handlers
function onDragStart(source, piece) {
    if (game.game_over() || !trainingInProgress) return false;
    if (currentOpeningIndex >= currentOpeningMoves.length) {
        return true; // Allow moves beyond the opening phase
    }
    const currentPlayer = game.turn() === 'w' ? 'white' : 'black';
    if ((userPlaysAs === 'white' && piece.search(/^b/) !== -1) ||
        (userPlaysAs === 'black' && piece.search(/^w/) !== -1)) {
        return false;
    }
    if (currentOpeningIndex >= currentOpeningMoves.length) {
        // If the opening is finished, continue playing random moves from predefined lines
        const openingId = $('#opening-dropdown').val();
        //const opening = openings[openingId] || customOpenings.find(o => o.id === openingId);

        if (opening && opening.variations && opening.variations.length > 0) {
            const randomVariation = opening.variations[Math.floor(Math.random() * opening.variations.length)];
            const nextMove = randomVariation[currentOpeningIndex - currentOpeningMoves.length];
            if (nextMove) {
                const moves = game.moves({ verbose: true });
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].san === nextMove) {
                        game.move(moves[i]);
                        if (board) {
                            board.position(game.fen());
                        }
                        updatePGNDisplay();
                        break;
                    }
                }
            }
        }
    }

    // Save game history locally
    function saveGameHistory() {
        const history = {
            pgn: game.pgn(),
            fen: game.fen(),
            stats: { ...stats },
            timestamp: new Date().toISOString()
        };
        const savedHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        savedHistory.push(history);
        localStorage.setItem('gameHistory', JSON.stringify(savedHistory));
    }

    // Load game history
    function loadGameHistory() {
        const savedHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        return savedHistory;
    }

    // Display game history
    function displayGameHistory() {
        const history = loadGameHistory();
        const $historyList = $('#history-list');
        $historyList.empty();

        history.forEach((entry, index) => {
            const $item = $(`<li>Game ${index + 1} - ${new Date(entry.timestamp).toLocaleString()}</li>`);
            $item.on('click', () => {
                game.load_pgn(entry.pgn);
                if (board) {
                    board.position(entry.fen);
                }
                stats = { ...entry.stats };
                updatePGNDisplay();
            });
            $historyList.append($item);
        });
    }

    // Call saveGameHistory on reset
    function resetTraining() {
        saveGameHistory();
        game.reset();
        if (board) {
            board.position('start');
        }
        currentOpeningIndex = 0;
        $('#move-quality').text('').removeClass();
        updatePGNDisplay();
    }
    if (currentPlayer !== userPlaysAs) return false;
}

async function onDrop(source, target) {
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });
    
    if (move === null) return 'snapback';
    
    updatePGNDisplay();
    
    if (isValidOpeningMove(move)) {
        currentOpeningIndex++;
        $('#move-quality').text('Correct move!').removeClass().addClass('move-quality good');
        stats.correct++;
        $('#correct').text(stats.correct);
        
        setTimeout(makeComputerMove, 500);
    } else {
        const quality = await evaluateMove(move);
        
        if (['blunder', 'mistake'].includes(quality)) {
            $('#move-quality').text(`${quality.toUpperCase()}! Incorrect move.`).removeClass().addClass(`move-quality ${quality}`);
            stats.incorrect++;
            $('#incorrect').text(stats.incorrect);
            stats.attempts++;
            $('#attempts').text(stats.attempts);
            
            setTimeout(resetTraining, 1500);
        } else if (quality === 'inaccuracy') {
            $('#move-quality').text(`INACCURACY - Suboptimal move but continuing.`).removeClass().addClass('move-quality inaccuracy');
            
            setTimeout(makeComputerMove, 500);
        } else {
            $('#move-quality').text(`${quality.toUpperCase()} - Good alternative!`).removeClass().addClass(`move-quality ${quality}`);
            
            setTimeout(makeComputerMove, 500);
        }
    }
}

function onSnapEnd() {
    if (board) {
        board.position(game.fen());
    }
}

function updatePGNDisplay() {
    $('#pgn-display').text(game.pgn());
}

function makeComputerMove() {
    if (!trainingInProgress || game.game_over()) return;

    const currentPlayer = game.turn() === 'w' ? 'white' : 'black';
    if (currentPlayer === userPlaysAs) return;

    if (currentOpeningIndex < currentOpeningMoves.length) {
        const nextMove = currentOpeningMoves[currentOpeningIndex];
        const moves = game.moves({ verbose: true });

        for (let i = 0; i < moves.length; i++) {
            if (moves[i].san === nextMove) {
                game.move(moves[i]);
                currentOpeningIndex++;
                if (board) {
                    board.position(game.fen());
                }
                updatePGNDisplay();
                break;
            }
        }
    } else {
        // Use chooseRandomVariation to select a new variation if the opening moves are completed
        const openingId = $('#opening-dropdown').val();
        const newVariationMoves = chooseRandomVariation();

        if (newVariationMoves) {
            currentOpeningMoves = newVariationMoves;
            currentOpeningIndex = 0;

            // Display the variation name and moves on the screen
            //const opening = openings[openingId];
            const variationName = Object.keys(opening.variations).find(
                key => opening.variations[key] === newVariationMoves
               
            );
          
            $('#variation-display').text(`Variation: ${variationName}`);
            $('#variation-moves').text(`Moves: ${newVariationMoves.join(', ')}`);
            // Reset the board position to the starting position of the variation
            game.load(opening.startingPosition || 'start');
            if (board) {
                board.position(game.fen());
            }
            console.log("Switching to a new variation:", newVariationMoves);
            makeComputerMove(); // Recursively call to play the first move of the new variation
        } else if (stockfish) {
            stockfish.postMessage('position fen ' + game.fen());
            stockfish.postMessage('go depth 15');

            stockfish.onmessage = function (event) {
                const message = event.data;
                if (message.includes('bestmove')) {
                    const match = message.match(/bestmove\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
                    if (match) {
                        const move = match[1];
                        game.move(move, { sloppy: true });
                        if (board) {
                            board.position(game.fen());
                        }
                        updatePGNDisplay();
                        // Keep the handler active to allow Stockfish to continue providing moves
                    }
                }
            };

            stockfish.onmessage = stockfishHandler;
        }
    }
}

function resetTraining() {
    game.reset();
    if (board) {
        board.position('start');
    }
    currentOpeningIndex = 0;
    $('#move-quality').text('').removeClass();
    updatePGNDisplay();
}

// Flip the chessboard
function flipBoard() {
    if (board) {
        boardOrientation = boardOrientation === 'white' ? 'black' : 'white';
        board.orientation(boardOrientation);
        console.log('Board flipped. New orientation:', boardOrientation);
        
        // Update the status message to reflect current orientation
        if (trainingInProgress) {
            $('#status').text(`Training ${getCurrentOpeningName()} - You play as ${userPlaysAs} (Board: ${boardOrientation})`);
        }
    }
}

// Get the current opening name
function getCurrentOpeningName() {
    const openingId = $('#opening-dropdown').val();
    let openingName = "Custom Opening";
    
    if (openings[openingId]) {
        openingName = openings[openingId].name;
    } else {
        const customOpening = customOpenings.find(o => o.id === openingId);
        if (customOpening) {
            openingName = customOpening.name;
        }
    }
    
    return openingName;
}

async function startTraining() {
    const openingId = $('#opening-dropdown').val();
    
    if (!openingId) {
        alert('Please select an opening to start training.');
        return;
    }

    try {
    const response = await fetch(`openings/${openingId}.json`);
    if (!response.ok) throw new Error(`Failed to load ${openingId}.json`);
    opening = await response.json();
    } catch (error) {
    console.error("Error loading opening:", error);
    alert(`Could not load opening: ${openingId}`);
    return;
    }

  
    if (!opening) {
        alert('Opening not found. Please try again.');
        return;
    }
    
    resetTraining();
    currentOpeningMoves = opening.moves;
    
    // Use selected color from radio buttons instead of automatically determining
    userPlaysAs = $('input[name="play-as"]:checked').val() || 'white';
    
    // Set the board orientation to match the player's perspective
    if (board && boardOrientation !== userPlaysAs) {
        boardOrientation = userPlaysAs;
        board.orientation(boardOrientation);
    }
    
    $('#status').text(`Training ${opening.name} - You play as ${userPlaysAs} (Board: ${boardOrientation})`);
    trainingInProgress = true;
    
    if ((game.turn() === 'w' && userPlaysAs === 'black') || 
        (game.turn() === 'b' && userPlaysAs === 'white')) {
        makeComputerMove();
    }
}

function saveCustomLine() {
    const name = $('#line-name').val().trim();
    const pgn = $('#pgn-input').val().trim();
    
    if (!name || !pgn) {
        alert('Please provide both a name and moves for your custom line.');
        return;
    }
    
    const tempGame = new Chess();
    try {
        if (!tempGame.load_pgn(pgn)) {
            tempGame.reset();
            
            const movesText = pgn.replace(/\d+\.\s+/g, '').split(/\s+/);
            for (const moveText of movesText) {
                if (moveText && !tempGame.move(moveText)) {
                    throw new Error(`Invalid move: ${moveText}`);
                }
            }
        }
    } catch (e) {
        alert('Invalid PGN or moves. Please check your input.');
        return;
    }
    
    const history = tempGame.history();
    
    const id = 'custom-' + Date.now();
    const customOpening = {
        id,
        name,
        moves: history
    };
    
    customOpenings.push(customOpening);
    localStorage.setItem('customOpenings', JSON.stringify(customOpenings));
    
    updateCustomLinesList();
    
    $('#line-name').val('');
    $('#pgn-input').val('');
    
    alert('Custom line saved successfully!');
}

function updateCustomLinesList() {
    const $list = $('#custom-lines');
    $list.empty();
    
    customOpenings.forEach(opening => {
        const $item = $(`<li data-id="${opening.id}">${opening.name}</li>`);
        $item.on('click', function() {
            $('#opening-dropdown').val('');
            const id = $(this).data('id');
            selectCustomOpening(id);
        });
        $list.append($item);
    });
}

function selectCustomOpening(id) {
    const opening = customOpenings.find(o => o.id === id);
    if (opening) {
        resetTraining();
        currentOpeningMoves = opening.moves;
        
        // Use selected color from radio buttons
        userPlaysAs = $('input[name="play-as"]:checked').val() || 'white';
        
        // Set the board orientation to match the player's perspective
        if (board && boardOrientation !== userPlaysAs) {
            boardOrientation = userPlaysAs;
            board.orientation(boardOrientation);
        }
        
        $('#status').text(`Training ${opening.name} - You play as ${userPlaysAs} (Board: ${boardOrientation})`);
        trainingInProgress = true;
        
        if ((game.turn() === 'w' && userPlaysAs === 'black') || 
            (game.turn() === 'b' && userPlaysAs === 'white')) {
            makeComputerMove();
        }
    }
}

// Modified initialization approach
$(document).ready(function() {
    console.log('Document ready');
    
    // Add a small delay to ensure all resources are fully loaded
    setTimeout(function() {
        console.log('Initializing board after delay');
        initBoard();
        initStockfish();
        updateCustomLinesList();
        
        // Add color selection radio buttons to the page
        if (!$('#color-selection').length) {
            const colorSelectionHTML = `
                <div id="color-selection" class="form-group">
                    <h2>Play As</h2>
                    <div class="radio-group">
                        <label><input type="radio" name="play-as" value="white" checked> White</label>
                        <label><input type="radio" name="play-as" value="black"> Black</label>
                    </div>
                </div>
            `;
            $('.opening-selector').append(colorSelectionHTML);
        }
        
        $('#start-training').on('click', startTraining);
        $('#save-line').on('click', saveCustomLine);
        $('#reset-btn').on('click', resetTraining);
        $('#flip-btn').on('click', flipBoard);
        
        // Listen for color selection changes and update board if needed
        $(document).on('change', 'input[name="play-as"]', function() {
            if (trainingInProgress) {
                // If already training, don't change immediately
                return;
            }
            
            const selectedColor = $(this).val();
            if (selectedColor && boardOrientation !== selectedColor) {
                boardOrientation = selectedColor;
                if (board) {
                    board.orientation(boardOrientation);
                }
            }
        });
        
        $('#status').text('Select an opening to start training');
    }, 500);
});

// Fallback initialization in case the document.ready didn't work
window.onload = function() {
    console.log('Window loaded');
    
    // Only initialize if not already done
    if (!board) {
        console.log('Board not initialized yet, doing it now');
        initBoard();
        initStockfish();
        updateCustomLinesList();
        
        // Add color selection radio buttons to the page if not already added
        if (!$('#color-selection').length) {
            const colorSelectionHTML = `
                <div id="color-selection" class="form-group">
                    <h2>Play As</h2>
                    <div class="radio-group">
                        <label><input type="radio" name="play-as" value="white" checked> White</label>
                        <label><input type="radio" name="play-as" value="black"> Black</label>
                    </div>
                </div>
            `;
            $('.opening-selector').append(colorSelectionHTML);
        }
        
        // Make sure event handlers are attached
        $('#start-training').on('click', startTraining);
        $('#save-line').on('click', saveCustomLine);
        $('#reset-btn').on('click', resetTraining);
        $('#flip-btn').on('click', flipBoard);
        
        // Listen for color selection changes
        $(document).on('change', 'input[name="play-as"]', function() {
            if (trainingInProgress) {
                // If already training, don't change immediately
                return;
            }
            
            const selectedColor = $(this).val();
            if (selectedColor && boardOrientation !== selectedColor) {
                boardOrientation = selectedColor;
                if (board) {
                    board.orientation(boardOrientation);
                }
            }
        });
        
        $('#status').text('Select an opening to start training');
    }
};