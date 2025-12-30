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
					You must draw at least 3 cards before you can stop. After that, you can continue drawing
					or stop to keep your cards.
				</p>

				<h4>🃏 Draw</h4>
				<ul>
					<li>Draw the top card from the deck and add it face-up in front of you.</li>
					<li>
						<strong>Bust Rule:</strong> If you have 3 or more cards and draw a duplicate (a card
						matching a value you already have), you BUST! All your face-up cards go to the discard
						pile.
					</li>
					<li>
						<strong>Note:</strong> Pairs are safe as long as you have fewer than 3 total cards. Once
						you have 3+ cards, any duplicate draw will bust you!
					</li>
				</ul>

				<h4> Steal Decision</h4>
				<ul>
					<li>
						When you draw a card, if any opponent has a face-up card matching the value you just
						drew, you get a <strong>steal opportunity</strong>.
					</li>
					<li>
						You can choose to <strong>Steal</strong> (take all matching cards from opponents) or{' '}
						<strong>Don&apos;t Steal</strong> (keep only the card you drew).
					</li>
					<li>
						<strong>Important:</strong> Stealing does NOT cause a bust! Only drawing from the deck
						can bust you.
					</li>
				</ul>

				<h4> Stop</h4>
				<ul>
					<li>
						You may stop at any time after you have at least 3 face-up cards (you must draw at least
						3 times per turn).
					</li>
					<li>
						Your face-up cards remain in front of you and will be banked at the start of your next
						turn.
					</li>
					<li>Play passes to the next player.</li>
				</ul>

				<h2> Bust!</h2>
				<p>
					You bust when you have 3 or more cards and draw a duplicate (a card matching a value you
					already have). When you bust:
				</p>
				<ul>
					<li>All your face-up cards go to the discard pile</li>
					<li>You score nothing this turn</li>
					<li>Your turn ends immediately</li>
				</ul>
				<p>
					<strong>Note:</strong> Pairs are safe when you have fewer than 3 cards! Once you have 3+
					cards, drawing any duplicate will bust you.
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
						chance of busting. Once you have 3+ cards, any duplicate draw will bust you!
					</li>
					<li>
						<strong>Card Counting:</strong> Pay attention to what values have been played. Higher
						values are rarer and safer to collect.
					</li>
					<li>
						<strong>Steal Freely:</strong> Stealing doesn&apos;t cause busts, so take those cards
						when offered!
					</li>
					<li>
						<strong>Early Pairs are Safe:</strong> Your first two cards can be a pair safely. The
						risk only starts after your 3rd card.
					</li>
				</ul>
			</div>
		</div>
	);
}
