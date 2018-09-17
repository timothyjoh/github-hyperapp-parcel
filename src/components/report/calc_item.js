const getByVerb = verb => rs => rs.find( i => i.verb === verb )
const correctAttempt = rs => rs.find(i => (i.context.correct === true))
const gradedAttempt = rs => correctAttempt(rs) || getByVerb('second_attempt')(rs)

export const iscorrect = rs => correctAttempt(rs) ? 1 : 0

export const total_duration = rs => (
  rs.reduce((t, r) => (t + r.context.timing.timer.total), 0).toFixed(3)
)

export const duration_of = verb => rs => {
  let r = getByVerb(verb)(rs)
  return r ? r.context.timing.timer.total : 0
}

export const correctAnswerLetter = (rs, item) => {
  const letters = "ABCDE".split('')
  const ga = gradedAttempt(rs)
  let result = {guess: '', correct: ''}
  item.responses.forEach((r,i) => {
    if(r.displayText === ga.context.chosen_answer) { result.guess = letters[i] }
    if(r.type[0] === 'correct') { result.correct = letters[i] }
  })
  return result
}

export const presented = (rs, seen) => seen || rs.length > 0 ? 1 : 0
export const attempted = rs => rs.find(i => i.verb === 'first_attempt') ? 1 : 0
export const completed = rs => skipped(rs) ? 0 : 1
export const skipped = (rs, seen) => {
  let first = getByVerb('first_attempt')(rs)
  let second = getByVerb('second_attempt')(rs)
  let cor = iscorrect(rs)
  return first && !cor && !second ? 1 : 0
}