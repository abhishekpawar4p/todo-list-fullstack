module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom:[
        'server/**/*.js',
        '!server/server.js',
        '!server/config/**',
    ],
    testMatch: ['**/server/tests/**/*.test.js'],
    verbose:true,
    maxWorkers:1,
};