import { JSX } from 'react';

/**
 * HelpPage renders the digital rules and interface guide for Boom.
 * This page is accessible via /help and is intended for new and returning players.
 */
export default function HelpPage(): JSX.Element {
	return (
		<div
			className='centeredChildren'
			style={{
				minHeight: '100vh',
				minWidth: '100vw',
				flexDirection: 'column',
				padding: '20px 0',
			}}
		>
			<div
				style={{
					backgroundColor: 'var(--container)',
					borderRadius: '10px',
					padding: '20px 40px',
					maxWidth: '800px',
					textAlign: 'justify',
				}}
			>
				{/* Top right buttons: Physical Game Rules and Close Tab */}
				<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
					<button
						style={{ marginRight: 12 }}
						aria-label='Open physical game rules'
						onClick={(): void => {
							window.open('/help/physical', '_blank', 'noopener');
						}}
					>
						📖 Rules to play physically
					</button>
				</div>
				<h1>🎴 How to Play Boom</h1>
				<p>
					Welcome to the digital version of Boom! Here’s everything you need to know to play the
					game.
				</p>
				<h2>🎯 Objective</h2>
				<p>
					The goal is to be the <strong>last player standing</strong> by eliminating others. You do
					this by reducing to 0 all of their life storage cards (called "accumulators").
				</p>
				<h2>🔢 Card Values</h2>
				<ul>
					<li>
						<strong>0 to 10:</strong> Cards have a value from 0 to 10.
					</li>
				</ul>
				<p>
					A card's value represents its attack strength when played from your hand, or the maximum
					life an accumulator can hold when on the board.
				</p>
				<p>
					Cards with a value of 0 are kind of special cards and are required for the "Boom" action.
				</p>
				<h2>🕹️ Game Interface</h2>
				<ul>
					<li>
						<strong>Player Control Panel (Left):</strong> This is your area. It shows your hand,
						action controls and your stats:
						<ul style={{ marginTop: '4px', marginBottom: '4px' }}>
							<li>
								<strong>Defenses:</strong> The amount of accumulators with more than 0 HP.
							</li>
							<li>
								<strong>HP:</strong> The sum of the health of all your accumulators.
							</li>
							<li>
								<strong>Acc:</strong> Your accumulator count.
							</li>
						</ul>
					</li>
					<li>
						<strong>Game Board (Center):</strong> Displays all players and their accumulators. Your
						row is highlighted and it has your color.
					</li>
					<li>
						<strong>Game Log (Right):</strong> Shows a history of all actions taken in the game,
						turn by turn and the name of current player's turn.
					</li>
				</ul>
				<h2>🔄 Game Turn</h2>
				<p>
					On your turn, you must perform some actions. The game will automatically progress to the
					next player after your action. The main actions are: Swap, Attack, Boom, or Discard.
				</p>
				<h3>Swap</h3>
				<ul>
					<li>
						<strong>Objective:</strong> Swap a card from your hand with one of your own accumulator
						cards on the board.
					</li>
					<li>
						<strong>How to do it:</strong> Click a card in your hand to select it, then click one of
						your own accumulator cards on the board.
					</li>
					<li>
						<strong>Rules:</strong> You can only swap with accumulators that have not been attacked
						yet.
					</li>
					<li>
						<strong>After the action:</strong> This is the only action that does not end your turn,
						allowing you to perform another action afterward.
					</li>
				</ul>
				<h3>Attack</h3>
				<ul>
					<li>
						<strong>Objective:</strong> Attack an opponent's accumulator card to reduce its HP or
						destroy it.
					</li>
					<li>
						<strong>How to do it:</strong> Select a card from your hand by clicking it, then click
						an opponent's accumulator card on the board.
					</li>
					<li>
						<strong>Rules:</strong> The value of your attacking card must be less than or equal to
						the accumulator's current HP (you cannot reduce HP below zero). You cannot attack
						accumulators with an original value of 0.
					</li>
					<li>
						<strong>After the action:</strong> The card you used to attack is lost, and your turn
						ends immediately.
					</li>
					<li>
						<strong>Special:</strong> <em>Extra Accumulator:</em> If you destroy an accumulator with
						a single attack (your attack is the first to that accumulator and your card's value
						matches the accumulator's original value), you gain a new random accumulator card on
						your board.
					</li>
				</ul>
				<h3>Boom</h3>
				<ul>
					<li>
						<strong>Objective:</strong> Destroy all accumulators on the board with a specific HP
						value.
					</li>
					<li>
						<strong>How to do it:</strong> You can only use Boom if your entire hand consists of
						cards with value 0. Enter a number from 1-9 in the input field in your control panel and
						click the "Boom" button.
					</li>
					<li>
						<strong>Rules:</strong> All accumulators on the board (including your own!) with a
						current HP exactly matching the number you entered are instantly destroyed.
					</li>
					<li>
						<strong>After the action:</strong> You lose all cards in your hand, and your turn ends
						immediately.
					</li>
				</ul>
				<h3>Discard</h3>
				<ul>
					<li>
						<strong>Objective:</strong> Discard a card from your hand if you cannot or do not want
						to perform any of the above actions.
					</li>
					<li>
						<strong>How to do it:</strong> Select a card from your hand and click the "Discard Hand
						Card" button.
					</li>
					<li>
						<strong>After the action:</strong> The selected card is removed from your hand, and your
						turn ends immediately.
					</li>
				</ul>
				<h2>🔚 End of Turn</h2>
				<p>
					Once your turn has finished, after performing an attack, boom or discard, the game
					automatically draws new cards to replenish your hand, and play passes to the next player.
				</p>
				<h2>🚨 End of Game</h2>
				<p>
					The game ends when only one player remains with HP. The last player standing is declared
					the winner!
				</p>
				<p>
					<strong>Elimination:</strong> A player is eliminated when the sum of all their
					accumulators' HP is equal to 0 at the end of their turn. This means you can be eliminated
					even if you still have accumulators on the board with value 0.
				</p>
			</div>
		</div>
	);
}
