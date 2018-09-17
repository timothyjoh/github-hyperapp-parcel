import { h } from 'hyperapp'

export const Demographics = ({state}) => (
<demographics appointmentid="" functioncode="" workstationname="">
  <demographic name="CandidateFirstName" value={state.user.firstname} />
  <demographic name="CandidateLastName" value={state.user.lastname} />
  <demographic name="AuthorizationNumber" value={state.user.external_id} />
  <demographic name="email" value={state.user.email} />
</demographics>
)