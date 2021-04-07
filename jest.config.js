module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['build'],
	moduleNameMapper: {
		'@controllers/(.*)': '<rootDir>/src/controllers/$1',
		'@utils/(.*)': '<rootDir>/src/utils/$1',
	},
};
