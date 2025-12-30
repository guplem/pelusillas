import { JSX, useState } from 'react';

/**
 * HelpPagePhysical renders the physical game rules for Boom in both English and Spanish.
 * Users can switch languages using the flag button. All content is static and matches the official rules.
 */
export default function HelpPagePhysical(): JSX.Element {
	// 'en' for English, 'es' for Spanish
	const [lang, setLang] = useState<'en' | 'es'>('en');

	/**
	 * Handles language switching between English and Spanish.
	 * @param l The language code to switch to ('en' or 'es').
	 */
	const handleLangSwitch = (l: 'en' | 'es'): void => {
		setLang(l);
	};

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
				<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
					<button
						aria-label={lang === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
						onClick={(): void => handleLangSwitch(lang === 'en' ? 'es' : 'en')}
					>
						{lang === 'en' ? 'Cambiar a Español' : 'Switch to English'}
					</button>
				</div>
				{lang === 'en' ? <EnglishRules /> : <SpanishRules />}
			</div>
		</div>
	);
}

/**
 * EnglishRules renders the full English rules for the physical Boom card game.
 */
function EnglishRules(): JSX.Element {
	return (
		<div>
			<h1>
				🎴 <strong>Boom</strong> — Card Game
			</h1>
			<h2>🃏 Required Materials</h2>
			<p>Play with a poker deck or equivalent, which must include:</p>
			<ul>
				<li>
					Numbered cards: <strong>A (1), 2, 3, 4, 5, 6, 7, 8, 9, 10</strong>
				</li>
				<li>
					Face cards: <strong>J, Q, K</strong>
				</li>
			</ul>
			<p>Each card should exist in multiple copies (ideally at least 4, one per suit).</p>
			
			<h2>🎯 Objective of the Game</h2>
			<p>
				The goal is to be the <strong>last player standing</strong>, eliminating others by
				destroying all their <strong>accumulator cards</strong>.
			</p>
			
			<h2>🧩 Setup</h2>
			<ol>
				<li>
					Shuffle all cards and place them as a <strong>face-down deck</strong> in the center of the
					table.
				</li>
				<li>
					Set aside space for a <strong>discard pile</strong>.
				</li>
				<li>
					Each player is given:
					<ul>
						<li>
							<strong>3 cards in hand</strong> (randomly drawn).
						</li>
						<li>
							<strong>3 cards on the board</strong>, in front of the player, which act as{' '}
							<strong>accumulators</strong>.<br />
							<em>
								The initial value of each accumulator is the value of the corresponding card.
								<br />
								If all 3 cards are face cards, they must be redrawn.
							</em>
						</li>
					</ul>
				</li>
			</ol>
			
			<h2>🔢 Card Values</h2>
			<table style={{ width: '100%', marginBottom: 8 }}>
				<thead>
					<tr>
						<th>Card</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>A (1)</td>
						<td>1</td>
					</tr>
					<tr>
						<td>2 – 10</td>
						<td>Their numeric value</td>
					</tr>
					<tr>
						<td>J, Q, K</td>
						<td>0</td>
					</tr>
				</tbody>
			</table>
			<ul>
				<li>
					A card’s value represents both the <strong>maximum life</strong> that can be stored and
					its <strong>attack strength</strong>.
				</li>
				<li>
					<strong>Face cards</strong> (J, Q, K) <strong>do not store life</strong> and{' '}
					<strong>cannot be attacked</strong>.
				</li>
			</ul>
			
			<h2>🔄 Game Turn</h2>
			<p>
				Each turn consists of three phases, where the player can perform{' '}
				<strong>one action of each type</strong>, in the specified order: Swap, Action (discard,
				attack, or Boom), and End turn.
			</p>
			<ol>
				<li>
					<strong>Swap</strong>
					<ul>
						<li>
							You may exchange <strong>one card from your hand</strong> with{' '}
							<strong>one of your board cards</strong> (accumulator).
						</li>
						<li>
							<em>Swapping is optional.</em>
						</li>
						<li>
							You cannot swap an accumulator that has been attacked (i.e., one with another card on
							top).
						</li>
						<li>
							The (initial) value of the accumulator becomes that of the new card, and the old card
							moves to your hand and can be used for attacking, Boom, discarding, or swapping again
							in future turns.
						</li>
					</ul>
				</li>
				<li>
					<strong>Action: Choose Between Discard, Attack or Boom</strong>
					<ul>
						<li>
							You must choose <em>exactly</em> <strong>one of the following actions</strong>:
						</li>
						<li>
							<strong>Attack</strong>
							<ul>
								<li>
									Choose <strong>one card from your hand</strong>.
								</li>
								<li>
									Select <strong>an accumulator of an opponent</strong> that is{' '}
									<strong>not a face card</strong>, since face cards cannot be attacked.
								</li>
								<li>
									The attacking card <strong>must not exceed</strong> the current value (or
									remaining life) of the accumulator. The subtraction cannot result in a negative
									number.
								</li>
								<li>
									Place the attacking card on top of the opponent's accumulator. Subtract the value
									of the attacking card from the current value of the accumulator to get the new
									value. If, after the attack, the accumulator reaches <strong>0</strong>, it is
									removed from the board along with the attacking card and any others stacked on
									top.
								</li>
								<li>
									<strong>Gaining Extra Accumulators:</strong> If the{' '}
									<strong>original value</strong> of the accumulator is{' '}
									<strong>exactly equal</strong> to the attacking card’s value, and the accumulator
									is destroyed in a single blow, you gain an <strong>extra accumulator</strong>{' '}
									(draw a card from the deck and place it on the board as a new accumulator, then
									draw one card to refill your hand).
								</li>
							</ul>
						</li>
						<li>
							<strong>Boom</strong>
							<ul>
								<li>
									You must have <strong>3 face cards</strong> (J, Q, K) in your hand.
								</li>
								<li>
									Declare a number from <strong>1 to 10</strong> (e.g., “Boom on 2”).
								</li>
								<li>
									All <strong>accumulators</strong> on the board with exactly that value are
									eliminated immediately (including any stacked cards). This applies to both
									opponents' and your own accumulators if applicable.
								</li>
								<li>The 3 face cards used for Boom are discarded to the pile.</li>
								<li>Boom cannot be used on face cards.</li>
							</ul>
						</li>
						<li>
							<strong>Discard</strong>
							<ul>
								<li>
									If you choose not to attack or use Boom, you <strong>must discard</strong> between{' '}
									<strong>1 and 3 cards</strong> from your hand to the discard pile.
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li>
					<strong>End Turn</strong>
					<ul>
						<li>
							If you discarded 1 to 3 cards, draw the same number from the deck to return to 3 cards
							in hand.
						</li>
						<li>If you attacked, draw 1 card.</li>
						<li>If you performed a Boom, draw 3 cards.</li>
						<li>
							Exception (extra accumulator): When you gain an extra accumulator after an exact
							attack, the card used for the extra accumulator is placed directly on the board, and
							you then draw 1 card from the deck to refill your hand.
						</li>
						<li>Once you've drawn cards, your turn ends and play passes to the next player.</li>
					</ul>
				</li>
			</ol>
			
			<h2>🚨 End of Game</h2>
			<ul>
				<li>
					<strong>Elimination:</strong> A player is eliminated when all their board cards have been
					destroyed or when the sum of their accumulator values is 0 (e.g., only face cards remain).
				</li>
				<li>
					<strong>Victory:</strong> The winner is the last player with at least one accumulator
					holding life.
				</li>
				<li>If all players are eliminated simultaneously, the game ends in a draw.</li>
			</ul>
			
			<h2>🔁 Additional Rules</h2>
			<ul>
				<li>
					Cards are continuously shuffled, so card counting is not possible, except for those
					visible on the board.
				</li>
				<li>When the deck runs out, shuffle the discard pile to form a new deck.</li>
			</ul>
		</div>
	);
}

