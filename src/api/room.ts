import { Flashcore, logger } from 'robo.js';

const roomsDatabaseKey: string = 'rooms';

export default async (request: Request): Promise<Response> => {
	try {
		if (request.method == 'HEAD') {
			return await exists(request);
		}

		if (request.method == 'POST') {
			return await create(request);
		}

		return new Response(`Method ${request.method} not allowed`, {
			status: 405,
		});
	} catch (error) {
		logger.error('Error in room API:', error);
		return new Response(JSON.stringify({ message: `Internal server error: ${error}` }), {
			status: 500,
		});
	}
};

const exists = async (request: Request): Promise<Response> => {
	const urlParams: URLSearchParams = new URLSearchParams(request.url.split('?')[1] ?? '');
	const roomName: string | null = urlParams.get('roomName');
	logger.info(`Checking if room "${roomName}" exists...`);

	const allRooms: string[] = (await Flashcore.get<string[]>(roomsDatabaseKey)) ?? [];
	logger.debug(`All rooms: ${JSON.stringify(allRooms)}`);

	const found: boolean = roomName !== null && allRooms.some((room) => room === roomName);
	logger.debug(`Room "${roomName}" exists: ${found}`);

	// Because the HTTP method is HEAD, only status codes can be returned, no body
	if (found) {
		return new Response(JSON.stringify(null), {
			status: 200,
		});
	} else {
		return new Response(JSON.stringify(null), {
			status: 404,
		});
	}
};

const create = async (request: Request): Promise<Response> => {
	logger.info('Creating room...');
	const body: Record<string, unknown> = await request.json();
	const providedName: string | undefined = body.name as string | undefined;
	logger.debug(`Provided room name: ${providedName}`);

	// Check the room name validity
	if (providedName === undefined || providedName === '') {
		return new Response(JSON.stringify({ message: 'Room name is required' }), { status: 422 });
	}
	if (providedName.length < 3) {
		return new Response(
			JSON.stringify({ message: 'Room name must be at least 3 characters long' }),
			{ status: 422 },
		);
	}
	if (providedName.length > 20) {
		return new Response(
			JSON.stringify({ message: 'Room name must be at most 20 characters long' }),
			{ status: 422 },
		);
	}
	if (!/^[a-zA-Z0-9_ ]+$/.test(providedName)) {
		return new Response(
			JSON.stringify({
				message: 'Room name can only contain letters, numbers, spaces and underscores',
			}),
			{ status: 422 },
		);
	}

	// Check if the room name already exists
	const allRooms: string[] = (await Flashcore.get<string[]>(roomsDatabaseKey)) ?? [];
	const found: boolean = allRooms.some((room) => room === providedName);
	if (found) {
		return new Response(JSON.stringify({ message: 'Room already exists' }), { status: 409 });
	}

	await Flashcore.set<string[]>(roomsDatabaseKey, [...allRooms, providedName]);
	logger.info(`Room "${providedName}" created successfully`);
	return new Response(JSON.stringify({ message: 'Room created successfully' }), { status: 200 });
};
