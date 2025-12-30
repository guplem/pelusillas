import { JSX } from 'react';

/**
 * HelpPage renders the digital rules and interface guide for Pelusillas.
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
						Rules to play physically
					</button>
				</div>
				<h1> How to Play Pelusillas</h1>
				<p>
					Welcome to Pelusillas! A push-your-luck card game where you collect dust bunnies to score
					points. Draw cards carefullyget too greedy and you might bust!
				</p>

				<h2> Objective</h2>
				<p>
					Collect the most points by banking cards to your score pile. The player with the highest
					score when the deck runs out wins!
				</p>

				<h2> The Deck</h2>
				<ul>
					<li>
						<strong>110 cards total</strong> with values from 1 to 10
					</li>
					<li>
						<strong>Values 1-5:</strong> 13 cards each (65 cards)
					</li>
					<li>
						<strong>Values 6-10:</strong> 9 cards each (45 cards)
					</li>
				</ul>
				<p>Higher value cards are rarer but worth more points!</p>

				<h2>🕹️ Game Interface</h2>
				<ul>
					<li>
						<strong>Player Control Panel (Left):</strong> Your area showing:
						<ul style={{ marginTop: '4px', marginBottom: '4px' }}>
							<li>
								<strong>Banked Score:</strong> Points safely in your score pile
							</li>
							<li>
								<strong>At Risk:</strong> Face-up cards that will be lost if you bust
							</li>
							<li>
								<strong>Deck Size:</strong> Cards remaining in the draw pile
							</li>
							<li>
								<strong>Action Buttons:</strong> Draw, Steal, or Stop
							</li>
						</ul>
					</li>
					<li>
						<strong>Game Board (Center):</strong> Shows all players, their banked scores, and
						face-up cards. Your row is highlighted with your color.
					</li>
					<li>
						<strong>Game Log (Right):</strong> History of all actions and current turn indicator.
					</li>
				</ul>

				<h2> Turn Structure</h2>

				<h3>1. Banking Phase (Automatic)</h3>
				<p>
					At the start of your turn, any face-up cards from your previous turn are automatically
					moved to your score pile. These points are now safe!
				</p>

				<h3>2. Action Phase</h3>
				<p>
					You must take at least one action. You can continue drawing until you choose to stop or
					bust.
				</p>

				<h4>🃏 Draw</h4>
				<ul>
					<li>Draw the top card from the deck and add it face-up in front of you.</li>
					<li>
						<strong>Bust Rule:</strong> If the card matches the value of any card you already have
						face-up, AND you have 3 or more face-up cards after drawing, you BUST! All your face-up
						cards go to the discard pile.
					</li>
				</ul>

				<h4> Steal (Optional)</h4>
				<ul>
					<li>
						Instead of drawing from the deck, you may steal one face-up card from another player.
					</li>
					<li>
						<strong>First Two Cards:</strong> Drawing is mandatory for your first two cards each
						turn (you cannot steal).
					</li>
					<li>
						<strong>After Two Cards:</strong> Stealing becomes optional. You can choose to draw from
						deck or steal from an opponent.
					</li>
					<li>The same bust rules apply when stealing!</li>
				</ul>

				<h4> Stop</h4>
				<ul>
					<li>You may stop at any time after drawing at least one card.</li>
					<li>
						Your face-up cards remain in front of you and will be banked at the start of your next
						turn.
					</li>
					<li>Play passes to the next player.</li>
				</ul>

				<h2> Bust!</h2>
				<p>
					You bust when you draw or steal a card that matches the value of a card you already have
					face-up, AND you have 3 or more face-up cards total. When you bust:
				</p>
				<ul>
					<li>All your face-up cards go to the discard pile</li>
					<li>You score nothing this turn</li>
					<li>Your turn ends immediately</li>
				</ul>
				<p>
					<strong>Note:</strong> Having 2 cards with the same value is safe! You only bust if you
					have 3+ cards total when you draw a duplicate.
				</p>

				<h2> Scoring</h2>
				<p>
					Each card in your score pile is worth its face value. Add up all card values to get your
					total score.
				</p>

				<h2> End of Game</h2>
				<p>The game ends when the deck runs out. When this happens:</p>
				<ul>
					<li>The current turn completes</li>
					<li>All remaining face-up cards are banked to score piles</li>
					<li>Final scores are calculated</li>
				</ul>

				<h3>Tiebreaker</h3>
				<p>
					If two or more players have the same score, the player with the most unique card values in
					their score pile wins!
				</p>

				<h2> Strategy Tips</h2>
				<ul>
					<li>
						<strong>Risk Management:</strong> The more face-up cards you have, the higher your
						chance of busting. Know when to stop!
					</li>
					<li>
						<strong>Card Counting:</strong> Pay attention to what values have been played. Higher
						values are rarer and safer to collect.
					</li>
					<li>
						<strong>Stealing:</strong> Steal high-value cards from opponents when possible, but be
						careful of duplicates!
					</li>
					<li>
						<strong>Two is Safe:</strong> You can safely have 2 cards of the same value. The bust
						only triggers with 3+ total cards.
					</li>
				</ul>
			</div>
		</div>
	);
}
