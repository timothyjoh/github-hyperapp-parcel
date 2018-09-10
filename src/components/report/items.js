import { h } from 'hyperapp'
import { sortByProp } from '../../lib/lib'
import { groupByItemId } from './counts'

const total_duration = rs => (
  rs.reduce((t, r) => (t + r.context.timing.timer.total), 0)
)
const duration_of = verb => rs => {
  let r = getByVerb(verb)(rs)
  return r ? r.context.timing.timer.total : 0
}
const getByVerb = verb => rs => rs.find( i => i.verb === verb )
const iscorrect = rs => correctAttempt(rs) ? 1 : 0
const correctAttempt = rs => rs.find(i => (i.context.correct === true))
const gradedAttempt = rs => correctAttempt(rs) || getByVerb('second_attempt')(rs)
const correctAnswerLetter = rs => {
  const letters = "ABCDE".split('')
  const ga = gradedAttempt(rs)
  let result = {guess: '', correct: ''}
  ga.context.item.responses.forEach((r,i) => {
    if(r.displayText === ga.context.chosen_answer) { result.guess = letters[i] }
    if(r.type[0] === 'correct') { result.correct = letters[i] }
  })
  return result
}

const skipped = rs => {
  let first = getByVerb('first_attempt')(rs)
  let second = getByVerb('second_attempt')(rs)
  let cor = iscorrect(rs)
  return first && !cor && !second ? 1 : 0
}
const attempted = rs => rs.find(i => i.verb === 'first_attempt') ? 1 : 0
const completed = rs => skipped(rs) ? 0 : 1

// TODO: Need some extra data from the Sequence
// which will give me items that were SEEN...
// but may not have attempts and LRS records

const ItemGroup = ({item}) => (
  <itemgroup
    id={item[0].context.item_id}
    name={item[0].context.item.external_id[0]}
    scored={iscorrect(item)}
    duration={total_duration(item)}
    durationFirstAttempt={duration_of('first_attempt')(item)}
    durationRationale={duration_of('rationale_time')(item)}
    durationSecondAttempt={duration_of('second_attempt')(item)}
    progid="UTDP.MultiChoiceItem.1"
    weight="1"
    presented={attempted(item)}
    visited={attempted(item)}
    >
    <item
      response={correctAnswerLetter(item).guess}
      correctresponse={correctAnswerLetter(item).correct}
      score={iscorrect(item)}
      scoremin="0"
      scoremax="1"
      scorenom="0"
      complete={completed(item)}
      skipped={skipped(item)}
      marked="0" />
  </itemgroup>
)

export const Items = ({records}) => (
  groupByItemId( records.sort(sortByProp('timestamp')) )
    .map( it => (<ItemGroup item={it} />))
)