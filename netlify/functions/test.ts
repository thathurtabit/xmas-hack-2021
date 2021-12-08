import { Handler } from "@netlify/functions";

const handler: Handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello again, ${process.env.TEST_COOL_ENV_VARIABLE}` }),
    };
};

export { handler };
