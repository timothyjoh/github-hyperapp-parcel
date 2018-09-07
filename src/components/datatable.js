import { h } from 'hyperapp'
import { display_time, time_from_seconds, sortByProp } from '../lib/lib'

const LrsRow = ({row}) => (
  <tr>
    <td class='tiny'>{row.user_id}</td>
    <td class='tiny'>{row.context.item_id}</td>
    <td>{row.verb}</td>
    <td>{time_from_seconds(row.context.timing.timer.total)}</td>
    <td>{row.context.chosen_answer}</td>
    <td>{row.context.correct ? "Yes" : ''}</td>
    <td class='tiny'>{display_time(row.context.timing.timestamp)} {row.context.timing.timezone}</td>
    <td class='tiny'>{display_time(row.timestamp)}</td>
  </tr>
)

export const DataTable = ({ data }) => (
  <table id='datatable'>
    <thead>
      <th>User</th>
      <th>Item</th>
      <th>Verb</th>
      <th>Time</th>
      <th>Chosen Answer</th>
      <th>Correct?</th>
      <th>User Timestamp</th>
      <th>Server Timestamp</th>
    </thead>
    <tbody>
      {data.sort( sortByProp('timestamp') ).map((row) => (
        <LrsRow row={row}>
        </LrsRow>
      ))}
    </tbody>
  </table>
)
