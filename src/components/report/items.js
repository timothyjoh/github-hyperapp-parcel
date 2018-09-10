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
  sortAndGroupRecords(records)
    .map( it => (<ItemGroup item={it} />))
)