module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	testResultsProcessor: 'jest-sonar-reporter',
	coveragePathIgnorePatterns: ['/node_modules/', '/test/', '/db/'],
	testPathIgnorePatterns: ['<rootDir>/build'],
	moduleNameMapper: {
		'@controllers/(.*)': '<rootDir>/src/controllers/$1',
		'@utils/(.*)': '<rootDir>/src/utils/$1',
		'@services/(.*)': '<rootDir>/src/services/$1',
	},
};
