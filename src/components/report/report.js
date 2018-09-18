import { h } from 'hyperapp'
import { Demographics } from './demographics'
import { Exam } from './exam'
import { sortAndGroupRecords } from './counts'
import  { total_duration } from './calc_item'
import  { time_from_seconds } from '../../lib/lib'
import  { count_correct,
          count_skipped,
          count_incorrect,
          percentage_correct } from './calc_score'

const DocXML = ({state}) => (
  <simpleXMLResult xmlns="http://sdk.prometric.com/schemas/SimpleXMLResults1_3" version="1.3">
    <Demographics state={state} />
    { state.displaydata[0] ? (<Exam data={state.displaydata} state={state} />) : null }
  </simpleXMLResult>
)

const DownloadReportButton = ({disabled}) => (
  <button id='download_reportdoc' disabled={disabled ? 'disabled' : ''}>{disabled ? 'Loading...' : 'Download Report XML'}</button>
)
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
  <script id='reportdoc'>
    <DocXML state={state} />
  </script>
  <DownloadReportButton disabled={state.displaydata.length === 0} />
</div>
)