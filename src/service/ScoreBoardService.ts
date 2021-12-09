export type ScoreBoard = {
    highScores: Score[]
}

export type Score = {
    name: string
    timeElapsedMs: number
    isPlayer: boolean
}

export const fetchScoreBoard: (String) => Promise<ScoreBoard> = (scoreId) =>
    fetch(`.netlify/functions/high-scores?scoreId=${scoreId}`)
        .then(res => res.json())
        .catch(ex => {
            console.warn("Failed fetching score board", ex)
            return {highScores: []}
        })