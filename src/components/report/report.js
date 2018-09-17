import { h } from 'hyperapp'
import { Demographics } from './demographics'
import { Exam } from './exam'
import { sortAndGroupRecords } from './counts'
import  { total_duration } from './calc_item'
import { time_from_seconds } from '../../lib/lib'
import  { count_correct,
          count_skipped,
          count_incorrect,
          percentage_correct } from './calc_score'



export const Report = ({state}) => (
<div id='report'>
  <ul class='data'>
    <li>Records: {state.displaydata.length}</li>
    <li>Unique Items: {sortAndGroupRecords(state.displaydata).length}</li>
    <li>Correct: {count_correct(state.displaydata)}</li>
    <li>Wrong: {count_incorrect(state.displaydata)}</li>
    <li>Skipped: {count_skipped(state.displaydata)}</li>
    <li>Score: {percentage_correct(state.displaydata)}</li>
    <li>Duration: {time_from_seconds(total_duration(state.displaydata))}</li>
  </ul>
  <script>
  {/* <?xml version="1.0" encoding="UTF-8"?> */}
  <simpleXMLResult xmlns="http://sdk.prometric.com/schemas/SimpleXMLResults1_3" version="1.3">
    <Demographics user={state.user} />
    { state.displaydata[0] ? (<Exam data={state.displaydata} state={state} />) : null }
  </simpleXMLResult>
  </script>
</div>
)