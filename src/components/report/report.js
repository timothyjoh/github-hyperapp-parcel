import { h } from 'hyperapp'
import { Demographics } from './demographics'
import { Exam } from './exam'
import { sortAndGroupRecords } from './counts'



export const Report = ({state}) => (
<div id='report'>
  <h4>Records: {state.displaydata.length} | Unique Items: {sortAndGroupRecords(state.displaydata).length}</h4>
  <script>
  {/* <?xml version="1.0" encoding="UTF-8"?> */}
  <simpleXMLResult xmlns="http://sdk.prometric.com/schemas/SimpleXMLResults1_3" version="1.3">
    <Demographics user={state.user} />
    <Exam state={state} />
  </simpleXMLResult>
  </script>
</div>
)