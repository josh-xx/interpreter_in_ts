module.exports = {
    testMatch: [
        '**/tests/*.ts'
    ],
    transform: {
        '\\.ts$': [
            '@swc-node/jest',
            {
                dynamicImport: true,
            },
        ],
    },
}
