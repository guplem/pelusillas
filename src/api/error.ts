export default async (): Promise<Response> => {
	return new Response(null, {
		status: 404,
	});
};
