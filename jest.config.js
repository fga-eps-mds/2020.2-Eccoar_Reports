module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['<rootDir>/build'],
	moduleNameMapper: {
		'@controllers/(.*)': '<rootDir>/src/controllers/$1',
		'@utils/(.*)': '<rootDir>/src/utils/$1',
		'@services/(.*)': '<rootDir>/src/services/$1',
	},
};
