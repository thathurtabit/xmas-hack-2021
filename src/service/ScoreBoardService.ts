export type ScoreBoard = {
  highScores: Score[]
}

export type Score = {
  name: string
  timeElapsedMs: number
  isPlayer: boolean
}

export const NO_SCORE_ID = "0000"

export const fetchScoreBoard: (String) => Promise<ScoreBoard> =
  (scoreId) =>
    fetch(`.netlify/functions/high-scores?scoreId=${scoreId}`)
      .then(res => res.json())
      .catch(ex => {
        console.warn("Failed fetching score board", ex)
        return {highScores: []}
      })

export const submitScore: (number, string) => Promise<string> =
  (survivalTime, name) =>
    fetch(`.netlify/functions/submit-score?elapsedTimeMs=${survivalTime}&name=${name}`)
    .then(res => res.json())
    .then(json => json.scoreID)
    .catch(err => {
      console.warn("Failed submitting high score", err)
      return NO_SCORE_ID
    })