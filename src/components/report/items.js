import { h } from 'hyperapp'
import { sortAndGroupRecords } from './counts'
import  { iscorrect,
          total_duration,
          duration_of,
          attempted,
          correctAnswerLetter,
          completed,
          skipped
        } from './calc_item'

// TODO: Need some extra data from the Sequence
// which will give me items that were SEEN...
// but may not have attempts and LRS records

const ItemGroup = ({records, item, seen}) => (
  <itemgroup
    id={records[0].context.item_id}
    name={item.external_id[0]}
    scored={iscorrect(records)}
    duration={total_duration(records)}
    durationFirstAttempt={duration_of('first_attempt')(records)}
    durationRationale={duration_of('rationale_time')(records)}
    durationSecondAttempt={duration_of('second_attempt')(records)}
    progid="UTDP.MultiChoiceItem.1"
    weight="1"
    presented={presented(records, seen)}
    visited={attempted(records)}
    >
    <item
      response={correctAnswerLetter(records, item).guess}
      correctresponse={correctAnswerLetter(records, item).correct}
      score={iscorrect(records)}
      scoremin="0"
      scoremax="1"
      scorenom="0"
      complete={completed(records)}
      skipped={skipped(records, seen)}
      marked="0" />
  </itemgroup>
)

export const Items = ({data, state}) => (
  sortAndGroupRecords(data)
    .map( ir => (<ItemGroup records={ir} 
      item={state.items.filter( i => i.id === ir[0].context.item_id)[0]}
      seen={state.sequence.previousMeasures.values.indxOf(ir[0].context.item_id) > -1} />))
)