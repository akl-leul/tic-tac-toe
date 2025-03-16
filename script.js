  let board = ["", "", "", "", "", "", "", "", ""];
        let currentPlayer = "X";
        let gameMode = "2P";
        let gameOver = false;
        let player1Score = 0;
        let player2Score = 0;

        function startGame(mode) {
            board = ["", "", "", "", "", "", "", "", ""];
            currentPlayer = "X";
            gameMode = mode;
            gameOver = false;
            document.getElementById("status").innerText = `${currentPlayer}'s Turn`;
            document.getElementById("status").classList.remove("win");
            document.body.classList.remove("win");
            removeSparkles();
            renderBoard();
        }

        function renderBoard() {
            let boardElement = document.getElementById("board");
            boardElement.innerHTML = "";
            board.forEach((cell, index) => {
                let cellElement = document.createElement("div");
                cellElement.classList.add("cell");
                if (cell) cellElement.classList.add("taken");
                cellElement.innerText = cell;
                cellElement.addEventListener("click", () => makeMove(index));
                boardElement.appendChild(cellElement);
            });
        }

        function makeMove(index) {
            if (board[index] || gameOver) return;
            board[index] = currentPlayer;
            renderBoard();
            if (checkWinner(currentPlayer)) {
                document.getElementById("status").innerText = `${currentPlayer} Wins!`;
                document.getElementById("status").classList.add("win");
                document.body.classList.add("win");
                gameOver = true;
                showSparkles();
                updateScore();
                setTimeout(() => {
                    startGame(gameMode);
                }, 2000);
                return;
            }
            if (!board.includes("")) {
                document.getElementById("status").innerText = "It's a Draw!";
                gameOver = true;
                setTimeout(() => {
                    startGame(gameMode);
                }, 2000);
                return;
            }
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            document.getElementById("status").innerText = `${currentPlayer}'s Turn`;
            if (gameMode === "AI" && currentPlayer === "O") {
                setTimeout(aiMove, 500);
            }
        }

        function aiMove() {
            let bestMove = minimax(board, "O").index;
            board[bestMove] = "O";
            renderBoard();
            if (checkWinner("O")) {
                document.getElementById("status").innerText = "AI Wins!";
                document.getElementById("status").classList.add("win");
                document.body.classList.add("win");
                gameOver = true;
                showSparkles();
                updateScore();
                setTimeout(() => {
                    startGame(gameMode);
                }, 2000);
            } else if (!board.includes("")) {
                document.getElementById("status").innerText = "It's a Draw!";
                gameOver = true;
                setTimeout(() => {
                    startGame(gameMode);
                }, 2000);
            } else {
                currentPlayer = "X";
                document.getElementById("status").innerText = `${currentPlayer}'s Turn`;
            }
        }

        function checkWinner(player) {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            return winPatterns.some(pattern => 
                pattern.every(index => board[index] === player)
            );
        }

        function updateScore() {
            if (currentPlayer === "X") {
                player1Score++;
                document.getElementById("player1-score").innerText = player1Score;
            } else {
                player2Score++;
                document.getElementById("player2-score").innerText = player2Score;
            }
        }

        function minimax(newBoard, player) {
            let emptyCells = newBoard.map((val, index) => val === "" ? index : null).filter(v => v !== null);
            if (checkWinner("X")) return { score: -10 };
            if (checkWinner("O")) return { score: 10 };
            if (emptyCells.length === 0) return { score: 0 };

            let moves = [];
            for (let i of emptyCells) {
                let move = {};
                move.index = i;
                newBoard[i] = player;
                move.score = (player === "O") ? minimax(newBoard, "X").score : minimax(newBoard, "O").score;
                newBoard[i] = "";
                moves.push(move);
            }

            let bestMove = 0;
            if (player === "O") {
                let bestScore = -Infinity;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            return moves[bestMove];
        }

        function showSparkles() {
            for (let i = 0; i < 30; i++) {
                let sparkle = document.createElement("div");
                sparkle.classList.add("sparkle");
                sparkle.innerText = "✨";
                sparkle.style.left = `${Math.random() * window.innerWidth}px`;
                sparkle.style.top = `${Math.random() * window.innerHeight}px`;
                document.body.appendChild(sparkle);

                setTimeout(() => {
                    sparkle.remove();
                }, 1000);
            }
        }

        function removeSparkles() {
            const sparkles = document.querySelectorAll(".sparkle");
            sparkles.forEach(sparkle => sparkle.remove());
        }

        startGame("2P");
