import {Handler} from "@netlify/functions";
import {gql, GraphQLClient} from "graphql-request";

const handler: Handler = async (event) => {
    if (event.httpMethod != "POST") {
        return {
            statusCode: 405,
            body: "HTTP Method Not Allowed"
        }
    }

    const {elapsedTimeMs, name} = event.queryStringParameters

    if (!elapsedTimeMs) {
        return {
            statusCode: 400,
            body: "Error: Must provide 'elapsedTimeMs' parameter"
        }
    }
    const score = parseInt(elapsedTimeMs)

    if (!name) {
        return {
            statusCode: 400,
            body: "Error: Must provide 'name' parameter"
        }
    }

    const findPlayerResult = await getGQLClient().request(queryFindPlayer, {name})
    const playerID = findPlayerResult.playerByName && findPlayerResult.playerByName._id
      || await getGQLClient().request(mutationCreatePlayer, {name})
        .then(result => result.createPlayer._id)
    const submitScoreResult = await getGQLClient().request(mutationSubmitScore, {playerID, score})

    return {
        statusCode: 200,
        body: JSON.stringify({ scoreID: submitScoreResult.createScore._id })
    }
}

const queryFindPlayer = gql`
    query FindPlayer($name: String!) {
        playerByName(name: $name) {
            _id
        }
    }
`

const mutationCreatePlayer = gql`
    mutation CreatePlayer($name: String!) {
        createPlayer(data: { name: $name }) {
            _id
        }
    }
`

const mutationSubmitScore = gql`
    mutation SubmitScore($playerID: ID!, $score: Int!) {
        createScore(data: { timeElapsedMs: $score, player: { connect: $playerID } }) {
            _id
        }
    }
`

const getGQLClient = () => {
    const endpoint = process.env.FAUNA_GRAPHQL_URL
    return new GraphQLClient(endpoint, {
        headers: {
            authorization: `Bearer ${process.env.FAUNA_API_KEY}`,
        },
    })
}

export {handler}