/**
 * SpanishRules renders the full Spanish rules for the physical Boom card game.
 */
function SpanishRules(): JSX.Element {
	return (
		<div>
			<h1>
				🎴 <strong>Boom</strong> — Juego de Cartas
			</h1>
			<h2>🃏 Material Necesario</h2>
			<p>Se juega con una baraja de póker o equivalente, que debe incluir:</p>
			<ul>
				<li>
					Cartas numeradas: <strong>A (1), 2, 3, 4, 5, 6, 7, 8, 9, 10</strong>
				</li>
				<li>
					Figuras: <strong>J, Q, K</strong>
				</li>
			</ul>
			<p>Cada carta debe existir en varias copias (idealmente al menos 4, una por cada palo).</p>
			
			<h2>🎯 Objetivo del Juego</h2>
			<p>
				El objetivo es ser el <strong>último jugador en pie</strong>, eliminando a los demás al
				destruir todos sus <strong>acumuladores</strong>.
			</p>
			
			<h2>🧩 Preparación</h2>
			<ol>
				<li>
					Baraja todas las cartas y colócalas formando el <strong>mazo boca abajo</strong> en el
					centro de la mesa.
				</li>
				<li>
					Dispón un espacio para la <strong>pila de descartes</strong>.
				</li>
				<li>
					A cada jugador se le asignan:
					<ul>
						<li>
							<strong>3 cartas en la mano</strong> (elegidas al azar).
						</li>
						<li>
							<strong>3 cartas en el tablero</strong>, frente al jugador, que actuarán como{' '}
							<strong>acumuladores</strong>.<br />
							<em>
								El valor inicial de cada acumulador es el valor de la carta correspondiente.
								<br />
								En el caso de que las 3 cartas sean figuras, se vuelven a repartir las cartas.
							</em>
						</li>
					</ul>
				</li>
			</ol>
			
			<h2>🔢 Valores de las Cartas</h2>
			<table style={{ width: '100%', marginBottom: 8 }}>
				<thead>
					<tr>
						<th>Carta</th>
						<th>Valor</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>A (1)</td>
						<td>1</td>
					</tr>
					<tr>
						<td>2 – 10</td>
						<td>Su valor numérico</td>
					</tr>
					<tr>
						<td>J, Q, K</td>
						<td>0</td>
					</tr>
				</tbody>
			</table>
			<ul>
				<li>
					El valor de una carta representa tanto <strong>la vida máxima</strong> que puede almacenar
					el acumulador como la <strong>fuerza de ataque</strong> de la carta.
				</li>
				<li>
					Las <strong>figuras</strong> (J, Q, K) <strong>no almacenan vida</strong> y{' '}
					<strong>no pueden ser atacadas</strong>.
				</li>
			</ul>
			
			<h2>🔄 Turno de Juego</h2>
			<p>
				Cada turno se compone de tres fases, donde el jugador puede realizar{' '}
				<strong>una acción de cada tipo</strong>, en el orden especificado: Cambiar, Accionar
				(descartar, atacar o invocar Boom) y Finalizar el turno.
			</p>
			<ol>
				<li>
					<strong>Cambiar</strong>
					<ul>
						<li>
							Puedes intercambiar <strong>una carta de tu mano</strong> con{' '}
							<strong>una de tus cartas en el tablero</strong> (acumulador).
						</li>
						<li>
							<em>No es obligatorio cambiar.</em>
						</li>
						<li>
							No se puede cambiar un acumulador que haya sido atacado (es decir, que tenga otra
							carta encima).
						</li>
						<li>
							El valor (inicial) del acumulador pasa a ser el de la nueva carta, y la carta anterior
							pasa a la mano del jugador, pudiéndose usar para atacar, boom, descartar o cambiarla
							otra vez en turnos posteriores.
						</li>
					</ul>
				</li>
				<li>
					<strong>Acción: Elegir Entre Descartar, Atacar o Boom</strong>
					<ul>
						<li>
							Debes escoger <em>exactamente</em> <strong>una de las siguientes acciones</strong>:
						</li>
						<li>
							<strong>Atacar</strong>
							<ul>
								<li>
									Elige <strong>una carta de tu mano</strong>.
								</li>
								<li>
									Escoge <strong>un acumulador de un enemigo</strong> que{' '}
									<strong>no sea una figura</strong>, ya que las figuras no pueden recibir ataque.
								</li>
								<li>
									La carta atacante <strong>no puede tener un valor superior</strong> al valor
									actual (o vida restante) del acumulador. Es decir, no se permite que la resta
									resulte en un valor negativo.
								</li>
								<li>
									Coloca la carta atacante sobre el acumulador enemigo. Resta el valor de la carta
									al valor actual del acumulador para obtener el nuevo valor. Si, tras el ataque, el
									acumulador llega a <strong>0</strong>, éste se retira del tablero juntamente con
									la carta atacante y todas las cartas que haya encima.
								</li>
								<li>
									<strong>Ganar Acumuladores Extra:</strong> Si el <strong>valor original</strong>{' '}
									del acumulador es <strong>exactamente igual</strong> al valor de la carta atacante
									y, con ello, se destruye el acumulador de un enemigo en un solo ataque, ganas un{' '}
									<strong>acumulador extra</strong> (toma una carta del mazo y colócala en el
									tablero como un nuevo acumulador, luego roba una carta para reponer tu mano).
								</li>
							</ul>
						</li>
						<li>
							<strong>Boom</strong>
							<ul>
								<li>
									Debes tener en tu mano <strong>3 figuras</strong> (J, Q, K).
								</li>
								<li>
									Declara un número del <strong>1 al 10</strong> (por ejemplo, “Boom al 2”).
								</li>
								<li>
									Se eliminan del tablero <strong>todos los acumuladores</strong> que tengan
									exactamente ese valor en ese instante (incluyendo las cartas que tuvieran encima).
									Esta eliminación afecta tanto a los acumuladores de los oponentes como a los tuyos
									si alguno coincide.
								</li>
								<li>Las 3 figuras que usaste para el Boom se descartan a la pila de descartes.</li>
								<li>No se puede hacer Boom sobre acumuladores de figuras.</li>
							</ul>
						</li>
						<li>
							<strong>Descartar</strong>
							<ul>
								<li>
									Si decides no realizar un ataque ni un Boom, <strong>debes descartar</strong>{' '}
									entre <strong>1 y 3 cartas</strong> de tu mano a la pila de descartes.
								</li>
							</ul>
						</li>
					</ul>
				</li>
				<li>
					<strong>Finalizar el Turno</strong>
					<ul>
						<li>
							Si descartaste 1 a 3 cartas, robas la misma cantidad de cartas del mazo para volver a
							tener 3 en tu mano.
						</li>
						<li>Si atacaste, robas 1 carta.</li>
						<li>Si realizaste un Boom, robas 3 cartas.</li>
						<li>
							Excepción (acumulador extra): Cuando ganas un acumulador extra tras destruir un
							acumulador con un ataque exacto, la carta que sirve para el acumulador extra se coloca
							directamente en el tablero y, posteriormente, robas 1 carta del mazo para completar tu
							mano.
						</li>
						<li>
							Una vez completado el robo, tu turno finaliza y el juego continúa con el siguiente
							jugador.
						</li>
					</ul>
				</li>
			</ol>
			
			<h2>🚨 Fin del Juego</h2>
			<ul>
				<li>
					<strong>Eliminación:</strong> Un jugador es eliminado cuando todas sus cartas en el
					tablero han sido destruidas o cuando, al sumar los valores de sus acumuladores, el total
					es 0 (por ejemplo, si únicamente quedan figuras en el tablero).
				</li>
				<li>
					<strong>Victoria:</strong> El ganador es el último jugador que tenga al menos un
					acumulador con vida.
				</li>
				<li>
					En caso de que todos los jugadores sean eliminados simultáneamente, el juego termina en
					empate.
				</li>
			</ul>
			
			<h2>🔁 Reglas Adicionales</h2>
			<ul>
				<li>
					Las cartas se barajan constantemente, de manera que contar cartas no es posible, salvo
					aquellas que están visibles en el tablero.
				</li>
				<li>Cuando el mazo se agota, baraja la pila de descartes para formar un nuevo mazo.</li>
			</ul>
		</div>
	);
}
