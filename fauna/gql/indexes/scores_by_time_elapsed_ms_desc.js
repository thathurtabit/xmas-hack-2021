CreateIndex(
    {
        name: 'scores_by_time_elapsed_ms_desc',
        source: Collection('Score'),
        values: [
            {field: ['data', 'timeElapsedMs'], reverse: true},
            {field: 'ts', reverse: true},
            {field: 'ref'}
        ]
    },
)
