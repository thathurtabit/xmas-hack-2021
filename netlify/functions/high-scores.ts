import {gql, GraphQLClient} from 'graphql-request'
import {Handler} from "@netlify/functions"

const handler: Handler = async (event) => {
    const scoreID = event.queryStringParameters.scoreId

    if (!scoreID) {
        return {
            statusCode: 400,
            body: "Error: Must provide 'scoreId' parameter"
        }
    }

    const data = await getGQLClient().request(query, {scoreID})

    const playerScoreId = data.playerScore && data.playerScore._id

    const scores = data.highScores.data.map(
        ({
             _id,
             timeElapsedMs,
             player: { name }
        }) =>
            ({
                name,
                timeElapsedMs,
                isPlayer: _id == playerScoreId,
            })
    )
    if (data.playerScore && !scores.find(score => score.isPlayer)) {
        scores.push({
            name: data.playerScore.player.name,
            timeElapsedMs: data.playerScore.timeElapsedMs,
            isPlayer: true,
        })
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ highScores: scores }),
    }
}

const getGQLClient = () => {
    const endpoint = process.env.FAUNA_GRAPHQL_URL
    return new GraphQLClient(endpoint, {
        headers: {
            authorization: `Bearer ${process.env.FAUNA_API_KEY}`,
        },
    })
}

const query = gql`
    query ScoreBoardData($scoreID: ID!) {
        playerScore: findScoreByID(id: $scoreID) {
            _id,
            timeElapsedMs,
            player {
                name
            }
        },
        highScores(_size: 10) {
            data {
                _id,
                timeElapsedMs,
                player {
                    name
                }
            },
            after
        }
    }
`

export {handler}
