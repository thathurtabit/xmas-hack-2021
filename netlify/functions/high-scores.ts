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

    const scores = data.highScores.data.map(({_id, timeElapsedMs, player: { name }}) => ({ _id, timeElapsedMs, name }))
    if (!scores.find(score => score._id === data.playerScore._id)) {
        scores.push({
            _id: data.playerScore._id,
            timeElapsedMs: data.playerScore.timeElapsedMs,
            name: data.playerScore.player.name
        })
    }

    return {
        statusCode: 200,
        body: JSON.stringify(scores),
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
        highScores(_size: 5) {
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
