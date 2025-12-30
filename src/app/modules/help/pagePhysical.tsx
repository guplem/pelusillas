import { JSX } from 'react';

/**
 * HelpPagePhysical renders the physical game rules for Pelusillas.
 */
export default function HelpPagePhysical(): JSX.Element {
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
					maxWidth: '900px',
					textAlign: 'justify',
				}}
			>
				<h1>Pelusillas Physical Game Rules</h1>
				<p>
					<strong>Pelusillas</strong> is a push-your-luck card game for 2-6 players. This page
					describes how to play with a physical deck of cards.
				</p>

				<h2>Materials Needed</h2>
				<ul>
					<li>110 cards with values 1-10</li>
					<li>Values 1-5: 13 cards each</li>
					<li>Values 6-10: 9 cards each</li>
				</ul>
				<p>
					<em>Tip:</em> Use two standard decks with Ace=1, 2-10 as face values, removing face cards
					and adjusting quantities as needed.
				</p>

				<h2>Setup</h2>
				<ol>
					<li>Shuffle all 110 cards into a face-down draw pile.</li>
					<li>Designate a discard pile area.</li>
					<li>Give each player space for their face-up cards and score pile.</li>
				</ol>

				<h2>How to Play</h2>
				<h3>Turn Structure</h3>
				<ol>
					<li>
						<strong>Banking Phase:</strong> Move any face-up cards from your previous turn to your
						score pile (safe points).
					</li>
					<li>
						<strong>Action Phase:</strong> Draw cards face-up. You must draw at least once. Continue
						drawing or stop at any time.
					</li>
				</ol>

				<h3>Drawing</h3>
				<ul>
					<li>Draw the top card from the deck and place it face-up in front of you.</li>
					<li>
						<strong>Bust Rule:</strong> If you draw a card matching a value you already have face-up
						AND you have 3+ total face-up cards, you BUST.
					</li>
					<li>When you bust, all face-up cards go to the discard pile.</li>
				</ul>

				<h3>Stealing (Optional)</h3>
				<ul>
					<li>After your first 2 cards, you may steal from another player instead of drawing.</li>
					<li>Take one of their face-up cards and add it to your face-up area.</li>
					<li>The same bust rules apply when stealing.</li>
				</ul>

				<h3>Stopping</h3>
				<ul>
					<li>Say &ldquo;Stop&rdquo; to end your turn.</li>
					<li>Your face-up cards remain and will be banked at the start of your next turn.</li>
				</ul>

				<h2>Scoring</h2>
				<p>Each card is worth its face value. Add up all cards in your score pile.</p>

				<h2>Game End</h2>
				<p>
					The game ends when the draw pile is empty. Complete the current turn, then all players
					bank their remaining face-up cards.
				</p>
				<p>
					<strong>Tiebreaker:</strong> If scores are tied, the player with more unique card values
					wins.
				</p>

				<h2>Quick Reference</h2>
				<table style={{ width: '100%', borderCollapse: 'collapse' }}>
					<thead>
						<tr style={{ borderBottom: '2px solid var(--text)' }}>
							<th style={{ textAlign: 'left', padding: '8px' }}>Action</th>
							<th style={{ textAlign: 'left', padding: '8px' }}>Effect</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style={{ padding: '8px' }}>Draw</td>
							<td style={{ padding: '8px' }}>Take top card from deck, place face-up</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>Steal</td>
							<td style={{ padding: '8px' }}>Take face-up card from opponent (after 2 draws)</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>Stop</td>
							<td style={{ padding: '8px' }}>End turn, keep face-up cards to bank next turn</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>Bust</td>
							<td style={{ padding: '8px' }}>Duplicate with 3+ cards = lose all face-up cards</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
