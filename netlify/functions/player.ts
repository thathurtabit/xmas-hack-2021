import {gql, GraphQLClient} from 'graphql-request'
import {Handler} from "@netlify/functions"

const handler: Handler = async (event) => {
    const name = event.queryStringParameters.name

    if (!name) {
        return {
            statusCode: 400,
            body: "Error: Must provide 'name' parameter"
        }
    }

    const data = await getGQLClient().request(query, {name})

    return {
        statusCode: 200,
        body: JSON.stringify(data),
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
    query FindMe($name: String!) {
        me: playerByName(name: $name) {
            _id
            name
            scores(_size: 5) {
                data {
                    timeElapsedMs
                }
            }
        }
    }
`

export {handler}
