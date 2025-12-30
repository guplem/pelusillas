// import { Cron } from '@robojs/cron';
import { logger } from 'robo.js/logger.js';

export default (): void => {
	logger.info('🚀 Starting cron jobs...');

	// Cron('*/10 * * * * *', (): void => {
	// 	logger.info(`⏰ Cron job executed at ${new Date().toISOString()}`);
	// });
};
